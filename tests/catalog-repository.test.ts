import { describe, expect, it, vi } from "vitest";

import { DemoCatalogRepository } from "@/features/catalog/demo-repository";
import { CatalogDataError } from "@/features/catalog/repository";
import { SupabaseCatalogRepository } from "@/features/catalog/supabase/repository";
import type { CatalogTransport } from "@/features/catalog/supabase/transport";
import type {
  DbCategoryRow,
  DbProductRow,
} from "@/features/catalog/supabase/rows";

const categoryRow: DbCategoryRow = {
  id: "category",
  presentation_key: "generic",
  sort_order: 1,
  category_translations: [
    {
      locale: "ru",
      name: "Категория",
      slug: "category",
      short_description: "Коротко",
      description: "Описание",
      seo_title: null,
      seo_description: null,
    },
    {
      locale: "ro",
      name: "Categorie",
      slug: "categorie",
      short_description: "Scurt",
      description: "Descriere",
      seo_title: null,
      seo_description: null,
    },
  ],
};

const productRow: DbProductRow = {
  id: "product",
  brand: "Brand",
  model: "Model",
  sku: "SKU",
  price_minor: 10000,
  old_price_minor: null,
  currency: "MDL",
  availability: "in_stock",
  is_popular: false,
  is_new: true,
  sort_order: 1,
  categories: categoryRow,
  product_translations: [
    {
      locale: "ru",
      name: "Товар",
      slug: "product",
      short_description: "Коротко",
      description: "Описание",
      seo_title: null,
      seo_description: null,
    },
    {
      locale: "ro",
      name: "Produs",
      slug: "produs",
      short_description: "Scurt",
      description: "Descriere",
      seo_title: null,
      seo_description: null,
    },
  ],
  product_images: [],
};

function mockTransport(): CatalogTransport {
  return {
    listCategories: vi.fn().mockResolvedValue([categoryRow]),
    findCategoryBySlug: vi.fn().mockResolvedValue(categoryRow),
    findCategoryByHistoricalSlug: vi.fn().mockResolvedValue(null),
    listProducts: vi.fn().mockResolvedValue([productRow]),
    findProductBySlug: vi.fn().mockResolvedValue(productRow),
    findProductByHistoricalSlug: vi.fn().mockResolvedValue(null),
    searchProductIds: vi.fn().mockResolvedValue({ ids: ["product"], total: 1 }),
    listSpecifications: vi.fn().mockResolvedValue([]),
    listSiteSettings: vi.fn().mockResolvedValue([]),
  };
}

describe("repository contracts", () => {
  const searchQuery = {
    query: "",
    brand: null,
    availability: null,
    minPriceMinor: null,
    maxPriceMinor: null,
    attributes: {},
    sort: "popular" as const,
    page: 1,
    pageSize: 9,
  };

  it("demo repository has deterministic categories, products and lookups", async () => {
    const repository = new DemoCatalogRepository();
    await expect(repository.getPublishedCategories("ru")).resolves.toHaveLength(
      15,
    );
    await expect(repository.getPublishedProducts("ro")).resolves.toHaveLength(
      0,
    );
    await expect(
      repository.getProductBySlug("ru", "missing"),
    ).resolves.toBeNull();
    const similar = await repository.getSimilarProducts(
      "ru",
      "nord-cool-300",
      "refrigerators",
      2,
    );
    expect(similar).toHaveLength(0);
  });

  it("Supabase repository uses one product and one bulk specification query", async () => {
    const transport = mockTransport();
    const repository = new SupabaseCatalogRepository(transport);
    await expect(repository.getPublishedProducts("ru")).resolves.toHaveLength(
      1,
    );
    expect(transport.listProducts).toHaveBeenCalledTimes(1);
    expect(transport.listSpecifications).toHaveBeenCalledWith(["product"]);
  });

  it("returns null for an absent product", async () => {
    const transport = mockTransport();
    transport.findProductBySlug = vi.fn().mockResolvedValue(null);
    const repository = new SupabaseCatalogRepository(transport);
    await expect(
      repository.getProductBySlug("ru", "missing"),
    ).resolves.toBeNull();
    expect(transport.listProducts).not.toHaveBeenCalled();
    expect(transport.listSpecifications).not.toHaveBeenCalled();
  });

  it("uses a targeted product lookup and ignores unrelated catalog rows", async () => {
    const transport = mockTransport();
    const repository = new SupabaseCatalogRepository(transport);
    await expect(
      repository.getProductBySlug("ro", "produs"),
    ).resolves.toMatchObject({ id: "product", slug: "produs" });
    expect(transport.findProductBySlug).toHaveBeenCalledWith("ro", "produs");
    expect(transport.listProducts).not.toHaveBeenCalled();
    expect(transport.listSpecifications).toHaveBeenCalledWith(["product"]);
  });

  it("limits and excludes similar products before loading specifications", async () => {
    const transport = mockTransport();
    const repository = new SupabaseCatalogRepository(transport);
    await repository.getSimilarProducts("ru", "current", "category", 3);
    expect(transport.listProducts).toHaveBeenCalledWith({
      categoryId: "category",
      excludeId: "current",
      limit: 3,
    });
  });

  it("does not replace a Supabase transport error with demo data", async () => {
    const transport = mockTransport();
    transport.listProducts = vi
      .fn()
      .mockRejectedValue(new CatalogDataError("query_failed", "sanitized"));
    const repository = new SupabaseCatalogRepository(transport);
    await expect(repository.getPublishedProducts("ru")).rejects.toMatchObject({
      code: "query_failed",
    });
  });

  it("loads one search page in RPC order and reports page metadata", async () => {
    const transport = mockTransport();
    const repository = new SupabaseCatalogRepository(transport);
    await expect(
      repository.searchPublishedProducts("ru", "category", searchQuery),
    ).resolves.toMatchObject({
      products: [{ id: "product" }],
      total: 1,
      page: 1,
      pageSize: 9,
      pageCount: 1,
    });
    expect(transport.searchProductIds).toHaveBeenCalledWith(
      "ru",
      "category",
      searchQuery,
    );
    expect(transport.listProducts).toHaveBeenCalledWith({ ids: ["product"] });
  });

  it("fails closed if the search RPC references an unavailable product", async () => {
    const transport = mockTransport();
    transport.listProducts = vi.fn().mockResolvedValue([]);
    const repository = new SupabaseCatalogRepository(transport);
    await expect(
      repository.searchPublishedProducts("ru", undefined, searchQuery),
    ).rejects.toMatchObject({ code: "invalid_data" });
  });
});
