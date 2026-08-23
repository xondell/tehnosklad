import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { CatalogDataError } from "@/features/catalog/repository";
import type { CatalogSearchQuery } from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";
import type {
  DbCategoryRow,
  DbCatalogSearchRow,
  DbProductRow,
  DbSiteSettingRow,
  DbSpecificationRow,
} from "@/features/catalog/supabase/rows";

export type TransportProductQuery = {
  categoryId?: string;
  excludeId?: string;
  limit?: number;
  ids?: string[];
};

export interface CatalogTransport {
  listCategories(): Promise<DbCategoryRow[]>;
  findCategoryBySlug(
    locale: Locale,
    slug: string,
  ): Promise<DbCategoryRow | null>;
  findCategoryByHistoricalSlug(
    locale: Locale,
    slug: string,
  ): Promise<DbCategoryRow | null>;
  listProducts(query?: TransportProductQuery): Promise<DbProductRow[]>;
  getPopularProductIds(limit?: number): Promise<string[]>;
  recordProductView(productId: string): Promise<void>;
  cleanupOldProductViews(retentionDays?: number): Promise<number>;
  findProductBySlug(locale: Locale, slug: string): Promise<DbProductRow | null>;
  findProductByHistoricalSlug(
    locale: Locale,
    slug: string,
  ): Promise<DbProductRow | null>;
  searchProductIds(
    locale: Locale,
    categoryId: string | undefined,
    query: CatalogSearchQuery,
  ): Promise<{ ids: string[]; total: number }>;
  listSpecifications(productIds: string[]): Promise<DbSpecificationRow[]>;
  listSiteSettings(locale: Locale): Promise<DbSiteSettingRow[]>;
}

const categorySelect =
  "id,presentation_key,sort_order,image_storage_path,category_translations(locale,name,slug,short_description,description,seo_title,seo_description)";
const productSelect =
  "id,brand,model,sku,price_minor,old_price_minor,currency,availability,is_new,sort_order,product_translations(locale,name,slug,short_description,description,seo_title,seo_description),categories!inner(id,presentation_key,sort_order,image_storage_path,category_translations(locale,name,slug,short_description,description,seo_title,seo_description)),product_images(id,storage_path,sort_order,is_primary,product_image_translations(locale,alt_text))";

function queryFailure(resource: string): CatalogDataError {
  return new CatalogDataError(
    "query_failed",
    `Supabase query failed for ${resource}`,
  );
}

export class SupabaseCatalogTransport implements CatalogTransport {
  constructor(private readonly client: SupabaseClient) {}

  private hydrateCategory(row: DbCategoryRow): DbCategoryRow {
    let imagePublicUrl: string | null = null;
    if (row.image_storage_path) {
      if (
        row.image_storage_path.startsWith("/") ||
        row.image_storage_path.startsWith("http")
      ) {
        imagePublicUrl = row.image_storage_path;
      } else {
        imagePublicUrl = this.client.storage
          .from("category-images")
          .getPublicUrl(row.image_storage_path).data.publicUrl;
      }
    }
    return {
      ...row,
      image_public_url: imagePublicUrl,
    };
  }

  async listCategories(): Promise<DbCategoryRow[]> {
    const { data, error } = await this.client
      .from("categories")
      .select(categorySelect)
      .eq("is_published", true)
      .is("archived_at", null)
      .order("sort_order");
    if (error) throw queryFailure("categories");
    return (data as unknown as DbCategoryRow[]).map((cat) =>
      this.hydrateCategory(cat),
    );
  }

  async findCategoryBySlug(
    locale: Locale,
    slug: string,
  ): Promise<DbCategoryRow | null> {
    const lookup = await this.client
      .from("category_translations")
      .select("category_id")
      .eq("locale", locale)
      .eq("slug", slug)
      .maybeSingle();
    if (lookup.error) throw queryFailure("category slug");
    if (!lookup.data) return null;
    return this.findCategoryById(lookup.data.category_id);
  }

  async findCategoryByHistoricalSlug(locale: Locale, slug: string) {
    const lookup = await this.client
      .from("category_slug_routes")
      .select("category_id")
      .eq("locale", locale)
      .eq("slug", slug)
      .eq("is_current", false)
      .maybeSingle();
    if (lookup.error) throw queryFailure("category historical slug");
    return lookup.data ? this.findCategoryById(lookup.data.category_id) : null;
  }

  private async findCategoryById(id: string) {
    const { data, error } = await this.client
      .from("categories")
      .select(categorySelect)
      .eq("id", id)
      .eq("is_published", true)
      .is("archived_at", null)
      .maybeSingle();
    if (error) throw queryFailure("category");
    return data ? this.hydrateCategory(data as unknown as DbCategoryRow) : null;
  }

  async listProducts(
    queryOptions: TransportProductQuery = {},
  ): Promise<DbProductRow[]> {
    let query = this.client
      .from("products")
      .select(productSelect)
      .eq("is_published", true)
      .is("archived_at", null)
      .order("sort_order");
    if (queryOptions.categoryId) {
      query = query.eq("category_id", queryOptions.categoryId);
    }
    if (queryOptions.excludeId) {
      query = query.neq("id", queryOptions.excludeId);
    }
    if (queryOptions.ids) query = query.in("id", queryOptions.ids);
    if (queryOptions.limit) query = query.limit(queryOptions.limit);

    const { data, error } = await query;
    if (error) throw queryFailure("products");

    return (data as unknown as DbProductRow[]).map((product) => ({
      ...product,
      product_images: product.product_images.map((image) => ({
        ...image,
        public_url: this.client.storage
          .from("product-images")
          .getPublicUrl(image.storage_path).data.publicUrl,
      })),
    }));
  }

  async getPopularProductIds(limit = 7): Promise<string[]> {
    const { data, error } = await this.client.rpc("get_popular_products_30d", {
      p_limit: Math.min(limit, 7),
    });
    if (error) throw queryFailure("popular product ids");
    return (data as string[]) ?? [];
  }

  async recordProductView(productId: string): Promise<void> {
    const { error } = await this.client.rpc("record_product_view", {
      p_product_id: productId,
    });
    if (error) throw queryFailure("record product view");
  }

  async cleanupOldProductViews(retentionDays = 31): Promise<number> {
    const { data, error } = await this.client.rpc("cleanup_old_product_views", {
      p_retention_days: retentionDays,
    });
    if (error) throw queryFailure("cleanup old product views");
    return Number(data ?? 0);
  }

  async findProductBySlug(
    locale: Locale,
    slug: string,
  ): Promise<DbProductRow | null> {
    const lookup = await this.client
      .from("product_translations")
      .select("product_id")
      .eq("locale", locale)
      .eq("slug", slug)
      .maybeSingle();
    if (lookup.error) throw queryFailure("product slug");
    if (!lookup.data) return null;
    return this.findProductById(lookup.data.product_id);
  }

  async findProductByHistoricalSlug(locale: Locale, slug: string) {
    const lookup = await this.client
      .from("product_slug_routes")
      .select("product_id")
      .eq("locale", locale)
      .eq("slug", slug)
      .eq("is_current", false)
      .maybeSingle();
    if (lookup.error) throw queryFailure("product historical slug");
    return lookup.data ? this.findProductById(lookup.data.product_id) : null;
  }

  private async findProductById(id: string) {
    const { data, error } = await this.client
      .from("products")
      .select(productSelect)
      .eq("id", id)
      .eq("is_published", true)
      .is("archived_at", null)
      .maybeSingle();
    if (error) throw queryFailure("product");
    if (!data) return null;
    const product = data as unknown as DbProductRow;
    return {
      ...product,
      product_images: product.product_images.map((image) => ({
        ...image,
        public_url: this.client.storage
          .from("product-images")
          .getPublicUrl(image.storage_path).data.publicUrl,
      })),
    };
  }

  async searchProductIds(
    locale: Locale,
    categoryId: string | undefined,
    query: CatalogSearchQuery,
  ) {
    const { data, error } = await this.client.rpc(
      "search_public_catalog_product_ids",
      {
        p_locale: locale,
        p_category_id: categoryId ?? null,
        p_query: query.query || null,
        p_brand: query.brand,
        p_availability: query.availability,
        p_min_price_minor: query.minPriceMinor,
        p_max_price_minor: query.maxPriceMinor,
        p_attributes: query.attributes,
        p_sort: query.sort,
        p_limit: query.pageSize,
        p_offset: (query.page - 1) * query.pageSize,
      },
    );
    if (error) throw queryFailure("catalog search");
    const rows = (data ?? []) as DbCatalogSearchRow[];
    const total = rows.length ? Number(rows[0]!.total_count) : 0;
    if (!Number.isSafeInteger(total) || total < 0) {
      throw new CatalogDataError(
        "invalid_data",
        "Invalid catalog search count",
      );
    }
    return {
      ids: rows.flatMap((row) => (row.product_id ? [row.product_id] : [])),
      total,
    };
  }

  async listSpecifications(
    productIds: string[],
  ): Promise<DbSpecificationRow[]> {
    if (productIds.length === 0) return [];
    const { data, error } = await this.client
      .from("product_attribute_values")
      .select(
        "id,product_id,ordinal,text_value_key,number_value,boolean_value,color_value,product_attribute_value_translations(locale,text_value),products!inner(category_id),attributes!inner(code,data_type,is_filterable,sort_order,category_attributes(category_id,is_filterable,sort_order),attribute_translations(locale,name,unit_label),attribute_groups(code,sort_order,attribute_group_translations(locale,name))),attribute_options(code,attribute_option_translations(locale,label))",
      )
      .in("product_id", productIds);
    if (error) throw queryFailure("product specifications");
    return data as unknown as DbSpecificationRow[];
  }

  async listSiteSettings(locale: Locale): Promise<DbSiteSettingRow[]> {
    const { data, error } = await this.client
      .from("site_settings")
      .select("key,value")
      .eq("locale", locale);
    if (error) throw queryFailure("site settings");
    return data as unknown as DbSiteSettingRow[];
  }
}
