/**
 * Trendyol Service - delegates to integration layer
 * Kept for backward compatibility. New code should use lib/integrations/trendyol directly.
 */
import { trendyolCache } from "@/lib/integrations/trendyol/cache";
import { TrendyolRawCategory, TrendyolRawAttributeResponse } from "@/lib/integrations/trendyol/client";
import { TrendyolCategory, TrendyolAttributeResponse } from "@/types/marketplace-api";

export async function getTrendyolCategories(): Promise<TrendyolCategory[]> {
  await trendyolCache.prefetchCategories();
  // The raw categories match the TrendyolCategory type
  return trendyolCache.getCachedCategories() as unknown as TrendyolCategory[];
}

export async function getTrendyolCategoryAttributes(
  categoryId: number
): Promise<TrendyolAttributeResponse> {
  const result = await trendyolCache.getCategoryAttributes(categoryId);
  return result as unknown as TrendyolAttributeResponse;
}
