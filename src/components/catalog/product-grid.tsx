import { ProductCard } from "@/components/catalog/product-card";
import type {
  CatalogProduct,
  PublicSiteSettings,
} from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { LeadSource } from "@/features/leads/types";

export function ProductGrid({
  products,
  locale,
  dictionary,
  settings,
  leadSource,
}: {
  products: CatalogProduct[];
  locale: Locale;
  dictionary: Dictionary;
  settings: PublicSiteSettings;
  leadSource: LeadSource;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          dictionary={dictionary}
          settings={settings}
          leadSource={leadSource}
        />
      ))}
    </div>
  );
}
