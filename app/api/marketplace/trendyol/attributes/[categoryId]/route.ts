import { NextRequest, NextResponse } from "next/server";
import { trendyolCache } from "@/lib/integrations/trendyol/cache";
import { convertTrendyolAttributes } from "@/lib/converters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const catId = parseInt(categoryId, 10);
    if (isNaN(catId)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz kategori ID" },
        { status: 400 }
      );
    }

    // Use cache layer for attributes
    const rawAttributes = await trendyolCache.getCategoryAttributes(catId);
    const attributes = convertTrendyolAttributes(
      rawAttributes.categoryAttributes || []
    );
    return NextResponse.json({ success: true, data: attributes });
  } catch (error: any) {
    console.error("Trendyol attributes route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Trendyol attribute hatası" },
      { status: 500 }
    );
  }
}
