import { buildCatalogFacets } from "@/features/catalog/facets";
import type {
  CatalogRepository,
  ProductQuery,
} from "@/features/catalog/repository";
import {
  mapCategoryRow,
  mapProductRow,
  mapSiteSettings,
} from "@/features/catalog/supabase/mapper";
import type { CatalogTransport } from "@/features/catalog/supabase/transport";
import type { Locale } from "@/i18n/config";

export class SupabaseCatalogRepository implements CatalogRepository {
  constructor(private readonly transport: CatalogTransport) {}

  async getPublishedCategories(locale: Locale) {
    const rows = await this.transport.listCategories();
    return rows.map((row) => mapCategoryRow(row, locale));
  }

  async getPublishedProducts(locale: Locale, query: ProductQuery = {}) {
    const rows = await this.transport.listProducts(query);
    const specifications = await this.transport.listSpecifications(
      rows.map((row) => row.id),
    );
    return rows.map((row) => mapProductRow(row, specifications, locale));
  }

  async getCategoryBySlug(locale: Locale, slug: string) {
    const row = await this.transport.findCategoryBySlug(locale, slug);
    return row ? mapCategoryRow(row, locale) : null;
  }

  async getProductBySlug(locale: Locale, slug: string) {
    const row = await this.transport.findProductBySlug(locale, slug);
    if (!row) return null;
    const specifications = await this.transport.listSpecifications([row.id]);
    return mapProductRow(row, specifications, locale);
  }

  async getSimilarProducts(
    locale: Locale,
    productId: string,
    categoryId: string,
    limit: number,
  ) {
    const rows = await this.transport.listProducts({
      categoryId,
      excludeId: productId,
      limit,
    });
    const specifications = await this.transport.listSpecifications(
      rows.map((row) => row.id),
    );
    return rows.map((row) => mapProductRow(row, specifications, locale));
  }

  async getAvailableFilters(locale: Locale, categoryId?: string) {
    return buildCatalogFacets(
      await this.getPublishedProducts(locale, { categoryId }),
    );
  }

  async getPublicSiteSettings(locale: Locale) {
    return mapSiteSettings(await this.transport.listSiteSettings(locale));
  }
}
