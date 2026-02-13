import { n11Config } from "./config";

// Raw N11 API response types
export interface N11RawCategory {
  id: number;
  name: string;
  subCategories?: N11RawCategory[] | null;
}

export interface N11RawAttributeValue {
  id: number;
  value: string;
}

export interface N11RawAttribute {
  attributeId: number;
  categoryId: number;
  attributeName: string;
  isMandatory: boolean;
  isVariant: boolean;
  isSlicer: boolean;
  isCustomValue: boolean;
  attributeOrder: number;
  attributeValues?: N11RawAttributeValue[];
}

export interface N11RawAttributeResponse {
  id: number;
  name: string;
  categoryAttributes: N11RawAttribute[];
}

/**
 * N11 API Client
 * Uses appkey/appsecret headers for CDN endpoints
 */
class N11Client {
  private getCdnHeaders(): HeadersInit {
    return {
      Accept: "application/json",
      appkey: n11Config.APP_KEY,
      appsecret: n11Config.APP_SECRET,
    };
  }

  /**
   * Fetch categories from CDN endpoint
   * Uses appkey + appsecret headers
   */
  async getCategories(): Promise<N11RawCategory[]> {
    const url = `${n11Config.CDN_BASE_URL}${n11Config.ENDPOINTS.CDN_CATEGORIES}`;
    console.log("[N11Client] Fetching categories from CDN...");

    const response = await fetch(url, {
      method: "GET",
      headers: this.getCdnHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[N11Client] Categories error:", response.status, text);
      throw new Error(`N11 API error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data.categories || data;
  }

  /**
   * Fetch attributes for a specific category
   */
  async getCategoryAttributes(categoryId: number): Promise<N11RawAttributeResponse> {
    const url = `${n11Config.CDN_BASE_URL}${n11Config.ENDPOINTS.CATEGORY_ATTRIBUTES(categoryId)}`;
    console.log(`[N11Client] Fetching attributes for category ${categoryId}...`);

    const response = await fetch(url, {
      method: "GET",
      headers: this.getCdnHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[N11Client] Attributes error:", response.status, text);
      throw new Error(`N11 attributes API error: ${response.status} - ${text}`);
    }

    return response.json();
  }
}

// Singleton instance
export const n11Client = new N11Client();
