import { NextResponse } from "next/server";
import { trendyolCache } from "@/lib/integrations/trendyol/cache";
import { convertTrendyolCategories } from "@/lib/converters";

export async function GET() {
  try {
    // Use cache layer - prefetch then get cached tree
    await trendyolCache.prefetchCategories();
    const categoryTree = trendyolCache.getCachedCategoryTree();

    // Convert to our internal format
    const categories = convertTrendyolCategories(categoryTree);

    return NextResponse.json({
      success: true,
      data: categories,
      categoryTree,
      count: categoryTree.length,
    });
  } catch (error: any) {
    console.error("Trendyol categories route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Trendyol API hatası" },
      { status: 500 }
    );
  }
}
