import { NextRequest, NextResponse } from "next/server";
import { hepsiburadaCache } from "@/lib/integrations/hepsiburada/cache";
import { convertHepsiburadaAttributes } from "@/lib/converters";

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
    const rawAttributes = await hepsiburadaCache.getCategoryAttributes(catId);
    const attributes = convertHepsiburadaAttributes(rawAttributes || []);
    return NextResponse.json({ success: true, data: attributes });
  } catch (error: any) {
    console.error("Hepsiburada attributes route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Hepsiburada attribute hatası" },
      { status: 500 }
    );
  }
}
