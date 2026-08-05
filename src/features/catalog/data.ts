import "server-only";

import { unstable_cache } from "next/cache";

import { DemoCatalogRepository } from "@/features/catalog/demo-repository";
import {
  CatalogDataError,
  type CatalogRepository,
} from "@/features/catalog/repository";
import { SupabaseCatalogRepository } from "@/features/catalog/supabase/repository";
import { SupabaseCatalogTransport } from "@/features/catalog/supabase/transport";
import type { Locale } from "@/i18n/config";
import { getCatalogDataSource } from "@/lib/env/catalog";
import { createPublicCatalogSupabaseClient } from "@/lib/supabase/public-server";

function createCatalogRepository(): CatalogRepository {
  if (getCatalogDataSource() === "demo") return new DemoCatalogRepository();
  return new SupabaseCatalogRepository(
    new SupabaseCatalogTransport(createPublicCatalogSupabaseClient()),
  );
}

async function runCatalogQuery<T>(resource: string, query: () => Promise<T>) {
  try {
    return await query();
  } catch (error) {
    console.error("Catalog server query failed", {
      resource,
      code: error instanceof CatalogDataError ? error.code : "unexpected",
    });
    throw error;
  }
}

export function isDemoCatalog(): boolean {
  return getCatalogDataSource() === "demo";
}

export const getPublishedCategories = unstable_cache(
  async (locale: Locale) =>
    runCatalogQuery("categories", () =>
      createCatalogRepository().getPublishedCategories(locale),
    ),
  ["catalog-categories-v1"],
  { revalidate: 300, tags: ["catalog", "categories"] },
);

export const getPublishedProducts = unstable_cache(
  async (locale: Locale) =>
    runCatalogQuery("products", () =>
      createCatalogRepository().getPublishedProducts(locale),
    ),
  ["catalog-products-v1"],
  { revalidate: 300, tags: ["catalog", "products"] },
);

export const getPopularProducts = unstable_cache(
  async (locale: Locale, limit: number) =>
    runCatalogQuery("popular-products", () =>
      createCatalogRepository().getPublishedProducts(locale, {
        popularOnly: true,
        limit,
      }),
    ),
  ["catalog-popular-v1"],
  { revalidate: 300, tags: ["catalog", "products"] },
);

export const getCategoryBySlug = unstable_cache(
  async (locale: Locale, slug: string) =>
    runCatalogQuery("category-by-slug", () =>
      createCatalogRepository().getCategoryBySlug(locale, slug),
    ),
  ["catalog-category-slug-v1"],
  { revalidate: 300, tags: ["catalog", "categories"] },
);

export const getCategoryProducts = unstable_cache(
  async (locale: Locale, categoryId: string) =>
    runCatalogQuery("category-products", () =>
      createCatalogRepository().getPublishedProducts(locale, { categoryId }),
    ),
  ["catalog-category-products-v1"],
  { revalidate: 300, tags: ["catalog", "products"] },
);

export const getProductBySlug = unstable_cache(
  async (locale: Locale, slug: string) =>
    runCatalogQuery("product-by-slug", () =>
      createCatalogRepository().getProductBySlug(locale, slug),
    ),
  ["catalog-product-slug-v1"],
  { revalidate: 300, tags: ["catalog", "products"] },
);

export const getSimilarProducts = unstable_cache(
  async (
    locale: Locale,
    productId: string,
    categoryId: string,
    limit: number,
  ) =>
    runCatalogQuery("similar-products", () =>
      createCatalogRepository().getSimilarProducts(
        locale,
        productId,
        categoryId,
        limit,
      ),
    ),
  ["catalog-similar-v1"],
  { revalidate: 300, tags: ["catalog", "products"] },
);

export const getPublicSiteSettings = unstable_cache(
  async (locale: Locale) =>
    runCatalogQuery("public-settings", () =>
      createCatalogRepository().getPublicSiteSettings(locale),
    ),
  ["catalog-public-settings-v1"],
  { revalidate: 300, tags: ["site-settings"] },
);
