/**
 * N11 Service - delegates to integration layer
 * Kept for backward compatibility. New code should use lib/integrations/n11 directly.
 */
import { n11Cache } from "@/lib/integrations/n11/cache";
import { N11Category, N11AttributeResponse } from "@/types/marketplace-api";

export async function getN11Categories(): Promise<N11Category[]> {
  await n11Cache.prefetchCategories();
  return n11Cache.getCachedCategoryTree() as unknown as N11Category[];
}

export async function getN11CategoryAttributes(
  categoryId: number
): Promise<N11AttributeResponse> {
  const result = await n11Cache.getCategoryAttributes(categoryId);
  return result as unknown as N11AttributeResponse;
}
