import "server-only";
import { searchPublishedProducts } from "@/features/catalog/data";
import type { CatalogProduct } from "@/features/catalog/types";
import { localizedPath, type Locale } from "@/i18n/config";
import type { AssistantReference } from "@/features/assistant/types";

const MAX_PRODUCTS = 5;
function terms(question: string) {
  return (
    question
      .match(/[\p{L}\p{N}-]{2,}/gu)
      ?.slice(0, 8)
      .join(" ") ?? question
  );
}
export async function buildAssistantContext(locale: Locale, question: string) {
  const result = await searchPublishedProducts(locale, undefined, {
    query: terms(question).slice(0, 100),
    brand: null,
    availability: null,
    minPriceMinor: null,
    maxPriceMinor: null,
    attributes: {},
    sort: "popular",
    page: 1,
    pageSize: MAX_PRODUCTS,
  });
  const products = result.products.slice(0, MAX_PRODUCTS);
  const references = products.map((product) => referenceFor(product, locale));
  const context = products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category.name,
    brand: product.brand,
    model: product.model,
    priceMinor: product.priceMinor,
    currency: product.currency,
    stockStatus: product.stockStatus,
    specifications: product.specifications
      .slice(0, 8)
      .map((spec) => ({ label: spec.label, value: spec.displayValue })),
    url: referenceFor(product, locale).url,
  }));
  return { products, references, context: JSON.stringify(context) };
}
export function referenceFor(
  product: CatalogProduct,
  locale: Locale,
): AssistantReference {
  return {
    id: product.id,
    name: product.name,
    category: product.category.name,
    priceMinor: product.priceMinor,
    currency: product.currency,
    stockStatus: product.stockStatus,
    url: localizedPath(locale, `product/${product.slug}`),
  };
}
export function referencesForIds(
  products: CatalogProduct[],
  locale: Locale,
  ids: string[],
): AssistantReference[] {
  const selected = new Set(ids);
  return products
    .filter((product) => selected.has(product.id))
    .slice(0, MAX_PRODUCTS)
    .map((product) => referenceFor(product, locale));
}
