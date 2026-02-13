import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { Category } from "@/types/category";

// Flatten the tree into rows for aserai_categories table
function flattenTree(
  categories: Category[],
  parentId: string | null = null,
  order: number[] = [0]
): Array<{
  id: string;
  name: string;
  parent_id: string | null;
  sort_order: number;
  source_marketplace: string | null;
}> {
  const rows: Array<{
    id: string;
    name: string;
    parent_id: string | null;
    sort_order: number;
    source_marketplace: string | null;
  }> = [];

  for (const cat of categories) {
    rows.push({
      id: cat.id,
      name: cat.name,
      parent_id: parentId,
      sort_order: order[0]++,
      source_marketplace: cat.source_marketplace || null,
    });
    if (cat.children && cat.children.length > 0) {
      rows.push(...flattenTree(cat.children, cat.id, order));
    }
  }

  return rows;
}

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

    // 1. Save snapshot (always append new version)
    const { data: lastSnapshot } = await supabase
      .from("aserai_tree_snapshots")
      .select("version")
      .order("version", { ascending: false })
      .limit(1)
      .single();

    const newVersion = (lastSnapshot?.version || 0) + 1;

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

    // 2. Upsert categories (clear and rewrite)
    // First delete all existing categories
    await supabase.from("aserai_category_mappings").delete().neq("aserai_category_id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("aserai_categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // Insert categories in order (parents first)
    const flatRows = flattenTree(tree);
    if (flatRows.length > 0) {
      // Insert in batches to respect parent FK constraint
      // First: root categories, then children by depth
      const roots = flatRows.filter((r) => r.parent_id === null);
      const children = flatRows.filter((r) => r.parent_id !== null);

      if (roots.length > 0) {
        const { error: rootErr } = await supabase
          .from("aserai_categories")
          .insert(roots);
        if (rootErr) {
          console.error("Root kategori kaydetme hatası:", rootErr);
        }
      }

      // Insert children in order (they're already ordered depth-first)
      // We need to do them one by one or in topological order to satisfy FK
      if (children.length > 0) {
        for (const child of children) {
          const { error: childErr } = await supabase
            .from("aserai_categories")
            .insert(child);
          if (childErr) {
            console.error(`Kategori kaydetme hatası (${child.name}):`, childErr);
          }
        }
      }
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
