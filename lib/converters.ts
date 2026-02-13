import { Category, CategoryAttribute } from "@/types/category";
import { TrendyolCategory, TrendyolAttribute } from "@/types/marketplace-api";
import { N11Category, N11Attribute } from "@/types/marketplace-api";
import { HepsiburadaCategory, HepsiburadaAttribute } from "@/types/marketplace-api";

// ─── Trendyol ───────────────────────────────────────────────

export function convertTrendyolCategories(
  categories: TrendyolCategory[]
): Category[] {
  return categories.map((cat) => convertTrendyolCategory(cat, null));
}

function convertTrendyolCategory(
  cat: TrendyolCategory,
  parentId: string | null
): Category {
  const id = `ty-${cat.id}`;
  const result: Category = {
    id,
    name: cat.name,
    parentId,
  };

  if (cat.subCategories && cat.subCategories.length > 0) {
    result.children = cat.subCategories.map((sub) =>
      convertTrendyolCategory(sub, id)
    );
  }

  return result;
}

export function convertTrendyolAttributes(
  attrs: TrendyolAttribute[]
): CategoryAttribute[] {
  return attrs.map((a) => ({
    id: `ty-attr-${a.attribute.id}`,
    name: a.attribute.name,
    type:
      a.attributeValues && a.attributeValues.length > 0 ? "select" : "string",
    required: a.required,
    options: a.attributeValues?.map((v) => v.name),
  }));
}

// ─── N11 ────────────────────────────────────────────────────

export function convertN11Categories(categories: N11Category[]): Category[] {
  return categories.map((cat) => convertN11Category(cat, null));
}

function convertN11Category(
  cat: N11Category,
  parentId: string | null
): Category {
  const id = `n11-${cat.id}`;
  const result: Category = {
    id,
    name: cat.name,
    parentId,
  };

  if (cat.subCategories && cat.subCategories.length > 0) {
    result.children = cat.subCategories.map((sub) =>
      convertN11Category(sub, id)
    );
  }

  return result;
}

export function convertN11Attributes(
  attrs: N11Attribute[]
): CategoryAttribute[] {
  return attrs.map((a) => ({
    id: `n11-attr-${a.attributeId}`,
    name: a.attributeName,
    type:
      a.attributeValues && a.attributeValues.length > 0 ? "select" : "string",
    required: a.isMandatory,
    options: a.attributeValues?.map((v) => v.value),
  }));
}

// ─── Hepsiburada ────────────────────────────────────────────

export function convertHepsiburadaCategories(
  categories: HepsiburadaCategory[]
): Category[] {
  // Hepsiburada may return flat list or hierarchical
  // If flat (with parentCategoryId), build tree
  if (categories.length > 0 && categories[0].subCategories === undefined) {
    return buildHepsiburadaTree(categories);
  }
  return categories.map((cat) => convertHepsiburadaCategory(cat, null));
}

function convertHepsiburadaCategory(
  cat: HepsiburadaCategory,
  parentId: string | null
): Category {
  const id = `hb-${cat.categoryId}`;
  const result: Category = {
    id,
    name: cat.name,
    parentId,
  };

  if (cat.subCategories && cat.subCategories.length > 0) {
    result.children = cat.subCategories.map((sub) =>
      convertHepsiburadaCategory(sub, id)
    );
  }

  return result;
}

function buildHepsiburadaTree(flat: HepsiburadaCategory[]): Category[] {
  const map = new Map<number, Category>();
  const roots: Category[] = [];

  // Create all nodes
  for (const cat of flat) {
    map.set(cat.categoryId, {
      id: `hb-${cat.categoryId}`,
      name: cat.name,
      parentId: cat.parentCategoryId
        ? `hb-${cat.parentCategoryId}`
        : null,
      children: [],
    });
  }

  // Build tree
  for (const cat of flat) {
    const node = map.get(cat.categoryId)!;
    if (cat.parentCategoryId && map.has(cat.parentCategoryId)) {
      const parent = map.get(cat.parentCategoryId)!;
      parent.children = parent.children || [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  // Remove empty children arrays
  function cleanEmpty(cats: Category[]): Category[] {
    return cats.map((c) => {
      if (c.children && c.children.length === 0) {
        const { children, ...rest } = c;
        return rest;
      }
      if (c.children) {
        return { ...c, children: cleanEmpty(c.children) };
      }
      return c;
    });
  }

  return cleanEmpty(roots);
}

export function convertHepsiburadaAttributes(
  attrs: HepsiburadaAttribute[]
): CategoryAttribute[] {
  if (!Array.isArray(attrs)) return [];
  return attrs.map((a) => {
    // Map HB type to our type system
    let type: CategoryAttribute["type"] = "string";
    if (a.type === "enum") type = "select";
    else if (a.type === "integer" || a.type === "numeric") type = "number";
    else if (a.type === "boolean") type = "boolean";

    return {
      id: `hb-attr-${a.id}`,
      name: a.name,
      type,
      required: a.mandatory,
      options: a.values?.map((v) => v.value),
    };
  });
}
