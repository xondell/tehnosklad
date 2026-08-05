import { describe, expect, it } from "vitest";

import { DemoCatalogRepository } from "@/features/catalog/demo-repository";
import {
  defaultCatalogFilters,
  filterProducts,
  formatPrice,
  getDiscountPercent,
} from "@/features/catalog/logic";

describe("catalog business logic", () => {
  it("formats integer minor units as MDL", () => {
    expect(formatPrice(789000, "ru")).toMatch(/7.?890 MDL/);
    expect(formatPrice(12345, "ro")).toContain("123,45");
    expect(() => formatPrice(-1, "ru")).toThrow(RangeError);
  });

  it("only returns a valid discount", () => {
    expect(getDiscountPercent(80000, 100000)).toBe(20);
    expect(getDiscountPercent(100000, 100000)).toBeNull();
    expect(getDiscountPercent(100000, 90000)).toBeNull();
  });

  it("filters major-unit input against minor-unit prices", async () => {
    const products = await new DemoCatalogRepository().getPublishedProducts(
      "ru",
    );
    const filtered = filterProducts(
      products,
      {
        ...defaultCatalogFilters,
        categoryId: "vacuums",
        minPrice: "2000",
        sort: "price_asc",
      },
      "ru",
    );
    expect(filtered.map((product) => product.priceMinor)).toEqual([
      219000, 249000, 289000,
    ]);
  });

  it("keeps Romanian demo values localized", async () => {
    const products = await new DemoCatalogRepository().getPublishedProducts(
      "ro",
    );
    expect(products[0]!.name).toContain("Frigider");
    expect(products[0]!.specifications[2]!.displayValue).toBe(
      "două compartimente",
    );
  });

  it.each([
    ["number_value", "350", "number"],
    ["boolean_value", "true", "boolean"],
    ["select_value", "a_plus", "single_select"],
    ["multi_value", "eco", "multi_select"],
    ["color_value", "#ffffff", "color"],
  ] as const)(
    "filters %s by its canonical value",
    async (code, filterValue, dataType) => {
      const products = await new DemoCatalogRepository().getPublishedProducts(
        "ro",
      );
      const target = products[0]!;
      target.specifications = [
        {
          code,
          groupCode: "general",
          groupName: "General",
          label: "Localized label",
          displayValue: "Localized value",
          filterValue,
          dataType,
          isFilterable: true,
          sortOrder: 1,
        },
      ];
      expect(
        filterProducts(
          products,
          {
            ...defaultCatalogFilters,
            attributes: { [code]: filterValue },
          },
          "ro",
        ),
      ).toHaveLength(1);
    },
  );
});
