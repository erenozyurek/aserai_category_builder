// N11 API Configuration
export const n11Config = {
  // Base URLs
  BASE_URL: "https://api.n11.com",
  CDN_BASE_URL: "https://api.n11.com",

  // App credentials (config defaults)
  APP_KEY: process.env.N11_APP_KEY || "0b8b3d6e-905b-4f5c-a671-8b00cf9e4916",
  APP_SECRET: process.env.N11_APP_SECRET || "WvbrurmwzjKrCVD2",

  // Store credentials
  STORE_USERNAME: "testtmagazaa",
  STORE_PASSWORD: "Deneme.12345",

  // Integrator
  INTEGRATOR_NAME: "aserai_dev",

  // Endpoints
  ENDPOINTS: {
    CDN_CATEGORIES: "/cdn/categories",
    CATEGORY_ATTRIBUTES: (categoryId: number) =>
      `/cdn/category/${categoryId}/attribute`,
  },

  // Cache TTL
  CACHE_TTL: {
    CATEGORIES: 60 * 60 * 1000, // 1 hour
    ATTRIBUTES: 30 * 60 * 1000, // 30 minutes
  },
};
