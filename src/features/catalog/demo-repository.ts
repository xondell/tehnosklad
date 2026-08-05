import { siteConfig } from "@/config/site";
import { demoCategories, demoProducts } from "@/features/catalog/demo-data";
import { buildCatalogFacets } from "@/features/catalog/facets";
import {
  CatalogDataError,
  type CatalogRepository,
  type ProductQuery,
} from "@/features/catalog/repository";
import type {
  CatalogCategory,
  CatalogProduct,
  PublicSiteSettings,
} from "@/features/catalog/types";
import type { Locale } from "@/i18n/config";

function localizeCategory(
  category: (typeof demoCategories)[number],
  locale: Locale,
): CatalogCategory {
  return {
    id: category.id,
    slug: category.slug,
    alternateSlug: category.slug,
    presentationKey: category.icon,
    name: category.name[locale],
    shortDescription: category.description[locale],
    description: category.description[locale],
  };
}

function localizeProduct(
  product: (typeof demoProducts)[number],
  locale: Locale,
): CatalogProduct {
  const rawCategory = demoCategories.find(
    (category) => category.id === product.categoryId,
  );
  if (!rawCategory) {
    throw new CatalogDataError(
      "invalid_data",
      `Demo product ${product.id} has no category`,
    );
  }

  return {
    id: product.id,
    slug: product.slug,
    alternateSlug: product.slug,
    category: localizeCategory(rawCategory, locale),
    brand: product.brand,
    model: product.model,
    sku: product.sku,
    name: product.name[locale],
    shortDescription: product.shortDescription[locale],
    description: product.description[locale],
    priceMinor: product.priceMinor,
    oldPriceMinor: product.oldPriceMinor ?? null,
    currency: "MDL",
    stockStatus: product.stockStatus,
    isPopular: product.isPopular,
    isNew: product.isNew,
    specifications: product.specifications.map((specification, index) => ({
      code: `demo_${index + 1}`,
      groupCode: "general",
      groupName:
        locale === "ru"
          ? "Основные характеристики"
          : "Caracteristici principale",
      label: specification.label[locale],
      displayValue: specification.value[locale],
      filterValue: specification.value[locale],
      dataType: "text",
      isFilterable: false,
      sortOrder: index,
    })),
    images: [],
    imageTone: product.imageTone,
  };
}

function demoSettings(locale: Locale): PublicSiteSettings {
  return {
    phoneDisplay: siteConfig.phoneDisplay,
    phoneHref: siteConfig.phoneHref,
    address:
      locale === "ru" ? "ул. Победы, 97, Комрат" : "str. Victoriei, 97, Comrat",
    openDays: locale === "ru" ? siteConfig.hours.openDays : "Marți–duminică",
    openTime: siteConfig.hours.openTime,
    closedDay:
      locale === "ru" ? siteConfig.hours.closedDay : "Luni — zi liberă",
    contactText:
      locale === "ru"
        ? "Позвоните нам в часы работы магазина."
        : "Sunați-ne în programul magazinului.",
  };
}

export class DemoCatalogRepository implements CatalogRepository {
  async getPublishedCategories(locale: Locale) {
    return demoCategories.map((category) => localizeCategory(category, locale));
  }

  async getPublishedProducts(locale: Locale, query: ProductQuery = {}) {
    return demoProducts
      .filter(
        (product) =>
          (!query.categoryId || product.categoryId === query.categoryId) &&
          (!query.popularOnly || product.isPopular),
      )
      .slice(0, query.limit)
      .map((product) => localizeProduct(product, locale));
  }

  async getCategoryBySlug(locale: Locale, slug: string) {
    const category = demoCategories.find((item) => item.slug === slug);
    return category ? localizeCategory(category, locale) : null;
  }

  async getProductBySlug(locale: Locale, slug: string) {
    const product = demoProducts.find((item) => item.slug === slug);
    return product ? localizeProduct(product, locale) : null;
  }

  async getSimilarProducts(
    locale: Locale,
    productId: string,
    categoryId: string,
    limit: number,
  ) {
    return demoProducts
      .filter(
        (product) =>
          product.categoryId === categoryId && product.id !== productId,
      )
      .slice(0, limit)
      .map((product) => localizeProduct(product, locale));
  }

  async getAvailableFilters(locale: Locale, categoryId?: string) {
    return buildCatalogFacets(
      await this.getPublishedProducts(locale, { categoryId }),
    );
  }

  async getPublicSiteSettings(locale: Locale) {
    return demoSettings(locale);
  }
}
