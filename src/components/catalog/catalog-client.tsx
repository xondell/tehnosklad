"use client";

import { useMemo, useState } from "react";

import { ProductGrid } from "@/components/catalog/product-grid";
import {
  defaultCatalogFilters,
  filterProducts,
} from "@/features/catalog/logic";
import type {
  CatalogCategory,
  CatalogFacets,
  CatalogFilters,
  CatalogProduct,
  PublicSiteSettings,
} from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function CatalogClient({
  locale,
  dictionary,
  categories,
  products: sourceProducts,
  facets,
  settings,
  initialCategory,
  lockCategory = false,
}: {
  locale: Locale;
  dictionary: Dictionary;
  categories: CatalogCategory[];
  products: CatalogProduct[];
  facets: CatalogFacets;
  settings: PublicSiteSettings;
  initialCategory?: string;
  lockCategory?: boolean;
}) {
  const [filters, setFilters] = useState<CatalogFilters>({
    ...defaultCatalogFilters,
    categoryId: initialCategory ?? "all",
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const products = useMemo(
    () => filterProducts(sourceProducts, filters, locale),
    [sourceProducts, filters, locale],
  );
  const update = (key: keyof CatalogFilters, value: string) =>
    setFilters((old) => ({ ...old, [key]: value }));
  const updateAttribute = (code: string, value: string) =>
    setFilters((old) => ({
      ...old,
      attributes: { ...old.attributes, [code]: value },
    }));
  const reset = () =>
    setFilters({
      ...defaultCatalogFilters,
      categoryId: initialCategory ?? "all",
    });
  const fields = (
    <>
      <label className="field-label">
        {dictionary.catalog.searchLabel}
        <input
          className="field"
          value={filters.query}
          placeholder={dictionary.catalog.searchPlaceholder}
          onChange={(event) => update("query", event.target.value)}
        />
      </label>
      {!lockCategory ? (
        <label className="field-label">
          {dictionary.catalog.category}
          <select
            className="field"
            value={filters.categoryId}
            onChange={(event) => update("categoryId", event.target.value)}
          >
            <option value="all">{dictionary.catalog.allCategories}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="field-label">
        {dictionary.catalog.brand}
        <select
          className="field"
          value={filters.brand}
          onChange={(event) => update("brand", event.target.value)}
        >
          <option value="all">{dictionary.catalog.allBrands}</option>
          {facets.brands.map((brand) => (
            <option key={brand}>{brand}</option>
          ))}
        </select>
      </label>
      <label className="field-label">
        {dictionary.catalog.availability}
        <select
          className="field"
          value={filters.availability}
          onChange={(event) => update("availability", event.target.value)}
        >
          <option value="all">{dictionary.catalog.allAvailability}</option>
          <option value="in_stock">{dictionary.common.inStock}</option>
          <option value="on_order">{dictionary.common.onOrder}</option>
          <option value="out_of_stock">{dictionary.common.outOfStock}</option>
        </select>
      </label>
      <div>
        <span className="field-label">{dictionary.catalog.price}</span>
        <div className="grid grid-cols-2 gap-2">
          <input
            aria-label={dictionary.catalog.priceFrom}
            className="field"
            inputMode="numeric"
            placeholder={dictionary.catalog.priceFrom}
            value={filters.minPrice}
            onChange={(event) => update("minPrice", event.target.value)}
          />
          <input
            aria-label={dictionary.catalog.priceTo}
            className="field"
            inputMode="numeric"
            placeholder={dictionary.catalog.priceTo}
            value={filters.maxPrice}
            onChange={(event) => update("maxPrice", event.target.value)}
          />
        </div>
      </div>
      {facets.attributes.map((attribute) => (
        <label className="field-label" key={attribute.code}>
          {attribute.label}
          <select
            className="field"
            value={filters.attributes[attribute.code] ?? ""}
            onChange={(event) =>
              updateAttribute(attribute.code, event.target.value)
            }
          >
            <option value="">—</option>
            {attribute.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button className="button-secondary w-full" type="button" onClick={reset}>
        {dictionary.actions.reset}
      </button>
    </>
  );
  return (
    <>
      <button
        className="button-secondary mb-4 w-full lg:hidden"
        type="button"
        onClick={() => setMobileOpen(true)}
      >
        {dictionary.actions.filters}
      </button>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <aside
            aria-label={dictionary.catalog.mobileFilters}
            className="ml-auto h-full w-[min(22rem,92vw)] overflow-y-auto bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-black">{dictionary.actions.filters}</h2>
              <button
                aria-label={dictionary.actions.close}
                className="icon-button"
                onClick={() => setMobileOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {fields}
              <button
                className="button-primary w-full"
                type="button"
                onClick={() => setMobileOpen(false)}
              >
                {dictionary.actions.apply}
              </button>
            </div>
          </aside>
        </div>
      ) : null}
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden rounded-2xl border border-stone-200 bg-stone-50 p-4 lg:block">
          <div className="space-y-4">{fields}</div>
        </aside>
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-bold">
              {products.length} {dictionary.common.results}
            </p>
            <label className="flex items-center gap-2 text-sm font-bold">
              {dictionary.catalog.sort}
              <select
                className="field w-auto"
                value={filters.sort}
                onChange={(event) => update("sort", event.target.value)}
              >
                <option value="popular">
                  {dictionary.catalog.sortPopular}
                </option>
                <option value="new">{dictionary.catalog.sortNew}</option>
                <option value="price_asc">
                  {dictionary.catalog.sortPriceAsc}
                </option>
                <option value="price_desc">
                  {dictionary.catalog.sortPriceDesc}
                </option>
                <option value="name">{dictionary.catalog.sortName}</option>
              </select>
            </label>
          </div>
          {products.length ? (
            <ProductGrid
              products={products}
              locale={locale}
              dictionary={dictionary}
              settings={settings}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-300 p-10 text-center">
              <h2 className="text-xl font-black">
                {dictionary.catalog.emptyTitle}
              </h2>
              <p className="mt-2 text-stone-600">
                {dictionary.catalog.emptyText}
              </p>
              <button
                className="button-secondary mt-5"
                type="button"
                onClick={reset}
              >
                {dictionary.actions.reset}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
