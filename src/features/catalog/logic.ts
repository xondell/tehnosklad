import type { CatalogFilters, DemoProduct } from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";

export const defaultCatalogFilters: CatalogFilters = {
  query: "",
  categoryId: "all",
  brand: "all",
  availability: "all",
  minPrice: "",
  maxPrice: "",
  sort: "popular",
};
export function getDiscountPercent(
  price: number,
  oldPrice?: number,
): number | null {
  if (!oldPrice || oldPrice <= price || price < 0) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
export function formatPrice(value: number, locale: Locale): string {
  return `${new Intl.NumberFormat(locale === "ru" ? "ru-MD" : "ro-MD", {
    maximumFractionDigits: 0,
  }).format(value)} MDL`;
}
export function getLocalizedProduct(product: DemoProduct, locale: Locale) {
  return {
    name: product.name[locale],
    shortDescription: product.shortDescription[locale],
    description: product.description[locale],
  };
}
export function filterProducts(
  products: DemoProduct[],
  filters: CatalogFilters,
  locale: Locale,
): DemoProduct[] {
  const query = filters.query.trim().toLocaleLowerCase(locale);
  const min = Number(filters.minPrice);
  const max = Number(filters.maxPrice);
  const result = products.filter((product) => {
    const haystack =
      `${product.name[locale]} ${product.brand} ${product.model}`.toLocaleLowerCase(
        locale,
      );
    return (
      (!query || haystack.includes(query)) &&
      (filters.categoryId === "all" ||
        product.categoryId === filters.categoryId) &&
      (filters.brand === "all" || product.brand === filters.brand) &&
      (filters.availability === "all" ||
        product.stockStatus === filters.availability) &&
      (!filters.minPrice || (Number.isFinite(min) && product.price >= min)) &&
      (!filters.maxPrice || (Number.isFinite(max) && product.price <= max))
    );
  });
  return result.toSorted((a, b) =>
    filters.sort === "price_asc"
      ? a.price - b.price
      : filters.sort === "price_desc"
        ? b.price - a.price
        : filters.sort === "name"
          ? a.name[locale].localeCompare(b.name[locale], locale)
          : filters.sort === "new"
            ? Number(b.isNew) - Number(a.isNew) ||
              a.name[locale].localeCompare(b.name[locale], locale)
            : Number(b.isPopular) - Number(a.isPopular) ||
              a.name[locale].localeCompare(b.name[locale], locale),
  );
}
