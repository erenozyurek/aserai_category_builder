"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import { CategoryTreePanel } from "@/components/CategoryTree";
import { AseraiPanel } from "@/components/AseraiPanel";
import { DragOverlayContent } from "@/components/DragOverlayContent";
import { Category, Marketplace } from "@/types/category";
import {
  ShoppingBag,
  Store,
  Package,
  Target,
  RefreshCw,
  Loader2,
  Save,
  Download,
  CheckCircle2,
} from "lucide-react";

// Deep clone helper
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Generate unique ID
function generateId(): string {
  return `aserai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Recursively add category to a parent in the tree
function addCategoryToTree(
  categories: Category[],
  parentId: string | null,
  newCategory: Category
): Category[] {
  if (parentId === null) {
    return [...categories, newCategory];
  }

  return categories.map((cat) => {
    if (cat.id === parentId) {
      return {
        ...cat,
        children: [...(cat.children || []), newCategory],
      };
    }
    if (cat.children && cat.children.length > 0) {
      return {
        ...cat,
        children: addCategoryToTree(cat.children, parentId, newCategory),
      };
    }
    return cat;
  });
}

// Recursively remove category from tree
function removeCategoryFromTree(
  categories: Category[],
  id: string
): Category[] {
  return categories
    .filter((cat) => cat.id !== id)
    .map((cat) => ({
      ...cat,
      children: cat.children
        ? removeCategoryFromTree(cat.children, id)
        : undefined,
    }));
}

// Convert a marketplace category and its entire subtree to Aserai categories
function convertToAseraiCategory(
  sourceCategory: Category,
  parentId: string | null,
  marketplace: string
): Category {
  const newId = generateId();
  const converted: Category & { source_marketplace?: string } = {
    id: newId,
    name: sourceCategory.name,
    parentId: parentId,
    attributes: sourceCategory.attributes
      ? sourceCategory.attributes.map((attr) => ({
          ...attr,
          id: `aserai-attr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        }))
      : undefined,
    source_marketplace: marketplace,
  };

  if (sourceCategory.children && sourceCategory.children.length > 0) {
    converted.children = sourceCategory.children.map((child) =>
      convertToAseraiCategory(child, newId, marketplace)
    );
  }

  return converted;
}

export default function CategoryDashboard() {
  const [aseraiCategories, setAseraiCategories] = useState<Category[]>([]);
  const [trendyolCategories, setTrendyolCategories] = useState<Category[]>([]);
  const [n11Categories, setN11Categories] = useState<Category[]>([]);
  const [hepsiburadaCategories, setHepsiburadaCategories] = useState<Category[]>([]);

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    trendyol: false,
    n11: false,
    hepsiburada: false,
  });
  const [errorStates, setErrorStates] = useState<Record<string, string | null>>({
    trendyol: null,
    n11: null,
    hepsiburada: null,
  });

  const [saving, setSaving] = useState(false);
  const [loadingTree, setLoadingTree] = useState(false);
  const [savedVersion, setSavedVersion] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [activeDragData, setActiveDragData] = useState<{
    category: Category;
    marketplace: Marketplace;
    path: string[];
  } | null>(null);
  const [activeDropId, setActiveDropId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // ─── Fetch Marketplace Categories ──────────────────────────

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchMarketplaceCategories = useCallback(
    async (marketplace: string) => {
      setLoadingStates((prev) => ({ ...prev, [marketplace]: true }));
      setErrorStates((prev) => ({ ...prev, [marketplace]: null }));

      try {
        const res = await fetch(
          `/api/marketplace/${marketplace}/categories`
        );
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error || "API hatası");
        }

        const categories: Category[] = json.data;

        switch (marketplace) {
          case "trendyol":
            setTrendyolCategories(categories);
            break;
          case "n11":
            setN11Categories(categories);
            break;
          case "hepsiburada":
            setHepsiburadaCategories(categories);
            break;
        }

        showNotification(
          `✅ ${marketplace} kategorileri yüklendi (${countCategories(categories)} kategori)`
        );
      } catch (error: any) {
        console.error(`${marketplace} fetch error:`, error);
        setErrorStates((prev) => ({
          ...prev,
          [marketplace]: error.message || "Bağlantı hatası",
        }));
        showNotification(`❌ ${marketplace} kategorileri yüklenemedi: ${error.message}`);
      } finally {
        setLoadingStates((prev) => ({ ...prev, [marketplace]: false }));
      }
    },
    [showNotification]
  );

  // Load all marketplace categories on mount
  useEffect(() => {
    fetchMarketplaceCategories("trendyol");
    fetchMarketplaceCategories("n11");
    fetchMarketplaceCategories("hepsiburada");
  }, [fetchMarketplaceCategories]);

  // ─── Load Aserai tree from database on mount ──────────────
  const loadAseraiTree = useCallback(async () => {
    setLoadingTree(true);
    try {
      const res = await fetch("/api/aserai/load");
      const json = await res.json();
      if (json.success && json.tree && json.tree.length > 0) {
        setAseraiCategories(json.tree);
        setSavedVersion(json.version);
        setHasUnsavedChanges(false);
        showNotification(
          `📂 Aserai ağacı yüklendi (v${json.version}, ${json.categoryCount} kategori)`
        );
      }
    } catch (error: any) {
      console.error("Aserai tree load error:", error);
    } finally {
      setLoadingTree(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadAseraiTree();
  }, [loadAseraiTree]);

  // ─── Save Aserai tree to database ─────────────────────────
  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/aserai/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tree: aseraiCategories }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedVersion(json.version);
        setHasUnsavedChanges(false);
        showNotification(
          `💾 Kaydedildi — v${json.version}, ${json.categoryCount} kategori`
        );
      } else {
        showNotification(`❌ Kaydetme hatası: ${json.error}`);
      }
    } catch (error: any) {
      console.error("Save error:", error);
      showNotification(`❌ Kaydetme hatası: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }, [aseraiCategories, saving, showNotification]);

  // Track unsaved changes
  const markUnsaved = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    if (data) {
      setActiveDragData({
        category: data.category as Category,
        marketplace: data.marketplace as Marketplace,
        path: (data.path as string[]) || [],
      });
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setActiveDropId(over.id as string);
    } else {
      setActiveDropId(null);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveDragData(null);
      setActiveDropId(null);

      if (!over) return;

      const data = active.data.current;
      if (!data) return;

      const sourceCategory = data.category as Category;
      const marketplace = data.marketplace as Marketplace;
      const overData = over.data.current;
      const targetParentId = overData?.parentId as string | null;

      // Convert and add to Aserai tree
      const newCategory = convertToAseraiCategory(
        sourceCategory,
        targetParentId,
        marketplace
      );

      setAseraiCategories((prev) =>
        addCategoryToTree(prev, targetParentId, newCategory)
      );
      markUnsaved();

      const attrCount = sourceCategory.attributes?.length || 0;
      showNotification(
        `✅ "${sourceCategory.name}" eklendi${attrCount > 0 ? ` (${attrCount} attribute ile)` : ""} — Kaynak: ${marketplace}`
      );
    },
    [showNotification, markUnsaved]
  );

  const handleAddRoot = useCallback(() => {
    const name = prompt("Yeni ana kategori adı:");
    if (!name) return;

    const newCat: Category = {
      id: generateId(),
      name,
      parentId: null,
    };
    setAseraiCategories((prev) => [...prev, newCat]);
    markUnsaved();
    showNotification(`✅ "${name}" ana kategorisi oluşturuldu`);
  }, [showNotification, markUnsaved]);

  const handleAddChild = useCallback(
    (parentId: string) => {
      const name = prompt("Yeni alt kategori adı:");
      if (!name) return;

      const newCat: Category = {
        id: generateId(),
        name,
        parentId,
      };
      setAseraiCategories((prev) =>
        addCategoryToTree(prev, parentId, newCat)
      );
      markUnsaved();
      showNotification(`✅ "${name}" alt kategorisi eklendi`);
    },
    [showNotification, markUnsaved]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
      setAseraiCategories((prev) => removeCategoryFromTree(prev, id));
      markUnsaved();
      showNotification("🗑️ Kategori silindi");
    },
    [showNotification, markUnsaved]
  );

  // count all categories recursively
  function countCategories(categories: Category[]): number {
    return categories.reduce((acc, cat) => {
      return acc + 1 + (cat.children ? countCategories(cat.children) : 0);
    }, 0);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Target size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                ASERAİ Kategori İnşa Sistemi
              </h1>
              <p className="text-xs text-zinc-400">
                Master kategori ağacını oluşturun — Pazaryerlerinden sürükle &
                bırak
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span>
              Aserai:{" "}
              <strong className="text-emerald-500">
                {countCategories(aseraiCategories)}
              </strong>{" "}
              kategori
            </span>
            {savedVersion !== null && (
              <span className="text-zinc-500">v{savedVersion}</span>
            )}
            {hasUnsavedChanges && (
              <span className="text-amber-400 font-medium">● Kaydedilmemiş</span>
            )}
            <button
              onClick={handleSave}
              disabled={saving || aseraiCategories.length === 0}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                saving
                  ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                  : hasUnsavedChanges
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Kaydet
                </>
              )}
            </button>
          </div>
        </header>

        {/* Notification */}
        {notification && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-800 text-sm px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            {notification}
          </div>
        )}

        {/* Main grid - 4 panels */}
        <div className="flex-1 grid grid-cols-4 gap-4 p-4 min-h-0">
          {/* Aserai (Left) */}
          <AseraiPanel
            categories={aseraiCategories}
            onAddChild={handleAddChild}
            onAddRoot={handleAddRoot}
            onDelete={handleDelete}
            activeDropId={activeDropId}
          />

          {/* Trendyol */}
          <CategoryTreePanel
            title="Trendyol"
            marketplace="trendyol"
            categories={trendyolCategories}
            color="#f27a1a"
            icon={<ShoppingBag size={16} className="text-orange-500" />}
            loading={loadingStates.trendyol}
            error={errorStates.trendyol}
            onRefresh={() => fetchMarketplaceCategories("trendyol")}
          />

          {/* N11 */}
          <CategoryTreePanel
            title="N11"
            marketplace="n11"
            categories={n11Categories}
            color="#7b2d8e"
            icon={<Store size={16} className="text-purple-600" />}
            loading={loadingStates.n11}
            error={errorStates.n11}
            onRefresh={() => fetchMarketplaceCategories("n11")}
          />

          {/* Hepsiburada */}
          <CategoryTreePanel
            title="Hepsiburada"
            marketplace="hepsiburada"
            categories={hepsiburadaCategories}
            color="#ff6000"
            icon={<Package size={16} className="text-orange-600" />}
            loading={loadingStates.hepsiburada}
            error={errorStates.hepsiburada}
            onRefresh={() => fetchMarketplaceCategories("hepsiburada")}
          />
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragData && (
          <DragOverlayContent
            category={activeDragData.category}
            marketplace={activeDragData.marketplace}
            path={activeDragData.path}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
