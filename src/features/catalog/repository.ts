import type {
  CatalogCategory,
  CatalogFacets,
  CatalogProduct,
  PublicSiteSettings,
} from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";

export type ProductQuery = {
  categoryId?: string;
  popularOnly?: boolean;
  limit?: number;
};

export interface CatalogRepository {
  getPublishedCategories(locale: Locale): Promise<CatalogCategory[]>;
  getPublishedProducts(
    locale: Locale,
    query?: ProductQuery,
  ): Promise<CatalogProduct[]>;
  getCategoryBySlug(
    locale: Locale,
    slug: string,
  ): Promise<CatalogCategory | null>;
  getProductBySlug(
    locale: Locale,
    slug: string,
  ): Promise<CatalogProduct | null>;
  getSimilarProducts(
    locale: Locale,
    productId: string,
    categoryId: string,
    limit: number,
  ): Promise<CatalogProduct[]>;
  getAvailableFilters(
    locale: Locale,
    categoryId?: string,
  ): Promise<CatalogFacets>;
  getPublicSiteSettings(locale: Locale): Promise<PublicSiteSettings>;
}

export class CatalogDataError extends Error {
  constructor(
    public readonly code:
      "configuration" | "query_failed" | "invalid_data" | "missing_translation",
    message: string,
  ) {
    super(message);
    this.name = "CatalogDataError";
  }
}
