import type { Locale } from "@/i18n/config";

export type LocalizedText = Record<Locale, string>;
export type StockStatus = "in_stock" | "out_of_stock";

export type DemoCategory = {
  id: string;
  slug: string;
  icon: "fridge" | "stove" | "vacuum";
  name: LocalizedText;
  description: LocalizedText;
};
export type ProductSpecification = {
  label: LocalizedText;
  value: LocalizedText;
};
export type DemoProduct = {
  id: string;
  slug: string;
  categoryId: string;
  brand: string;
  model: string;
  sku: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  price: number;
  oldPrice?: number;
  stockStatus: StockStatus;
  isPopular: boolean;
  isNew: boolean;
  specifications: ProductSpecification[];
  imageTone: "yellow" | "blue" | "mint" | "coral";
};

export type CatalogFilters = {
  query: string;
  categoryId: string;
  brand: string;
  availability: "all" | StockStatus;
  minPrice: string;
  maxPrice: string;
  sort: "popular" | "new" | "price_asc" | "price_desc" | "name";
};
