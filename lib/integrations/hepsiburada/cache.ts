import { hepsiburadaClient, HepsiburadaRawCategory, HepsiburadaRawAttribute } from "./client";
import { hepsiburadaConfig } from "./config";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface HepsiburadaCategoryNode {
  categoryId: number;
  name: string;
  parentCategoryId?: number;
  leaf?: boolean;
  children?: HepsiburadaCategoryNode[];
}

/**
 * Hepsiburada Cache Layer
 * - Fetches leaf categories and builds tree using paths[] field
 * - Categories TTL: 1 hour
 * - Attributes TTL: 30 minutes
 * - Loading lock prevents duplicate requests
 */
class HepsiburadaCache {
  private flatCategoriesCache: CacheEntry<HepsiburadaRawCategory[]> | null = null;
  private categoryTreeCache: CacheEntry<HepsiburadaCategoryNode[]> | null = null;
  private attributesCache: Map<number, CacheEntry<HepsiburadaRawAttribute[]>> = new Map();
  private loadingCategories: Promise<void> | null = null;
  private loadingAttributes: Map<number, Promise<HepsiburadaRawAttribute[]>> = new Map();

  private isCacheValid<T>(entry: CacheEntry<T> | null | undefined, ttl: number): boolean {
    if (!entry) return false;
    return Date.now() - entry.timestamp < ttl;
  }

  /**
   * Build tree from flat leaf categories using the paths[] array.
   *
   * Each leaf category has paths like:
   *   ["Altın / Takı / Mücevher", "Külçe, Ziynet, Cumhuriyet Altını", "Gram Külçe Altın", "0,10 Gram Altın"]
   * 
   * The last element is the leaf itself; preceding elements are the folder hierarchy.
   * We create virtual folder nodes for each intermediate path segment and attach
   * the real leaf category at the end.
   */
  private buildTreeFromPaths(flat: HepsiburadaRawCategory[]): HepsiburadaCategoryNode[] {
    const roots: HepsiburadaCategoryNode[] = [];
    // Map from full-path-key → node for dedup of intermediate folders
    const folderMap = new Map<string, HepsiburadaCategoryNode>();

    for (const cat of flat) {
      const paths = cat.paths;
      if (!paths || paths.length === 0) {
        // No path info → add as root leaf
        roots.push({
          categoryId: cat.categoryId,
          name: cat.name,
          leaf: true,
        });
        continue;
      }

      // Walk through path segments and create/find folder nodes
      let currentChildren = roots;
      let pathKey = "";

      for (let i = 0; i < paths.length; i++) {
        const segmentName = paths[i];
        pathKey = pathKey ? `${pathKey}/${segmentName}` : segmentName;
        const isLast = i === paths.length - 1;

        if (isLast) {
          // This is the actual leaf category – use real categoryId
          currentChildren.push({
            categoryId: cat.categoryId,
            name: segmentName,
            leaf: true,
          });
        } else {
          // Intermediate folder – find or create
          let folder = folderMap.get(pathKey);
          if (!folder) {
            folder = {
              // Virtual folder id – negative hash to avoid collision with real ids
              categoryId: this.hashString(pathKey),
              name: segmentName,
              leaf: false,
              children: [],
            };
            folderMap.set(pathKey, folder);
            currentChildren.push(folder);
          }
          currentChildren = folder.children!;
        }
      }
    }

    // Sort: folders first, then alphabetically
    this.sortTree(roots);
    return roots;
  }

  /**
   * Simple string → negative-number hash for virtual folder IDs
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash < 0 ? hash : -hash - 1; // Always negative to avoid collisions with real IDs
  }

  /**
   * Recursively sort tree: folders (children.length > 0) first, then alphabetical
   */
  private sortTree(nodes: HepsiburadaCategoryNode[]): void {
    nodes.sort((a, b) => {
      const aIsFolder = a.children && a.children.length > 0 ? 0 : 1;
      const bIsFolder = b.children && b.children.length > 0 ? 0 : 1;
      if (aIsFolder !== bIsFolder) return aIsFolder - bIsFolder;
      return a.name.localeCompare(b.name, "tr");
    });
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        this.sortTree(node.children);
      }
    }
  }

  /**
   * Prefetch categories - uses loading lock
   */
  async prefetchCategories(): Promise<void> {
    if (this.isCacheValid(this.flatCategoriesCache, hepsiburadaConfig.CACHE_TTL.CATEGORIES)) {
      return;
    }

    if (this.loadingCategories) {
      await this.loadingCategories;
      return;
    }

    this.loadingCategories = this._fetchAndCacheCategories();
    try {
      await this.loadingCategories;
    } finally {
      this.loadingCategories = null;
    }
  }

  private async _fetchAndCacheCategories(): Promise<void> {
    console.log("[HepsiburadaCache] Fetching categories from API...");
    const categories = await hepsiburadaClient.getAllCategories();
    const now = Date.now();

    // Store flat list
    this.flatCategoriesCache = { data: categories, timestamp: now };

    // Build tree from paths[] field
    const tree = this.buildTreeFromPaths(categories);
    this.categoryTreeCache = { data: tree, timestamp: now };

    console.log(`[HepsiburadaCache] Cached ${categories.length} leaf categories → ${tree.length} root folders`);
  }

  /**
   * Get cached category tree
   */
  getCachedCategoryTree(): HepsiburadaCategoryNode[] {
    return this.categoryTreeCache?.data || [];
  }

  /**
   * Get cached flat categories
   */
  getCachedCategories(): HepsiburadaRawCategory[] {
    return this.flatCategoriesCache?.data || [];
  }

  /**
   * Get category attributes with caching
   */
  async getCategoryAttributes(categoryId: number): Promise<HepsiburadaRawAttribute[]> {
    const cached = this.attributesCache.get(categoryId);
    if (this.isCacheValid(cached, hepsiburadaConfig.CACHE_TTL.ATTRIBUTES)) {
      return cached!.data;
    }

    const existing = this.loadingAttributes.get(categoryId);
    if (existing) {
      return existing;
    }

    const promise = hepsiburadaClient.getCategoryAttributes(categoryId);
    this.loadingAttributes.set(categoryId, promise);

    try {
      const result = await promise;
      this.attributesCache.set(categoryId, {
        data: result,
        timestamp: Date.now(),
      });
      return result;
    } finally {
      this.loadingAttributes.delete(categoryId);
    }
  }

  invalidate(): void {
    this.flatCategoriesCache = null;
    this.categoryTreeCache = null;
    this.attributesCache.clear();
  }
}

// Singleton
export const hepsiburadaCache = new HepsiburadaCache();
