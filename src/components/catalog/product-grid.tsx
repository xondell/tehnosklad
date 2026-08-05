import { ProductCard } from "@/components/catalog/product-card";
import type { DemoProduct } from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
export function ProductGrid({
  products,
  locale,
  dictionary,
}: {
  products: DemoProduct[];
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          dictionary={dictionary}
        />
      ))}
    </div>
  );
}
