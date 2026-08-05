import type { MetadataRoute } from "next";

import {
  getPublishedCategories,
  getPublishedProducts,
} from "@/features/catalog/data";
import type { Locale } from "@/i18n/config";
import { getSiteUrl } from "@/lib/env/public";

export const dynamic = "force-dynamic";

const locales: Locale[] = ["ru", "ro"];

function localizedAlternates(paths: Record<Locale, string>, origin: string) {
  return {
    languages: {
      ru: new URL(paths.ru, origin).toString(),
      ro: new URL(paths.ro, origin).toString(),
      "x-default": new URL(paths.ru, origin).toString(),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteUrl();
  const [ruCategories, roCategories, ruProducts, roProducts] =
    await Promise.all([
      getPublishedCategories("ru"),
      getPublishedCategories("ro"),
      getPublishedProducts("ru"),
      getPublishedProducts("ro"),
    ]);

  const entries: MetadataRoute.Sitemap = [];
  for (const path of ["", "/catalog", "/contacts"]) {
    const paths = { ru: `/ru${path}`, ro: `/ro${path}` };
    for (const locale of locales) {
      entries.push({
        url: new URL(paths[locale], origin).toString(),
        changeFrequency: path === "" ? "weekly" : "daily",
        priority: path === "" ? 1 : path === "/catalog" ? 0.9 : 0.6,
        alternates: localizedAlternates(paths, origin),
      });
    }
  }

  const categoriesById = new Map(roCategories.map((item) => [item.id, item]));
  for (const category of ruCategories) {
    const alternate = categoriesById.get(category.id);
    if (!alternate) continue;
    const paths = {
      ru: `/ru/category/${category.slug}`,
      ro: `/ro/category/${alternate.slug}`,
    };
    for (const locale of locales) {
      entries.push({
        url: new URL(paths[locale], origin).toString(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: localizedAlternates(paths, origin),
      });
    }
  }

  const productsById = new Map(roProducts.map((item) => [item.id, item]));
  for (const product of ruProducts) {
    const alternate = productsById.get(product.id);
    if (!alternate) continue;
    const paths = {
      ru: `/ru/product/${product.slug}`,
      ro: `/ro/product/${alternate.slug}`,
    };
    for (const locale of locales) {
      entries.push({
        url: new URL(paths[locale], origin).toString(),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: localizedAlternates(paths, origin),
      });
    }
  }

  return entries;
}
