import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { CatalogDataError } from "@/features/catalog/repository";
import type { Locale } from "@/i18n/config";
import type {
  DbCategoryRow,
  DbProductRow,
  DbSiteSettingRow,
  DbSpecificationRow,
} from "@/features/catalog/supabase/rows";

export type TransportProductQuery = {
  categoryId?: string;
  popularOnly?: boolean;
  excludeId?: string;
  limit?: number;
};

export interface CatalogTransport {
  listCategories(): Promise<DbCategoryRow[]>;
  findCategoryBySlug(
    locale: Locale,
    slug: string,
  ): Promise<DbCategoryRow | null>;
  listProducts(query?: TransportProductQuery): Promise<DbProductRow[]>;
  findProductBySlug(locale: Locale, slug: string): Promise<DbProductRow | null>;
  listSpecifications(productIds: string[]): Promise<DbSpecificationRow[]>;
  listSiteSettings(locale: Locale): Promise<DbSiteSettingRow[]>;
}

function queryFailure(resource: string): CatalogDataError {
  return new CatalogDataError(
    "query_failed",
    `Supabase query failed for ${resource}`,
  );
}

export class SupabaseCatalogTransport implements CatalogTransport {
  constructor(private readonly client: SupabaseClient) {}

  async listCategories(): Promise<DbCategoryRow[]> {
    const { data, error } = await this.client
      .from("categories")
      .select(
        "id,presentation_key,sort_order,category_translations(locale,name,slug,short_description,description)",
      )
      .eq("is_published", true)
      .is("archived_at", null)
      .order("sort_order");
    if (error) throw queryFailure("categories");
    return data as unknown as DbCategoryRow[];
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
    const { data, error } = await this.client
      .from("categories")
      .select(
        "id,presentation_key,sort_order,category_translations(locale,name,slug,short_description,description)",
      )
      .eq("id", lookup.data.category_id)
      .eq("is_published", true)
      .is("archived_at", null)
      .maybeSingle();
    if (error) throw queryFailure("category");
    return data as unknown as DbCategoryRow | null;
  }

  async listProducts(
    queryOptions: TransportProductQuery = {},
  ): Promise<DbProductRow[]> {
    let query = this.client
      .from("products")
      .select(
        "id,brand,model,sku,price_minor,old_price_minor,currency,availability,is_popular,is_new,sort_order,product_translations(locale,name,slug,short_description,description),categories!inner(id,presentation_key,sort_order,category_translations(locale,name,slug,short_description,description)),product_images(id,storage_path,sort_order,is_primary,product_image_translations(locale,alt_text))",
      )
      .eq("is_published", true)
      .is("archived_at", null)
      .order("sort_order");
    if (queryOptions.categoryId) {
      query = query.eq("category_id", queryOptions.categoryId);
    }
    if (queryOptions.popularOnly) {
      query = query.eq("is_popular", true);
    }
    if (queryOptions.excludeId) {
      query = query.neq("id", queryOptions.excludeId);
    }
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
    const { data, error } = await this.client
      .from("products")
      .select(
        "id,brand,model,sku,price_minor,old_price_minor,currency,availability,is_popular,is_new,sort_order,product_translations(locale,name,slug,short_description,description),categories!inner(id,presentation_key,sort_order,category_translations(locale,name,slug,short_description,description)),product_images(id,storage_path,sort_order,is_primary,product_image_translations(locale,alt_text))",
      )
      .eq("id", lookup.data.product_id)
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
