"use client";

import React, { useState, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  Tag,
  FolderOpen,
  Folder,
  Loader2,
  RefreshCw,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import { Category, CategoryAttribute, Marketplace } from "@/types/category";

interface CategoryTreeItemProps {
  category: Category;
  marketplace: Marketplace;
  level: number;
  path: string[];
  draggable?: boolean;
  onAttributesLoaded?: (categoryId: string, attributes: CategoryAttribute[]) => void;
}

function AttributeList({ attributes }: { attributes: CategoryAttribute[] }) {
  return (
    <div className="ml-6 mt-1 mb-1 space-y-1">
      {attributes.map((attr) => (
        <div
          key={attr.id}
          className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 py-0.5 px-2 rounded bg-zinc-50 dark:bg-zinc-800/50"
        >
          <Tag size={10} className="shrink-0 text-zinc-400" />
          <span className="font-medium text-zinc-600 dark:text-zinc-300">
            {attr.name}
          </span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-400">{attr.type}</span>
          {attr.required && (
            <span className="text-red-400 text-[10px] font-semibold">
              Zorunlu
            </span>
          )}
          {attr.options && attr.options.length > 0 && (
            <span className="text-zinc-400 truncate max-w-[180px]">
              [{attr.options.slice(0, 3).join(", ")}
              {attr.options.length > 3 && `... +${attr.options.length - 3}`}]
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function DraggableWrapper({
  id,
  data,
  disabled,
  children,
}: {
  id: string;
  data: Record<string, unknown>;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data,
      disabled,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

// Extract the raw category ID number from our prefixed format (e.g. "ty-1234" -> "1234")
function extractRawCategoryId(id: string): string {
  // remove marketplace prefix like "ty-", "n11-", "hb-"
  return id.replace(/^(ty|n11|hb)-/, "");
}

// Map marketplace to API route prefix
function getMarketplaceApiPath(marketplace: Marketplace): string {
  switch (marketplace) {
    case "trendyol":
      return "trendyol";
    case "n11":
      return "n11";
    case "hepsiburada":
      return "hepsiburada";
    default:
      return marketplace;
  }
}

export function CategoryTreeItem({
  category,
  marketplace,
  level,
  path,
  draggable = true,
  onAttributesLoaded,
}: CategoryTreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAttributes, setShowAttributes] = useState(false);
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [attributeError, setAttributeError] = useState<string | null>(null);

  const hasChildren = category.children && category.children.length > 0;
  const hasAttributes = category.attributes && category.attributes.length > 0;
  const isLeaf = !hasChildren;
  const currentPath = [...path, category.name];

  const dragData = {
    category,
    marketplace,
    path: currentPath,
  };

  // Fetch attributes on demand for leaf categories
  const handleLeafClick = useCallback(async () => {
    if (hasAttributes) {
      setShowAttributes(!showAttributes);
      return;
    }

    // Already loading
    if (loadingAttributes) return;

    // Fetch attributes from API
    setLoadingAttributes(true);
    setAttributeError(null);

    try {
      const rawId = extractRawCategoryId(category.id);
      const apiPath = getMarketplaceApiPath(marketplace);
      const res = await fetch(
        `/api/marketplace/${apiPath}/attributes/${rawId}`
      );
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Attribute yükleme hatası");
      }

      const attrs: CategoryAttribute[] = Array.isArray(json.data) ? json.data : [];
      if (attrs.length > 0) {
        // Update category in-place
        category.attributes = attrs;
        onAttributesLoaded?.(category.id, attrs);
        setShowAttributes(true);
      } else {
        setAttributeError("Bu kategoride attribute bulunamadı");
      }
    } catch (err: any) {
      console.error("Attribute fetch error:", err);
      setAttributeError(err.message || "Yükleme hatası");
    } finally {
      setLoadingAttributes(false);
    }
  }, [category, marketplace, hasAttributes, showAttributes, loadingAttributes, onAttributesLoaded]);

  const content = (
    <div>
      <div
        className={`
          group flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer
          transition-all duration-150
          hover:bg-zinc-100 dark:hover:bg-zinc-800
          ${isOpen ? "bg-zinc-50 dark:bg-zinc-800/50" : ""}
        `}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) {
            setIsOpen(!isOpen);
          } else if (isLeaf) {
            handleLeafClick();
          }
        }}
      >
        {/* Drag handle */}
        {draggable && (
          <GripVertical
            size={14}
            className="shrink-0 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
          />
        )}

        {/* Expand/collapse icon */}
        {hasChildren ? (
          isOpen ? (
            <ChevronDown size={14} className="shrink-0 text-zinc-400" />
          ) : (
            <ChevronRight size={14} className="shrink-0 text-zinc-400" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {/* Folder/leaf icon */}
        {hasChildren ? (
          isOpen ? (
            <FolderOpen size={14} className="shrink-0 text-amber-500" />
          ) : (
            <Folder size={14} className="shrink-0 text-amber-500" />
          )
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
        )}

        {/* Category name */}
        <span
          className={`text-sm truncate ${
            isLeaf
              ? "text-zinc-600 dark:text-zinc-300"
              : "font-medium text-zinc-700 dark:text-zinc-200"
          }`}
        >
          {category.name}
        </span>

        {/* Attribute badge */}
        {hasAttributes && (
          <span className="ml-auto text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-medium shrink-0">
            {category.attributes!.length} attr
          </span>
        )}

        {/* Loading indicator for attributes */}
        {loadingAttributes && (
          <Loader2
            size={12}
            className="ml-auto shrink-0 text-blue-400 animate-spin"
          />
        )}

        {/* Leaf indicator (click to load attrs) */}
        {isLeaf && !hasAttributes && !loadingAttributes && (
          <span className="ml-auto text-[10px] text-zinc-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            tıkla
          </span>
        )}

        {/* Children count */}
        {hasChildren && (
          <span className="ml-auto text-[10px] text-zinc-400 shrink-0">
            {category.children!.length}
          </span>
        )}
      </div>

      {/* Show attributes for leaf nodes */}
      {isLeaf && showAttributes && hasAttributes && (
        <AttributeList attributes={category.attributes!} />
      )}

      {/* Attribute loading state */}
      {isLeaf && loadingAttributes && (
        <div className="ml-6 mt-1 mb-1 flex items-center gap-2 text-xs text-zinc-400 px-2 py-1">
          <Loader2 size={12} className="animate-spin" />
          <span>Attribute&apos;lar yükleniyor...</span>
        </div>
      )}

      {/* Attribute error */}
      {isLeaf && attributeError && (
        <div className="ml-6 mt-1 mb-1 flex items-center gap-2 text-xs text-red-400 px-2 py-1">
          <AlertCircle size={12} />
          <span>{attributeError}</span>
        </div>
      )}

      {/* Children */}
      {isOpen && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              marketplace={marketplace}
              level={level + 1}
              path={currentPath}
              draggable={draggable}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (draggable) {
    return (
      <DraggableWrapper
        id={`${marketplace}-${category.id}`}
        data={dragData}
        disabled={false}
      >
        {content}
      </DraggableWrapper>
    );
  }

  return content;
}

interface CategoryTreePanelProps {
  title: string;
  marketplace: Marketplace;
  categories: Category[];
  color: string;
  draggable?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

// Recursive search filter: keep category if it or any descendant matches
function filterCategoriesForSearch(categories: Category[], query: string): Category[] {
  if (!query.trim()) return categories;
  const lowerQuery = query.toLowerCase();

  return categories
    .map((cat) => {
      const nameMatches = cat.name.toLowerCase().includes(lowerQuery);
      const filteredChildren = cat.children
        ? filterCategoriesForSearch(cat.children, query)
        : [];

      if (nameMatches || filteredChildren.length > 0) {
        return {
          ...cat,
          children: filteredChildren.length > 0 ? filteredChildren : cat.children,
        };
      }
      return null;
    })
    .filter(Boolean) as Category[];
}

export function CategoryTreePanel({
  title,
  marketplace,
  categories,
  color,
  draggable = true,
  icon,
  loading = false,
  error = null,
  onRefresh,
}: CategoryTreePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCategories = filterCategoriesForSearch(categories, searchQuery);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800"
        style={{ borderTopColor: color, borderTopWidth: "3px" }}
      >
        {icon}
        <h3 className="font-semibold text-sm text-zinc-700 dark:text-zinc-200">
          {title}
        </h3>
        <span className="ml-auto flex items-center gap-2 text-xs text-zinc-400">
          {loading && <Loader2 size={12} className="animate-spin" />}
          {!loading && categories.length > 0 && (
            <span>{categories.length} kategori</span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              title="Yenile"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            </button>
          )}
        </span>
      </div>

      {/* Search bar */}
      {categories.length > 0 && (
        <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="relative">
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kategori ara..."
              className="w-full text-xs py-1.5 pl-7 pr-7 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
              style={{ '--tw-ring-color': color } as React.CSSProperties}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X size={13} />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-[10px] text-zinc-400 mt-1 pl-1">
              {filteredCategories.length} sonuç
            </p>
          )}
        </div>
      )}

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {loading && categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600 py-12">
            <Loader2 size={32} className="mb-2 animate-spin" style={{ color }} />
            <p className="text-sm">Kategoriler yükleniyor...</p>
            <p className="text-xs mt-1 text-zinc-400">
              {title} API&apos;den çekiliyor
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 py-12 px-4">
            <AlertCircle size={32} className="mb-2 text-red-400" />
            <p className="text-sm text-red-400 font-medium">Hata oluştu</p>
            <p className="text-xs mt-1 text-zinc-400 text-center">{error}</p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-3 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
              >
                <RefreshCw size={12} />
                Tekrar Dene
              </button>
            )}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600 py-12">
            <Folder size={32} className="mb-2 opacity-50" />
            <p className="text-sm">Henüz kategori yok</p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
              >
                <RefreshCw size={12} />
                Yükle
              </button>
            )}
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <CategoryTreeItem
              key={cat.id}
              category={cat}
              marketplace={marketplace}
              level={0}
              path={[]}
              draggable={draggable}
            />
          ))
        )}
      </div>
    </div>
  );
}
