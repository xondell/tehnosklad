"use client";

import { useState } from "react";

import { ProductIllustration } from "@/components/catalog/product-illustration";
import type { CatalogProduct } from "@/features/catalog/types";

export function ProductGallery({
  product,
  label,
  previous,
  next,
}: {
  product: CatalogProduct;
  label: string;
  previous: string;
  next: string;
}) {
  const [current, setCurrent] = useState(0);
  const images = product.images;
  const activeImage = images[current];
  const go = (step: number) =>
    setCurrent((value) => (value + step + images.length) % images.length);
  return (
    <section aria-label={label}>
      <div className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white p-4 shadow-sm">
        <ProductIllustration
          category={product.category.presentationKey}
          tone={product.imageTone}
          label={activeImage?.alt ?? product.name}
          imageUrl={activeImage?.url}
          className="h-80 sm:h-96"
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-4 flex items-center justify-between gap-3">
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
                className={`h-14 w-16 overflow-hidden rounded-2xl border-2 transition-colors ${current === index ? "border-[var(--brand)] shadow-sm" : "border-stone-200 opacity-70 hover:opacity-100"}`}
                type="button"
                onClick={() => setCurrent(index)}
                key={image.id}
              >
                <ProductIllustration
                  category={product.category.presentationKey}
                  tone={product.imageTone}
                  label={image.alt}
                  imageUrl={image.url}
                  className="h-full"
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
      ) : null}
    </section>
  );
}
