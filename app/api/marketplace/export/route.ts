import { NextResponse } from "next/server";
import { trendyolCache } from "@/lib/integrations/trendyol/cache";
import { n11Cache } from "@/lib/integrations/n11/cache";
import { hepsiburadaCache } from "@/lib/integrations/hepsiburada/cache";
import { convertTrendyolCategories } from "@/lib/converters";

export async function GET() {
  try {
    // Fetch all three in parallel
    const [trendyolRaw, n11Raw, hepsiburadaRaw] = await Promise.all([
      (async () => {
        await trendyolCache.prefetchCategories();
        return trendyolCache.getCachedCategoryTree();
      })(),
      (async () => {
        await n11Cache.prefetchCategories();
        return n11Cache.getCachedCategoryTree();
      })(),
      (async () => {
        await hepsiburadaCache.prefetchCategories();
        return hepsiburadaCache.getCachedCategoryTree();
      })(),
    ]);

    const trendyolCategories = trendyolRaw
      ? convertTrendyolCategories(trendyolRaw)
      : [];

    // HB cache already returns converted tree
    const hepsiburadaCategories = hepsiburadaRaw || [];

    // N11 - need to convert similar to categories route
    const n11Categories = n11Raw || [];

    const exportData = {
      exportedAt: new Date().toISOString(),
      version: 1,
      marketplaces: {
        trendyol: {
          count: countCategories(trendyolCategories),
          categories: trendyolCategories,
        },
        n11: {
          count: countCategories(n11Categories),
          categories: n11Categories,
        },
        hepsiburada: {
          count: countCategories(hepsiburadaCategories),
          categories: hepsiburadaCategories,
        },
      },
    };

    return NextResponse.json({
      success: true,
      data: exportData,
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Dışa aktarma hatası" },
      { status: 500 }
    );
  }
}

function countCategories(categories: any[]): number {
  return categories.reduce(
    (acc: number, cat: any) =>
      acc + 1 + (cat.children ? countCategories(cat.children) : 0),
    0
  );
}
