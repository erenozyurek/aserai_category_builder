/**
 * Hepsiburada Service - delegates to integration layer
 * Kept for backward compatibility. New code should use lib/integrations/hepsiburada directly.
 */
import { hepsiburadaCache } from "@/lib/integrations/hepsiburada/cache";
import { HepsiburadaCategory, HepsiburadaAttribute } from "@/types/marketplace-api";

export async function getHepsiburadaCategories(): Promise<HepsiburadaCategory[]> {
  await hepsiburadaCache.prefetchCategories();
  return hepsiburadaCache.getCachedCategories() as unknown as HepsiburadaCategory[];
}

export async function getHepsiburadaCategoryAttributes(
  categoryId: number
): Promise<HepsiburadaAttribute[]> {
  const result = await hepsiburadaCache.getCategoryAttributes(categoryId);
  return result as unknown as HepsiburadaAttribute[];
}
