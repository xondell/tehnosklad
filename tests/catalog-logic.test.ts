import { describe, expect, it } from "vitest";

import { validateLead } from "@/components/public/contact-dialog";
import { demoProducts } from "@/features/catalog/demo-data";
import {
  defaultCatalogFilters,
  filterProducts,
  formatPrice,
  getDiscountPercent,
  getLocalizedProduct,
} from "@/features/catalog/logic";
import { getDictionary } from "@/i18n/get-dictionary";

describe("catalog business logic", () => {
  it("formats prices as MDL", () => {
    expect(formatPrice(7890, "ru")).toContain("7");
    expect(formatPrice(7890, "ro")).toContain("MDL");
  });

  it("only returns a valid discount", () => {
    expect(getDiscountPercent(800, 1000)).toBe(20);
    expect(getDiscountPercent(1000, 1000)).toBeNull();
    expect(getDiscountPercent(1000, 900)).toBeNull();
  });

  it("filters and sorts local demo products", () => {
    const products = filterProducts(
      demoProducts,
      { ...defaultCatalogFilters, categoryId: "vacuums", sort: "price_asc" },
      "ru",
    );
    expect(products).toHaveLength(4);
    expect(products[0]?.price).toBeLessThanOrEqual(products[1]?.price ?? 0);
  });

  it("selects localized content", () => {
    expect(getLocalizedProduct(demoProducts[0]!, "ro").name).toContain(
      "Frigider",
    );
  });

  it("handles an absent product lookup", () => {
    expect(
      demoProducts.find((product) => product.slug === "missing"),
    ).toBeUndefined();
  });
});

describe("lead form validation", () => {
  const dictionary = getDictionary("ru");
  it("requires name, phone and consent", () => {
    expect(
      validateLead({ name: "", phone: "12", consent: false }, dictionary),
    ).toEqual({
      name: dictionary.contactModal.required,
      phone: dictionary.contactModal.phoneError,
      consent: dictionary.contactModal.consentError,
    });
  });
  it("allows a valid form without optional fields", () => {
    expect(
      validateLead(
        { name: "Анна", phone: "+373 69 166 172", consent: true },
        dictionary,
      ),
    ).toEqual({});
  });
});
