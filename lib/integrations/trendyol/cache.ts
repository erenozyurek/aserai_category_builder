import { trendyolClient, TrendyolRawCategory, TrendyolRawAttributeResponse } from "./client";
import { trendyolConfig } from "./config";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CategoryNode {
  id: number;
  name: string;
  parentId?: number;
  subCategories?: CategoryNode[];
}

/**
 * Trendyol Cache Layer
 * - Categories TTL: 1 hour
 * - Attributes TTL: 30 minutes
 * - Loading lock: prevents multiple simultaneous API calls
 * - Stores both flat list and tree structure
 */
class TrendyolCache {
  private categoriesCache: CacheEntry<TrendyolRawCategory[]> | null = null;
  private categoryTreeCache: CacheEntry<CategoryNode[]> | null = null;
  private attributesCache: Map<number, CacheEntry<TrendyolRawAttributeResponse>> = new Map();
  private loadingCategories: Promise<void> | null = null;
  private loadingAttributes: Map<number, Promise<TrendyolRawAttributeResponse>> = new Map();

  private isCacheValid<T>(entry: CacheEntry<T> | null | undefined, ttl: number): boolean {
    if (!entry) return false;
    return Date.now() - entry.timestamp < ttl;
  }

  /**
   * Prefetch categories - uses loading lock to prevent duplicate requests
   */
  async prefetchCategories(): Promise<void> {
    // Cache still valid
    if (this.isCacheValid(this.categoriesCache, trendyolConfig.CACHE_TTL.CATEGORIES)) {
      return;
    }

    // Already loading - wait for it
    if (this.loadingCategories) {
      await this.loadingCategories;
      return;
    }

    // Start loading
    this.loadingCategories = this._fetchAndCacheCategories();
    try {
      await this.loadingCategories;
    } finally {
      this.loadingCategories = null;
    }
  }

  private async _fetchAndCacheCategories(): Promise<void> {
    console.log("[TrendyolCache] Fetching categories from API...");
    const categories = await trendyolClient.getCategories();
    const now = Date.now();

    // Store flat categories
    this.categoriesCache = { data: categories, timestamp: now };

    // Build and store tree
    this.categoryTreeCache = { data: categories, timestamp: now };

    console.log(`[TrendyolCache] Cached ${categories.length} top-level categories`);
  }

  /**
   * Get cached category tree (must call prefetchCategories first)
   */
  getCachedCategoryTree(): CategoryNode[] {
    return this.categoryTreeCache?.data || [];
  }

  /**
   * Get cached flat categories
   */
  getCachedCategories(): TrendyolRawCategory[] {
    return this.categoriesCache?.data || [];
  }

  /**
   * Get category attributes with caching
   */
  async getCategoryAttributes(categoryId: number): Promise<TrendyolRawAttributeResponse> {
    // Check cache
    const cached = this.attributesCache.get(categoryId);
    if (this.isCacheValid(cached, trendyolConfig.CACHE_TTL.ATTRIBUTES)) {
      return cached!.data;
    }

    // Check if already loading
    const existing = this.loadingAttributes.get(categoryId);
    if (existing) {
      return existing;
    }

    // Fetch
    const promise = trendyolClient.getCategoryAttributes(categoryId);
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

  /**
   * Clear all caches
   */
  invalidate(): void {
    this.categoriesCache = null;
    this.categoryTreeCache = null;
    this.attributesCache.clear();
  }
}

// Singleton - persists for server lifetime
export const trendyolCache = new TrendyolCache();
