export interface CategoryAttribute {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "select" | "multi-select";
  required: boolean;
  options?: string[];
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children?: Category[];
  attributes?: CategoryAttribute[];
  source_marketplace?: string;
}

export type Marketplace = "aserai" | "trendyol" | "n11" | "hepsiburada";

export interface DragData {
  category: Category;
  marketplace: Marketplace;
  path: string[]; // breadcrumb path
}
