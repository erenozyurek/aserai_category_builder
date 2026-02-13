import { hepsiburadaConfig, getHepsiburadaAuthToken } from "./config";

// Raw Hepsiburada API response types
export interface HepsiburadaRawCategory {
  categoryId: number;
  name: string;
  parentCategoryId?: number;
  leaf?: boolean;
  available?: boolean;
  paths?: string[];
}

export interface HepsiburadaRawAttributeValue {
  id: string;
  value: string;
}

export interface HepsiburadaRawAttribute {
  id: string;
  name: string;
  mandatory: boolean;
  multiValue: boolean;
  type: string;
  values?: HepsiburadaRawAttributeValue[];
}

/**
 * Hepsiburada API Client
 * Uses Basic Auth: base64(USERNAME:PASSWORD)
 * Fetches categories with pagination (page/size params)
 */
class HepsiburadaClient {
  private getHeaders(): HeadersInit {
    return {
      Authorization: getHepsiburadaAuthToken(),
      "User-Agent": hepsiburadaConfig.USER_AGENT,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  /**
   * Fetch all categories with pagination
   * Iterates through all pages until no more data
   */
  async getAllCategories(): Promise<HepsiburadaRawCategory[]> {
    const allCategories: HepsiburadaRawCategory[] = [];
    let page = 0;
    const size = hepsiburadaConfig.CATEGORIES_PARAMS.size;
    let hasMore = true;

    while (hasMore) {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        leaf: hepsiburadaConfig.CATEGORIES_PARAMS.leaf.toString(),
        available: hepsiburadaConfig.CATEGORIES_PARAMS.available.toString(),
      });

      const url = `${hepsiburadaConfig.BASE_URL}${hepsiburadaConfig.ENDPOINTS.ALL_CATEGORIES}?${params}`;
      console.log(`[HepsiburadaClient] Fetching categories page ${page}...`);

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("[HepsiburadaClient] Categories error:", response.status, text);
        throw new Error(`Hepsiburada API error: ${response.status} - ${text}`);
      }

      const data = await response.json();
      const categories: HepsiburadaRawCategory[] = data.data || data || [];

      if (categories.length === 0) {
        hasMore = false;
      } else {
        allCategories.push(...categories);
        if (categories.length < size) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    console.log(`[HepsiburadaClient] Total categories fetched: ${allCategories.length}`);
    return allCategories;
  }

  /**
   * Fetch attributes for a specific category
   * HB returns: { data: { baseAttributes: [], attributes: [], variantAttributes: [] } }
   * We merge all three arrays into one flat list.
   */
  async getCategoryAttributes(categoryId: number): Promise<HepsiburadaRawAttribute[]> {
    const url = `${hepsiburadaConfig.BASE_URL}${hepsiburadaConfig.ENDPOINTS.CATEGORY_ATTRIBUTES(categoryId)}?version=2`;
    console.log(`[HepsiburadaClient] Fetching attributes for category ${categoryId}...`);

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[HepsiburadaClient] Attributes error:", response.status, text);
      throw new Error(`Hepsiburada attributes API error: ${response.status} - ${text}`);
    }

    const json = await response.json();

    // Handle API-level error (e.g. "Category is not a leaf category")
    if (json.success === false) {
      console.warn(`[HepsiburadaClient] API returned error for category ${categoryId}: ${json.message}`);
      return [];
    }

    const data = json.data;

    // If data is already an array, return it
    if (Array.isArray(data)) {
      return data;
    }

    // data is an object with baseAttributes, attributes, variantAttributes
    if (data && typeof data === "object") {
      const base: HepsiburadaRawAttribute[] = Array.isArray(data.baseAttributes) ? data.baseAttributes : [];
      const attrs: HepsiburadaRawAttribute[] = Array.isArray(data.attributes) ? data.attributes : [];
      const variants: HepsiburadaRawAttribute[] = Array.isArray(data.variantAttributes) ? data.variantAttributes : [];
      return [...base, ...attrs, ...variants];
    }

    return [];
  }
}

// Singleton instance
export const hepsiburadaClient = new HepsiburadaClient();
