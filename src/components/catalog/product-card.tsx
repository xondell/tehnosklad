import Link from "next/link";

import { ProductIllustration } from "@/components/catalog/product-illustration";
import { ContactButton } from "@/components/public/contact-button";
import { formatPrice, getDiscountPercent } from "@/features/catalog/logic";
import type {
  CatalogProduct,
  PublicSiteSettings,
} from "@/features/catalog/types";
import { localizedPath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { LeadSource } from "@/features/leads/types";

export function ProductCard({
  product,
  locale,
  dictionary,
  settings,
  leadSource,
}: {
  product: CatalogProduct;
  locale: Locale;
  dictionary: Dictionary;
  settings: PublicSiteSettings;
  leadSource: LeadSource;
}) {
  const discount = getDiscountPercent(
    product.priceMinor,
    product.oldPriceMinor,
  );
  const primaryImage = product.images[0];
  const availability =
    product.stockStatus === "in_stock"
      ? dictionary.common.inStock
      : product.stockStatus === "on_order"
        ? dictionary.common.onOrder
        : dictionary.common.outOfStock;
  const productHref = localizedPath(locale, `product/${product.slug}`);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={productHref}
        className="relative block overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-950"
        aria-label={product.name}
      >
        <ProductIllustration
          category={product.category.presentationKey}
          tone={product.imageTone}
          label={primaryImage?.alt ?? product.name}
          imageUrl={primaryImage?.url}
          className="h-48 transition-transform duration-200 group-hover:scale-105"
        />
        {discount ? (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
            −{discount}%
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
          {product.category.name} · {product.brand}
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-extrabold leading-6">
          <Link
            className="hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950"
            href={productHref}
          >
            {product.name}
          </Link>
        </h3>
        <Link
          href={productHref}
          className="mt-3 block min-h-12 text-sm text-stone-600 focus:outline-none"
          tabIndex={-1}
          aria-hidden="true"
        >
          <ul className="space-y-1">
            {product.specifications.slice(0, 2).map((specification) => (
              <li key={specification.code}>
                {specification.label}: {specification.displayValue}
              </li>
            ))}
          </ul>
        </Link>
        <div className="mt-auto pt-4">
          <Link
            href={productHref}
            className="block focus:outline-none"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="flex items-end gap-2">
              <strong className="text-xl font-black tracking-tight">
                {formatPrice(product.priceMinor, locale)}
              </strong>
              {product.oldPriceMinor && discount ? (
                <s className="mb-0.5 text-sm text-stone-500">
                  {formatPrice(product.oldPriceMinor, locale)}
                </s>
              ) : null}
            </div>
            <p
              className={`mt-2 text-sm font-bold ${product.stockStatus === "in_stock" ? "text-emerald-700" : "text-stone-500"}`}
            >
              {availability}
            </p>
          </Link>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              className="button-secondary text-center"
              href={productHref}
            >
              {dictionary.actions.view}
            </Link>
            <ContactButton
              dictionary={dictionary}
              locale={locale}
              label={dictionary.actions.contact}
              source={leadSource}
              product={{ id: product.id, name: product.name }}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
