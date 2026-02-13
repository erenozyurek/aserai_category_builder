import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        tree: [],
        version: 0,
        categoryCount: 0,
      });
    }

    // Fetch the latest snapshot
    const { data, error } = await supabase
      .from("aserai_tree_snapshots")
      .select("tree_data, version, category_count, created_at")
      .order("version", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // No data yet is not an error
      if (error.code === "PGRST116") {
        return NextResponse.json({
          success: true,
          tree: [],
          version: 0,
          categoryCount: 0,
        });
      }
      console.error("Load error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tree: data.tree_data,
      version: data.version,
      categoryCount: data.category_count,
      savedAt: data.created_at,
    });
  } catch (error: any) {
    console.error("Load error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Yükleme hatası" },
      { status: 500 }
    );
  }
}
