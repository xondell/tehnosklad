import Link from "next/link";
import { ContactButton } from "@/components/public/contact-button";
import { ProductIllustration } from "@/components/catalog/product-illustration";
import { demoCategories } from "@/features/catalog/demo-data";
import {
  formatPrice,
  getDiscountPercent,
  getLocalizedProduct,
} from "@/features/catalog/logic";
import type { DemoProduct } from "@/features/catalog/types";
import { localizedPath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function ProductCard({
  product,
  locale,
  dictionary,
}: {
  product: DemoProduct;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const category = demoCategories.find(
    (item) => item.id === product.categoryId,
  )!;
  const copy = getLocalizedProduct(product, locale);
  const discount = getDiscountPercent(product.price, product.oldPrice);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <ProductIllustration
          category={category.icon}
          tone={product.imageTone}
          label={copy.name}
          className="h-48"
        />
        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
            −{discount}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
          {category.name[locale]} · {product.brand}
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-extrabold leading-6">
          <Link
            className="focus-visible:rounded"
            href={localizedPath(locale, `product/${product.slug}`)}
          >
            {copy.name}
          </Link>
        </h3>
        <ul className="mt-3 min-h-12 space-y-1 text-sm text-stone-600">
          {product.specifications.slice(0, 2).map((spec) => (
            <li key={spec.label[locale]}>
              {spec.label[locale]}: {spec.value[locale]}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-4">
          <div className="flex items-end gap-2">
            <strong className="text-xl font-black tracking-tight">
              {formatPrice(product.price, locale)}
            </strong>
            {product.oldPrice && discount ? (
              <s className="mb-0.5 text-sm text-stone-500">
                {formatPrice(product.oldPrice, locale)}
              </s>
            ) : null}
          </div>
          <p
            className={`mt-2 text-sm font-bold ${product.stockStatus === "in_stock" ? "text-emerald-700" : "text-stone-500"}`}
          >
            {product.stockStatus === "in_stock"
              ? dictionary.common.inStock
              : dictionary.common.outOfStock}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              className="button-secondary"
              href={localizedPath(locale, `product/${product.slug}`)}
            >
              {dictionary.actions.view}
            </Link>
            <ContactButton
              dictionary={dictionary}
              label={dictionary.actions.contact}
              productName={copy.name}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
