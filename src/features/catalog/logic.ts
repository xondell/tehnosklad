import type { CatalogFilters, CatalogProduct } from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";

export const defaultCatalogFilters: CatalogFilters = {
  query: "",
  categoryId: "all",
  brand: "all",
  availability: "all",
  minPrice: "",
  maxPrice: "",
  attributes: {},
  sort: "popular",
};

export function getDiscountPercent(
  priceMinor: number,
  oldPriceMinor?: number | null,
): number | null {
  if (!oldPriceMinor || oldPriceMinor <= priceMinor || priceMinor < 0)
    return null;
  return Math.round(((oldPriceMinor - priceMinor) / oldPriceMinor) * 100);
}

export function formatPrice(valueMinor: number, locale: Locale): string {
  if (!Number.isSafeInteger(valueMinor) || valueMinor < 0) {
    throw new RangeError("Price must be a non-negative safe integer");
  }
  const formatted = new Intl.NumberFormat(locale === "ru" ? "ru-MD" : "ro-MD", {
    minimumFractionDigits: valueMinor % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(valueMinor / 100);
  return `${formatted.replace(/\./g, "\u00A0")} MDL`;
}

export function filterProducts(
  products: CatalogProduct[],
  filters: CatalogFilters,
  locale: Locale,
): CatalogProduct[] {
  const query = filters.query.trim().toLocaleLowerCase(locale);
  const minMinor = Number(filters.minPrice) * 100;
  const maxMinor = Number(filters.maxPrice) * 100;
  const result = products.filter((product) => {
    const haystack =
      `${product.name} ${product.brand} ${product.model}`.toLocaleLowerCase(
        locale,
      );
    return (
      (!query || haystack.includes(query)) &&
      (filters.categoryId === "all" ||
        product.category.id === filters.categoryId) &&
      (filters.brand === "all" || product.brand === filters.brand) &&
      (filters.availability === "all" ||
        product.stockStatus === filters.availability) &&
      (!filters.minPrice ||
        (Number.isFinite(minMinor) && product.priceMinor >= minMinor)) &&
      (!filters.maxPrice ||
        (Number.isFinite(maxMinor) && product.priceMinor <= maxMinor)) &&
      Object.entries(filters.attributes).every(
        ([code, value]) =>
          !value ||
          product.specifications.some(
            (specification) =>
              specification.code === code &&
              specification.isFilterable &&
              specification.filterValue === value,
          ),
      )
    );
  });
  return result.toSorted((a, b) =>
    filters.sort === "price_asc"
      ? a.priceMinor - b.priceMinor
      : filters.sort === "price_desc"
        ? b.priceMinor - a.priceMinor
        : filters.sort === "name"
          ? a.name.localeCompare(b.name, locale)
          : filters.sort === "new"
            ? Number(b.isNew) - Number(a.isNew) ||
              a.name.localeCompare(b.name, locale)
            : a.name.localeCompare(b.name, locale),
  );
}
