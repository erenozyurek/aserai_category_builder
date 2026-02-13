import { NextRequest, NextResponse } from "next/server";
import { n11Cache } from "@/lib/integrations/n11/cache";
import { convertN11Attributes } from "@/lib/converters";

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
    const rawAttributes = await n11Cache.getCategoryAttributes(catId);
    const attributes = convertN11Attributes(
      rawAttributes.categoryAttributes || []
    );
    return NextResponse.json({ success: true, data: attributes });
  } catch (error: any) {
    console.error("N11 attributes route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "N11 attribute hatası" },
      { status: 500 }
    );
  }
}
