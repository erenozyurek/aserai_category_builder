// Trendyol API Configuration
export const trendyolConfig = {
  // Gateway proxy (all requests go through this)
  GATEWAY_URL: "https://gate.dizelweb.com.tr/",

  // Trendyol API base
  BASE_URL: "https://apigw.trendyol.com",

  // Seller credentials
  SELLER_ID: "944254",
  API_KEY: "D4MHXiH51nAizADyCw5h",
  API_SECRET: "AyjDEMoVdMMgYVzS4Xi2",

  // Pre-computed Base64 auth token: base64(API_KEY:API_SECRET)
  AUTH_TOKEN: "RDRNSFhpSDUxbkFpekFEeUN3NWg6QXlqREVNb1ZkTU1nWVZ6UzRYaTI=",

  // Integration reference
  INTEGRATION_REFERENCE: "36f07439-e79d-46a5-8f90-34dd1f00806c",

  // Endpoints
  ENDPOINTS: {
    CATEGORIES: "/integration/product/product-categories",
    CATEGORY_ATTRIBUTES: (categoryId: number) =>
      `/integration/product/product-categories/${categoryId}/attributes`,
  },

  // Cache TTL
  CACHE_TTL: {
    CATEGORIES: 60 * 60 * 1000, // 1 hour
    ATTRIBUTES: 30 * 60 * 1000, // 30 minutes
  },
};
