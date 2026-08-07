import "server-only";
import {
  getPublicSiteSettings,
  searchPublishedProducts,
} from "@/features/catalog/data";
import type {
  CatalogProduct,
  PublicSiteSettings,
} from "@/features/catalog/types";
import { localizedPath, type Locale } from "@/i18n/config";
import type {
  AssistantReference,
  AssistantRequest,
} from "@/features/assistant/types";
import { answerDirectQuestion } from "@/features/assistant/direct-answer";
import { searchAssistantKnowledge } from "@/features/assistant/knowledge";
import { siteConfig } from "@/config/site";
import {
  getLegalOperatorConfig,
  type LegalOperatorConfig,
} from "@/lib/env/legal";

const MAX_PRODUCTS = 5;
function terms(value: string) {
  return (
    value
      .match(/[\p{L}\p{N}-]{2,}/gu)
      ?.slice(-12)
      .join(" ") ?? value
  );
}

function catalogQuestion(request: AssistantRequest) {
  const recentUserQuestions = request.history
    .filter((message) => message.role === "user")
    .slice(-2)
    .map((message) => message.content);
  return terms([...recentUserQuestions, request.question].join(" ")).slice(
    0,
    100,
  );
}

function publicContext(
  settings: PublicSiteSettings,
  operator: LegalOperatorConfig,
) {
  return {
    store: {
      name: siteConfig.name,
      address: settings.address,
      phone: settings.phoneDisplay,
      openDays: settings.openDays,
      openTime: settings.openTime,
      closedDay: settings.closedDay,
      contactText: settings.contactText,
    },
    legalOperator: {
      name: operator.name,
      idno: operator.idno,
      legalAddress: operator.legalAddress,
      privacyEmail: operator.privacyEmail,
      responsiblePerson: operator.responsiblePerson,
    },
  };
}

export async function buildAssistantContext(request: AssistantRequest) {
  const settings = await getPublicSiteSettings(request.locale);
  const operator = getLegalOperatorConfig();
  const direct = answerDirectQuestion(
    request.locale,
    request.question,
    settings,
    operator,
  );
  const baseContext = publicContext(settings, operator);
  if (direct) {
    return {
      products: [],
      references: [],
      knowledge: [],
      settings,
      directAnswer: direct.answer,
      directIntent: direct.intent,
      context: JSON.stringify({ ...baseContext, knowledge: [], catalog: [] }),
    };
  }

  const [result, knowledge] = await Promise.all([
    searchPublishedProducts(request.locale, undefined, {
      query: catalogQuestion(request),
      brand: null,
      availability: null,
      minPriceMinor: null,
      maxPriceMinor: null,
      attributes: {},
      sort: "popular",
      page: 1,
      pageSize: MAX_PRODUCTS,
    }),
    searchAssistantKnowledge(request.locale, request.question),
  ]);
  const products = result.products.slice(0, MAX_PRODUCTS);
  const references = products.map((product) =>
    referenceFor(product, request.locale),
  );
  const catalog = products.map((product) => ({
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
    url: referenceFor(product, request.locale).url,
  }));
  return {
    products,
    references,
    knowledge,
    settings,
    directAnswer: null,
    directIntent: null,
    context: JSON.stringify({
      ...baseContext,
      knowledge: knowledge.map(({ id, title, content, source }) => ({
        id,
        title,
        content,
        source,
      })),
      catalog,
    }),
  };
}

/*
 * Product references are always assembled from authoritative catalog DTOs.
 * The provider can select IDs but cannot create names, prices or URLs.
 */
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
