"use client";

import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Folder,
  Plus,
  Tag,
  Trash2,
  GripVertical,
  Target,
  Search,
  X,
} from "lucide-react";
import { Category, CategoryAttribute, Marketplace } from "@/types/category";

function AttributeList({ attributes }: { attributes: CategoryAttribute[] }) {
  return (
    <div className="ml-6 mt-1 mb-1 space-y-1">
      {attributes.map((attr) => (
        <div
          key={attr.id}
          className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 py-0.5 px-2 rounded bg-emerald-50 dark:bg-emerald-900/20"
        >
          <Tag size={10} className="shrink-0 text-emerald-400" />
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

interface AseraiCategoryItemProps {
  category: Category;
  level: number;
  onAddChild: (parentId: string) => void;
  onDelete: (id: string) => void;
  activeDropId: string | null;
}

function AseraiCategoryItem({
  category,
  level,
  onAddChild,
  onDelete,
  activeDropId,
}: AseraiCategoryItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAttributes, setShowAttributes] = useState(false);

  const hasChildren = category.children && category.children.length > 0;
  const hasAttributes = category.attributes && category.attributes.length > 0;
  const isLeaf = !hasChildren;
  const droppableId = `aserai-drop-${category.id}`;

  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
    data: {
      parentId: category.id,
      type: "category",
    },
  });

  const isDropTarget = isOver || activeDropId === droppableId;

  return (
    <div ref={setNodeRef}>
      <div
        className={`
          group flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer
          transition-all duration-150
          ${
            isDropTarget
              ? "bg-emerald-100 dark:bg-emerald-900/40 ring-2 ring-emerald-400 ring-inset"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }
          ${isOpen ? "bg-zinc-50/50 dark:bg-zinc-800/30" : ""}
        `}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) {
            setIsOpen(!isOpen);
          } else if (hasAttributes) {
            setShowAttributes(!showAttributes);
          }
        }}
      >
        {/* Expand/collapse icon */}
        {hasChildren ? (
          isOpen ? (
            <ChevronDown size={14} className="shrink-0 text-emerald-500" />
          ) : (
            <ChevronRight size={14} className="shrink-0 text-emerald-500" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {/* Folder/leaf icon */}
        {hasChildren ? (
          isOpen ? (
            <FolderOpen size={14} className="shrink-0 text-emerald-500" />
          ) : (
            <Folder size={14} className="shrink-0 text-emerald-500" />
          )
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
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

        {/* Source badge */}
        {category.source_marketplace && (
          <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded font-mono shrink-0">
            {category.source_marketplace}
          </span>
        )}

        {/* Attribute badge */}
        {hasAttributes && (
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-medium shrink-0">
            {category.attributes!.length} attr
          </span>
        )}

        {/* Action buttons */}
        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(category.id);
            }}
            className="p-0.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-500"
            title="Alt kategori ekle"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category.id);
            }}
            className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-400"
            title="Sil"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Attributes */}
      {isLeaf && showAttributes && hasAttributes && (
        <AttributeList attributes={category.attributes!} />
      )}

      {/* Children */}
      {isOpen && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <AseraiCategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              onAddChild={onAddChild}
              onDelete={onDelete}
              activeDropId={activeDropId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Extend Category with source info
interface AseraiCategory extends Category {
  source_marketplace?: string;
}

interface AseraiPanelProps {
  categories: AseraiCategory[];
  onAddChild: (parentId: string) => void;
  onAddRoot: () => void;
  onDelete: (id: string) => void;
  activeDropId: string | null;
}

// Recursive search filter: keep category if it or any descendant matches
function filterCategories(categories: Category[], query: string): Category[] {
  if (!query.trim()) return categories;
  const lowerQuery = query.toLowerCase();

  return categories
    .map((cat) => {
      const nameMatches = cat.name.toLowerCase().includes(lowerQuery);
      const filteredChildren = cat.children
        ? filterCategories(cat.children, query)
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

export function AseraiPanel({
  categories,
  onAddChild,
  onAddRoot,
  onDelete,
  activeDropId,
}: AseraiPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCategories = filterCategories(categories, searchQuery);

  const rootDroppableId = "aserai-drop-root";
  const { isOver, setNodeRef } = useDroppable({
    id: rootDroppableId,
    data: {
      parentId: null,
      type: "root",
    },
  });

  const isRootDropTarget = isOver || activeDropId === rootDroppableId;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50"
        style={{ borderTopColor: "#10b981", borderTopWidth: "3px" }}
      >
        <Target size={16} className="text-emerald-500" />
        <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
          ASERAİ Kategorileri
        </h3>
        <span className="ml-auto text-xs text-emerald-500/70">
          Master System
        </span>
      </div>

      {/* Search + Add Root */}
      <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 space-y-1.5">
        <div className="relative">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kategori ara..."
            className="w-full text-xs py-1.5 pl-7 pr-7 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
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
        <button
          onClick={onAddRoot}
          className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 px-2 py-1.5 rounded-md transition-colors w-full"
        >
          <Plus size={14} />
          <span>Yeni Ana Kategori Ekle</span>
        </button>
      </div>

      {/* Drop zone / Tree */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 overflow-y-auto p-2 scrollbar-thin transition-colors duration-200
          ${isRootDropTarget ? "bg-emerald-50/50 dark:bg-emerald-950/30" : ""}
        `}
      >
        {categories.length === 0 ? (
          <div
            className={`
            flex flex-col items-center justify-center h-full py-12
            border-2 border-dashed rounded-lg transition-colors duration-200
            ${
              isRootDropTarget
                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                : "border-zinc-200 dark:border-zinc-700"
            }
          `}
          >
            <GripVertical
              size={32}
              className={`mb-2 transition-colors ${
                isRootDropTarget
                  ? "text-emerald-400"
                  : "text-zinc-300 dark:text-zinc-600"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                isRootDropTarget
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-400"
              }`}
            >
              {isRootDropTarget
                ? "Buraya bırakın!"
                : "Kategori sürükleyerek bırakın"}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Pazaryerlerinden kategori taşıyın
            </p>
          </div>
        ) : (
          <>
            {filteredCategories.map((cat) => (
              <AseraiCategoryItem
                key={cat.id}
                category={cat}
                level={0}
                onAddChild={onAddChild}
                onDelete={onDelete}
                activeDropId={activeDropId}
              />
            ))}
            {/* Drop area at bottom */}
            <div
              className={`
                mt-2 py-4 border-2 border-dashed rounded-lg text-center transition-colors duration-200
                ${
                  isRootDropTarget
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                    : "border-zinc-200 dark:border-zinc-700"
                }
              `}
            >
              <p
                className={`text-xs ${
                  isRootDropTarget
                    ? "text-emerald-500"
                    : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {isRootDropTarget
                  ? "Ana kategori olarak ekle"
                  : "Buraya sürükleyin (ana kategori)"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
