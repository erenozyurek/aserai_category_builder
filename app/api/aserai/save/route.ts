import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { Category } from "@/types/category";

// Allow larger payloads and longer execution
export const maxDuration = 30; // 30 seconds
export const dynamic = "force-dynamic";

// Count categories recursively
function countTree(categories: Category[]): number {
  return categories.reduce(
    (acc, cat) => acc + 1 + (cat.children ? countTree(cat.children) : 0),
    0
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tree: Category[] = body.tree;

    if (!tree || !Array.isArray(tree)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz veri: tree dizisi bekleniyor" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Supabase bağlantısı yapılandırılmamış. .env.local dosyasını kontrol edin." },
        { status: 503 }
      );
    }

    const categoryCount = countTree(tree);

    // Get latest version
    const { data: lastSnapshot } = await supabase
      .from("aserai_tree_snapshots")
      .select("version")
      .order("version", { ascending: false })
      .limit(1)
      .single();

    const newVersion = (lastSnapshot?.version || 0) + 1;

    // Save snapshot (the load API reads from this — it's the single source of truth)
    const { error: snapshotError } = await supabase
      .from("aserai_tree_snapshots")
      .insert({
        tree_data: tree,
        category_count: categoryCount,
        version: newVersion,
      });

    if (snapshotError) {
      console.error("Snapshot kaydetme hatası:", snapshotError);
      return NextResponse.json(
        { success: false, error: `Snapshot hatası: ${snapshotError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      version: newVersion,
      categoryCount,
      message: `${categoryCount} kategori başarıyla kaydedildi (v${newVersion})`,
    });
  } catch (error: any) {
    console.error("Save error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Kaydetme hatası" },
      { status: 500 }
    );
  }
}
