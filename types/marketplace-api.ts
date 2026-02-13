// Trendyol API response types

export interface TrendyolCategory {
  id: number;
  name: string;
  parentId?: number;
  subCategories?: TrendyolCategory[];
}

export interface TrendyolAttributeValue {
  id: number;
  name: string;
}

export interface TrendyolAttribute {
  attribute: {
    id: number;
    name: string;
  };
  required: boolean;
  allowCustom: boolean;
  varianter: boolean;
  slicer: boolean;
  attributeValues?: TrendyolAttributeValue[];
}

export interface TrendyolAttributeResponse {
  id: number;
  name: string;
  displayName: string;
  categoryAttributes: TrendyolAttribute[];
}

// N11 API response types

export interface N11Category {
  id: number;
  name: string;
  subCategories?: N11Category[] | null;
}

export interface N11AttributeValue {
  id: number;
  value: string;
}

export interface N11Attribute {
  attributeId: number;
  categoryId: number;
  attributeName: string;
  isMandatory: boolean;
  isVariant: boolean;
  isSlicer: boolean;
  isCustomValue: boolean;
  attributeOrder: number;
  attributeValues?: N11AttributeValue[];
}

export interface N11AttributeResponse {
  id: number;
  name: string;
  categoryAttributes: N11Attribute[];
}

// Hepsiburada API response types

export interface HepsiburadaCategory {
  categoryId: number;
  name: string;
  parentCategoryId?: number;
  leaf?: boolean;
  available?: boolean;
  subCategories?: HepsiburadaCategory[];
  paths?: string[];
}

export interface HepsiburadaAttributeValue {
  id: string;
  value: string;
}

export interface HepsiburadaAttribute {
  id: string;
  name: string;
  mandatory: boolean;
  multiValue: boolean;
  type: string;
  values?: HepsiburadaAttributeValue[];
}
