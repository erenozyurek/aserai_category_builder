import { trendyolConfig } from "./config";

// Raw Trendyol API response types
export interface TrendyolRawCategory {
  id: number;
  name: string;
  parentId?: number;
  subCategories?: TrendyolRawCategory[];
}

export interface TrendyolRawAttributeValue {
  id: number;
  name: string;
}

export interface TrendyolRawAttribute {
  attribute: {
    id: number;
    name: string;
  };
  required: boolean;
  allowCustom: boolean;
  varianter: boolean;
  slicer: boolean;
  attributeValues?: TrendyolRawAttributeValue[];
}

export interface TrendyolRawAttributeResponse {
  id: number;
  name: string;
  displayName: string;
  categoryAttributes: TrendyolRawAttribute[];
}

/**
 * Trendyol API Client
 * All requests go through the Gateway proxy at gate.dizelweb.com.tr
 */
class TrendyolClient {
  private buildGatewayUrl(endpoint: string, method: string = "GET"): string {
    const targetUrl = `${trendyolConfig.BASE_URL}${endpoint}`;
    return `${trendyolConfig.GATEWAY_URL}?endpoint=${encodeURIComponent(targetUrl)}&method=${method}&auth=${trendyolConfig.AUTH_TOKEN}`;
  }

  async getCategories(): Promise<TrendyolRawCategory[]> {
    const url = this.buildGatewayUrl(trendyolConfig.ENDPOINTS.CATEGORIES);
    console.log("[TrendyolClient] Fetching categories from gateway...");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[TrendyolClient] Categories error:", response.status, text);
      throw new Error(`Trendyol API error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    // Trendyol returns { categories: [...] }
    return data.categories || data;
  }

  async getCategoryAttributes(categoryId: number): Promise<TrendyolRawAttributeResponse> {
    const url = this.buildGatewayUrl(
      trendyolConfig.ENDPOINTS.CATEGORY_ATTRIBUTES(categoryId)
    );
    console.log(`[TrendyolClient] Fetching attributes for category ${categoryId}...`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[TrendyolClient] Attributes error:", response.status, text);
      throw new Error(`Trendyol attributes API error: ${response.status} - ${text}`);
    }

    return response.json();
  }
}

// Singleton instance
export const trendyolClient = new TrendyolClient();
