import { NextResponse } from "next/server";
import { n11Cache } from "@/lib/integrations/n11/cache";
import { convertN11Categories } from "@/lib/converters";

export async function GET() {
  try {
    // Use cache layer - prefetch then get cached tree
    await n11Cache.prefetchCategories();
    const categoryTree = n11Cache.getCachedCategoryTree();

    // Convert to our internal format
    const categories = convertN11Categories(categoryTree);

    return NextResponse.json({
      success: true,
      data: categories,
      tree: categoryTree,
      count: categoryTree.length,
    });
  } catch (error: any) {
    console.error("N11 categories route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "N11 API hatası" },
      { status: 500 }
    );
  }
}
