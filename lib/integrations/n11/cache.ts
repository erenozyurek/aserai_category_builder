import { n11Client, N11RawCategory, N11RawAttributeResponse } from "./client";
import { n11Config } from "./config";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * N11 Cache Layer
 * - Categories TTL: 1 hour
 * - Attributes TTL: 30 minutes
 * - Loading lock prevents duplicate requests
 */
class N11Cache {
  private categoriesCache: CacheEntry<N11RawCategory[]> | null = null;
  private attributesCache: Map<number, CacheEntry<N11RawAttributeResponse>> = new Map();
  private loadingCategories: Promise<void> | null = null;
  private loadingAttributes: Map<number, Promise<N11RawAttributeResponse>> = new Map();

  private isCacheValid<T>(entry: CacheEntry<T> | null | undefined, ttl: number): boolean {
    if (!entry) return false;
    return Date.now() - entry.timestamp < ttl;
  }

  /**
   * Prefetch categories with loading lock
   */
  async prefetchCategories(): Promise<void> {
    if (this.isCacheValid(this.categoriesCache, n11Config.CACHE_TTL.CATEGORIES)) {
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
    console.log("[N11Cache] Fetching categories from API...");
    const categories = await n11Client.getCategories();
    const now = Date.now();

    this.categoriesCache = { data: categories, timestamp: now };
    console.log(`[N11Cache] Cached ${categories.length} top-level categories`);
  }

  /**
   * Get cached category tree
   */
  getCachedCategoryTree(): N11RawCategory[] {
    return this.categoriesCache?.data || [];
  }

  /**
   * Get category attributes with caching
   */
  async getCategoryAttributes(categoryId: number): Promise<N11RawAttributeResponse> {
    const cached = this.attributesCache.get(categoryId);
    if (this.isCacheValid(cached, n11Config.CACHE_TTL.ATTRIBUTES)) {
      return cached!.data;
    }

    const existing = this.loadingAttributes.get(categoryId);
    if (existing) {
      return existing;
    }

    const promise = n11Client.getCategoryAttributes(categoryId);
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
    this.categoriesCache = null;
    this.attributesCache.clear();
  }
}

// Singleton
export const n11Cache = new N11Cache();
