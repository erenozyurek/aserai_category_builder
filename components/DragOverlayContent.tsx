"use client";

import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import { GripVertical, FolderOpen } from "lucide-react";
import { Category, Marketplace } from "@/types/category";

const marketplaceColors: Record<string, string> = {
  trendyol: "#f27a1a",
  n11: "#7b2d8e",
  hepsiburada: "#ff6000",
};

interface DragOverlayContentProps {
  category: Category | null;
  marketplace: Marketplace | null;
  path: string[];
}

export function DragOverlayContent({
  category,
  marketplace,
  path,
}: DragOverlayContentProps) {
  if (!category || !marketplace) return null;

  const color = marketplaceColors[marketplace] || "#888";

  return (
    <div
      className="bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border-2 px-3 py-2 min-w-[200px] max-w-[300px] cursor-grabbing"
      style={{ borderColor: color }}
    >
      <div className="flex items-center gap-2">
        <GripVertical size={14} className="text-zinc-400" />
        <FolderOpen size={14} style={{ color }} />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">
          {category.name}
        </span>
      </div>
      {path.length > 0 && (
        <div className="mt-1 text-[10px] text-zinc-400 truncate">
          {path.join(" > ")}
        </div>
      )}
      {category.attributes && category.attributes.length > 0 && (
        <div className="mt-1.5 text-[10px] text-blue-500">
          {category.attributes.length} attribute taşınacak
        </div>
      )}
      <div
        className="mt-1 text-[10px] font-medium uppercase tracking-wider"
        style={{ color }}
      >
        {marketplace}
      </div>
    </div>
  );
}
