import type { DemoCategory, DemoProduct } from "@/features/catalog/types";

// Development-only data boundary. Replace this module with a Supabase repository in Stage 3/4.
export const demoCategories: DemoCategory[] = [
  {
    id: "refrigerators",
    slug: "refrigerators",
    icon: "fridge",
    name: { ru: "Холодильники", ro: "Frigidere" },
    description: {
      ru: "Для свежих продуктов каждый день",
      ro: "Pentru produse proaspete în fiecare zi",
    },
  },
  {
    id: "stoves",
    slug: "stoves",
    icon: "stove",
    name: { ru: "Плиты", ro: "Aragazuri" },
    description: {
      ru: "Удобство на вашей кухне",
      ro: "Confort pentru bucătăria dumneavoastră",
    },
  },
  {
    id: "vacuums",
    slug: "vacuums",
    icon: "vacuum",
    name: { ru: "Пылесосы", ro: "Aspiratoare" },
    description: {
      ru: "Чистота без лишних усилий",
      ro: "Curățenie fără efort suplimentar",
    },
  },
];

const p = (
  id: string,
  categoryId: string,
  brand: string,
  model: string,
  priceMinor: number,
  options: Partial<
    Omit<
      DemoProduct,
      | "id"
      | "categoryId"
      | "brand"
      | "model"
      | "priceMinor"
      | "name"
      | "shortDescription"
      | "description"
      | "sku"
      | "slug"
      | "specifications"
      | "stockStatus"
      | "isPopular"
      | "isNew"
      | "imageTone"
    >
  > &
    Pick<
      DemoProduct,
      | "name"
      | "shortDescription"
      | "description"
      | "specifications"
      | "stockStatus"
      | "isPopular"
      | "isNew"
      | "imageTone"
    >,
): DemoProduct => ({
  id,
  slug: id,
  categoryId,
  brand,
  model,
  sku: `DEMO-${id.toUpperCase()}`,
  priceMinor,
  ...options,
});
const specs = (a: string, b: string, cRu: string, cRo: string) => [
  { label: { ru: "Объём", ro: "Capacitate" }, value: { ru: a, ro: a } },
  { label: { ru: "Класс", ro: "Clasă" }, value: { ru: b, ro: b } },
  {
    label: { ru: "Особенность", ro: "Caracteristică" },
    value: { ru: cRu, ro: cRo },
  },
];

export const demoProducts: DemoProduct[] = [
  p("nord-cool-300", "refrigerators", "Nord", "Cool 300", 789000, {
    oldPriceMinor: 849000,
    stockStatus: "in_stock",
    isPopular: true,
    isNew: false,
    imageTone: "blue",
    name: { ru: "Холодильник Nord Cool 300", ro: "Frigider Nord Cool 300" },
    shortDescription: {
      ru: "Практичная двухкамерная модель для дома.",
      ro: "Model practic cu două compartimente pentru casă.",
    },
    description: {
      ru: "Демонстрационная модель с продуманным внутренним пространством.",
      ro: "Model demonstrativ cu spațiu interior bine organizat.",
    },
    specifications: specs("300 л", "A", "две камеры", "două compartimente"),
  }),
  p("vesta-fresh-280", "refrigerators", "Vesta", "Fresh 280", 699000, {
    stockStatus: "in_stock",
    isPopular: false,
    isNew: true,
    imageTone: "mint",
    name: { ru: "Холодильник Vesta Fresh 280", ro: "Frigider Vesta Fresh 280" },
    shortDescription: {
      ru: "Компактный формат для небольшой кухни.",
      ro: "Format compact pentru o bucătărie mică.",
    },
    description: {
      ru: "Демонстрационный вариант для повседневного хранения продуктов.",
      ro: "Variantă demonstrativă pentru păstrarea zilnică a produselor.",
    },
    specifications: specs(
      "280 л",
      "A",
      "нижняя морозильная камера",
      "congelator inferior",
    ),
  }),
  p("orion-frost-360", "refrigerators", "Orion", "Frost 360", 929000, {
    oldPriceMinor: 999000,
    stockStatus: "out_of_stock",
    isPopular: true,
    isNew: false,
    imageTone: "yellow",
    name: { ru: "Холодильник Orion Frost 360", ro: "Frigider Orion Frost 360" },
    shortDescription: {
      ru: "Вместительная модель для семьи.",
      ro: "Model încăpător pentru familie.",
    },
    description: {
      ru: "Демонстрационная карточка вместительного холодильника.",
      ro: "Card demonstrativ pentru un frigider încăpător.",
    },
    specifications: specs(
      "360 л",
      "A+",
      "система охлаждения",
      "sistem de răcire",
    ),
  }),
  p("doma-line-240", "refrigerators", "Doma", "Line 240", 619000, {
    stockStatus: "in_stock",
    isPopular: false,
    isNew: false,
    imageTone: "coral",
    name: { ru: "Холодильник Doma Line 240", ro: "Frigider Doma Line 240" },
    shortDescription: {
      ru: "Лаконичное решение для квартиры.",
      ro: "Soluție simplă pentru apartament.",
    },
    description: {
      ru: "Демонстрационная модель с базовым набором возможностей.",
      ro: "Model demonstrativ cu funcții esențiale.",
    },
    specifications: specs(
      "240 л",
      "A",
      "перенавешиваемая дверь",
      "ușă reversibilă",
    ),
  }),
  p("vesta-chef-50", "stoves", "Vesta", "Chef 50", 529000, {
    oldPriceMinor: 579000,
    stockStatus: "in_stock",
    isPopular: true,
    isNew: false,
    imageTone: "coral",
    name: { ru: "Плита Vesta Chef 50", ro: "Aragaz Vesta Chef 50" },
    shortDescription: {
      ru: "Надёжный формат для ежедневной готовки.",
      ro: "Format fiabil pentru gătitul zilnic.",
    },
    description: {
      ru: "Демонстрационная плита с понятным управлением.",
      ro: "Aragaz demonstrativ cu control intuitiv.",
    },
    specifications: specs("50 см", "A", "духовой шкаф", "cuptor"),
  }),
  p("nord-heat-60", "stoves", "Nord", "Heat 60", 689000, {
    stockStatus: "in_stock",
    isPopular: false,
    isNew: true,
    imageTone: "yellow",
    name: { ru: "Плита Nord Heat 60", ro: "Aragaz Nord Heat 60" },
    shortDescription: {
      ru: "Широкая рабочая поверхность.",
      ro: "Suprafață de lucru mai lată.",
    },
    description: {
      ru: "Демонстрационная модель для просторной кухни.",
      ro: "Model demonstrativ pentru o bucătărie spațioasă.",
    },
    specifications: specs("60 см", "A", "четыре зоны", "patru zone"),
  }),
  p("orion-flame-50", "stoves", "Orion", "Flame 50", 459000, {
    stockStatus: "out_of_stock",
    isPopular: false,
    isNew: false,
    imageTone: "blue",
    name: { ru: "Плита Orion Flame 50", ro: "Aragaz Orion Flame 50" },
    shortDescription: {
      ru: "Компактная техника для кухни.",
      ro: "Tehnică compactă pentru bucătărie.",
    },
    description: {
      ru: "Демонстрационная карточка компактной плиты.",
      ro: "Card demonstrativ al unui aragaz compact.",
    },
    specifications: specs(
      "50 см",
      "A",
      "эмалированная поверхность",
      "suprafață emailată",
    ),
  }),
  p("doma-kitchen-55", "stoves", "Doma", "Kitchen 55", 599000, {
    oldPriceMinor: 649000,
    stockStatus: "in_stock",
    isPopular: true,
    isNew: true,
    imageTone: "mint",
    name: { ru: "Плита Doma Kitchen 55", ro: "Aragaz Doma Kitchen 55" },
    shortDescription: {
      ru: "Продуманная модель для дома.",
      ro: "Model bine gândit pentru casă.",
    },
    description: {
      ru: "Демонстрационный вариант с удобной зоной приготовления.",
      ro: "Variantă demonstrativă cu zonă de gătit comodă.",
    },
    specifications: specs(
      "55 см",
      "A",
      "подсветка духовки",
      "iluminarea cuptorului",
    ),
  }),
  p("nord-air-700", "vacuums", "Nord", "Air 700", 219000, {
    stockStatus: "in_stock",
    isPopular: true,
    isNew: false,
    imageTone: "yellow",
    name: { ru: "Пылесос Nord Air 700", ro: "Aspirator Nord Air 700" },
    shortDescription: {
      ru: "Лёгкий помощник для ежедневной уборки.",
      ro: "Ajutor ușor pentru curățenia zilnică.",
    },
    description: {
      ru: "Демонстрационная модель для сухой уборки дома.",
      ro: "Model demonstrativ pentru curățarea uscată a casei.",
    },
    specifications: specs("1,8 л", "A", "контейнер", "recipient"),
  }),
  p("vesta-clean-900", "vacuums", "Vesta", "Clean 900", 289000, {
    oldPriceMinor: 319000,
    stockStatus: "in_stock",
    isPopular: false,
    isNew: true,
    imageTone: "mint",
    name: { ru: "Пылесос Vesta Clean 900", ro: "Aspirator Vesta Clean 900" },
    shortDescription: {
      ru: "Удобная уборка разных поверхностей.",
      ro: "Curățenie comodă pentru suprafețe diferite.",
    },
    description: {
      ru: "Демонстрационный пылесос с набором базовых насадок.",
      ro: "Aspirator demonstrativ cu accesorii de bază.",
    },
    specifications: specs(
      "2 л",
      "A",
      "регулировка мощности",
      "reglarea puterii",
    ),
  }),
  p("orion-sweep-500", "vacuums", "Orion", "Sweep 500", 179000, {
    stockStatus: "out_of_stock",
    isPopular: false,
    isNew: false,
    imageTone: "coral",
    name: { ru: "Пылесос Orion Sweep 500", ro: "Aspirator Orion Sweep 500" },
    shortDescription: {
      ru: "Компактная модель для квартиры.",
      ro: "Model compact pentru apartament.",
    },
    description: {
      ru: "Демонстрационный вариант для регулярной уборки.",
      ro: "Variantă demonstrativă pentru curățenie regulată.",
    },
    specifications: specs(
      "1,5 л",
      "A",
      "компактный корпус",
      "carcasă compactă",
    ),
  }),
  p("doma-dust-800", "vacuums", "Doma", "Dust 800", 249000, {
    stockStatus: "in_stock",
    isPopular: true,
    isNew: true,
    imageTone: "blue",
    name: { ru: "Пылесос Doma Dust 800", ro: "Aspirator Doma Dust 800" },
    shortDescription: {
      ru: "Для аккуратной уборки без лишнего шума.",
      ro: "Pentru curățenie atentă fără zgomot excesiv.",
    },
    description: {
      ru: "Демонстрационная модель для комфортного домашнего использования.",
      ro: "Model demonstrativ pentru utilizare confortabilă acasă.",
    },
    specifications: specs(
      "2,2 л",
      "A",
      "телескопическая трубка",
      "tub telescopic",
    ),
  }),
];
