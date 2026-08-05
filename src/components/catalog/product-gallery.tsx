"use client";
import { useState } from "react";
import { ProductIllustration } from "@/components/catalog/product-illustration";
import { demoCategories } from "@/features/catalog/demo-data";
import type { DemoProduct } from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";
export function ProductGallery({
  product,
  locale,
  label,
  previous,
  next,
}: {
  product: DemoProduct;
  locale: Locale;
  label: string;
  previous: string;
  next: string;
}) {
  const [current, setCurrent] = useState(0);
  const category = demoCategories.find(
    (item) => item.id === product.categoryId,
  )!;
  const images = ["main", "detail", "side"];
  const go = (step: number) =>
    setCurrent((value) => (value + step + images.length) % images.length);
  return (
    <section aria-label={label}>
      <ProductIllustration
        category={category.icon}
        tone={product.imageTone}
        label={product.name[locale]}
        className="h-80 sm:h-96"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          aria-label={previous}
          className="icon-button"
          type="button"
          onClick={() => go(-1)}
        >
          ←
        </button>
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              aria-label={`${label} ${index + 1}`}
              aria-pressed={current === index}
              className={`h-14 w-16 overflow-hidden rounded-lg border ${current === index ? "border-black bg-stone-100" : "border-stone-200"}`}
              type="button"
              onClick={() => setCurrent(index)}
              key={image}
            >
              <ProductIllustration
                category={category.icon}
                tone={product.imageTone}
                label={`${label} ${index + 1}`}
                className={`h-full ${index === 1 ? "scale-90" : index === 2 ? "scale-75" : ""}`}
              />
            </button>
          ))}
        </div>
        <button
          aria-label={next}
          className="icon-button"
          type="button"
          onClick={() => go(1)}
        >
          →
        </button>
      </div>
    </section>
  );
}
