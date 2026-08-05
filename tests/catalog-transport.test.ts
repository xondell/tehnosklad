import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { CatalogDataError } from "@/features/catalog/repository";
import { SupabaseCatalogTransport } from "@/features/catalog/supabase/transport";

type QueryResult = { data: unknown; error: { message: string } | null };

function queryBuilder(result: QueryResult) {
  const calls: Array<[string, unknown]> = [];
  const builder = {
    select(value: string) {
      calls.push(["select", value]);
      return builder;
    },
    order(value: string) {
      calls.push(["order", value]);
      return builder;
    },
    eq(column: string, value: unknown) {
      calls.push([`eq:${column}`, value]);
      return builder;
    },
    neq(column: string, value: unknown) {
      calls.push([`neq:${column}`, value]);
      return builder;
    },
    limit(value: number) {
      calls.push(["limit", value]);
      return builder;
    },
    in(column: string, value: unknown) {
      calls.push([`in:${column}`, value]);
      return builder;
    },
    maybeSingle() {
      calls.push(["maybeSingle", true]);
      return Promise.resolve(result);
    },
    then(resolve: (value: QueryResult) => unknown) {
      return Promise.resolve(resolve(result));
    },
  };
  return { builder, calls };
}

function clientFor(...builders: ReturnType<typeof queryBuilder>["builder"][]) {
  let index = 0;
  return {
    from: vi.fn(() => builders[Math.min(index++, builders.length - 1)]),
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `https://cdn.test/${path}` },
        }),
      })),
    },
  } as unknown as SupabaseClient;
}

describe("Supabase catalog transport", () => {
  it("applies category, exclusion and limit before mapping public URLs", async () => {
    const product = {
      id: "product",
      product_images: [{ id: "image", storage_path: "product/image.webp" }],
    };
    const query = queryBuilder({ data: [product], error: null });
    const transport = new SupabaseCatalogTransport(clientFor(query.builder));

    const rows = await transport.listProducts({
      categoryId: "category",
      excludeId: "current",
      limit: 3,
    });

    expect(query.calls).toEqual(
      expect.arrayContaining([
        ["eq:category_id", "category"],
        ["neq:id", "current"],
        ["limit", 3],
      ]),
    );
    expect(rows[0]!.product_images[0]!.public_url).toBe(
      "https://cdn.test/product/image.webp",
    );
  });

  it("sanitizes Supabase query errors", async () => {
    const query = queryBuilder({
      data: null,
      error: { message: "sensitive database detail" },
    });
    const transport = new SupabaseCatalogTransport(clientFor(query.builder));
    await expect(transport.listProducts()).rejects.toEqual(
      new CatalogDataError(
        "query_failed",
        "Supabase query failed for products",
      ),
    );
  });

  it("resolves a product by localized slug before its targeted entity query", async () => {
    const lookup = queryBuilder({
      data: { product_id: "product" },
      error: null,
    });
    const entity = queryBuilder({
      data: {
        id: "product",
        product_images: [{ id: "image", storage_path: "product/image.webp" }],
      },
      error: null,
    });
    const transport = new SupabaseCatalogTransport(
      clientFor(lookup.builder, entity.builder),
    );

    const row = await transport.findProductBySlug("ro", "produs-localizat");

    expect(lookup.calls).toEqual(
      expect.arrayContaining([
        ["eq:locale", "ro"],
        ["eq:slug", "produs-localizat"],
        ["maybeSingle", true],
      ]),
    );
    expect(entity.calls).toEqual(
      expect.arrayContaining([
        ["eq:id", "product"],
        ["maybeSingle", true],
      ]),
    );
    expect(row?.product_images[0]!.public_url).toBe(
      "https://cdn.test/product/image.webp",
    );
  });

  it("does not query a category entity when the localized slug is absent", async () => {
    const lookup = queryBuilder({ data: null, error: null });
    const client = clientFor(lookup.builder);
    const transport = new SupabaseCatalogTransport(client);
    await expect(
      transport.findCategoryBySlug("ru", "missing"),
    ).resolves.toBeNull();
    expect(client.from).toHaveBeenCalledTimes(1);
    expect(lookup.calls).toEqual(
      expect.arrayContaining([
        ["eq:locale", "ru"],
        ["eq:slug", "missing"],
      ]),
    );
  });

  it("requests product category bindings in the specification bulk query", async () => {
    const query = queryBuilder({ data: [], error: null });
    const transport = new SupabaseCatalogTransport(clientFor(query.builder));
    await transport.listSpecifications(["product"]);
    const select = query.calls.find(([method]) => method === "select")?.[1];
    expect(select).toEqual(
      expect.stringContaining("products!inner(category_id)"),
    );
    expect(select).toEqual(expect.stringContaining("category_attributes("));
    expect(query.calls).toContainEqual(["in:product_id", ["product"]]);
  });
});
