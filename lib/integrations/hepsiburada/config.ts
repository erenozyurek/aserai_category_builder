// Hepsiburada API Configuration
export const hepsiburadaConfig = {
  // Base URLs
  BASE_URL: "https://mpop-sit.hepsiburada.com",
  PRODUCTION_URL: "https://mpop.hepsiburada.com",

  // Merchant credentials
  MERCHANT_ID: "3f95e71f-c39e-4266-9eb4-c154807e87f7",
  USERNAME: "3f95e71f-c39e-4266-9eb4-c154807e87f7",
  PASSWORD: "d8rCXfXqWJW2",

  // User-Agent
  USER_AGENT: "aserai_dev",

  // Endpoints
  ENDPOINTS: {
    ALL_CATEGORIES: "/product/api/categories/get-all-categories",
    CATEGORY_ATTRIBUTES: (categoryId: number) =>
      `/product/api/categories/${categoryId}/attributes`,
  },

  // Default query params for categories
  // leaf=true → only leaf categories (parents are reconstructed from paths[])
  CATEGORIES_PARAMS: {
    page: 0,
    size: 5000,
    leaf: true,
    available: true,
  },

  // Cache TTL
  CACHE_TTL: {
    CATEGORIES: 60 * 60 * 1000, // 1 hour
    ATTRIBUTES: 30 * 60 * 1000, // 30 minutes
  },
};

/**
 * Generate Basic Auth header value: Basic base64(USERNAME:PASSWORD)
 */
export function getHepsiburadaAuthToken(): string {
  const credentials = `${hepsiburadaConfig.USERNAME}:${hepsiburadaConfig.PASSWORD}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}
