import { NextResponse } from "next/server";
import { hepsiburadaCache, HepsiburadaCategoryNode } from "@/lib/integrations/hepsiburada/cache";
import { Category } from "@/types/category";

/**
 * Convert cache tree nodes to our internal Category format
 */
function convertTreeToCategories(
  nodes: HepsiburadaCategoryNode[],
  parentId: string | null = null
): Category[] {
  return nodes.map((node) => {
    const id = `hb-${node.categoryId}`;
    const cat: Category = {
      id,
      name: node.name,
      parentId,
    };
    if (node.children && node.children.length > 0) {
      cat.children = convertTreeToCategories(node.children, id);
    }
    return cat;
  });
}

export async function GET() {
  try {
    await hepsiburadaCache.prefetchCategories();
    const tree = hepsiburadaCache.getCachedCategoryTree();

    // Convert tree to our internal Category format
    const categories = convertTreeToCategories(tree);

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error: any) {
    console.error("Hepsiburada categories route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Hepsiburada API hatası" },
      { status: 500 }
    );
  }
}
