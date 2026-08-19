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
    id: "washing-machines",
    slug: "washing-machines",
    icon: "generic",
    name: { ru: "Стиральные машины", ro: "Mașini de spălat rufe" },
    description: {
      ru: "Надёжная забота о ваших вещах",
      ro: "Îngrijire de încredere pentru hainele tale",
    },
  },
  {
    id: "stoves-and-cooktops",
    slug: "stoves-and-cooktops",
    icon: "stove",
    name: { ru: "Плиты и варочные панели", ro: "Plite și aragazuri" },
    description: {
      ru: "Удобство и комфорт на вашей кухне",
      ro: "Confort și eficiență în bucătăria ta",
    },
  },
  {
    id: "microwave-ovens",
    slug: "microwave-ovens",
    icon: "generic",
    name: { ru: "Микроволновые печи", ro: "Cuptoare cu microunde" },
    description: {
      ru: "Быстрый разогрев и приготовление блюд",
      ro: "Încălzire rapidă și preparare ușoară",
    },
  },
  {
    id: "dishwashers",
    slug: "dishwashers",
    icon: "generic",
    name: { ru: "Посудомоечные машины", ro: "Mașini de spălat vase" },
    description: {
      ru: "Идеальная чистота посуды без хлопот",
      ro: "Curățenie impecabilă a vaselor fără efort",
    },
  },
  {
    id: "ovens",
    slug: "ovens",
    icon: "stove",
    name: { ru: "Духовые шкафы", ro: "Cuptoare încorporabile" },
    description: {
      ru: "Для кулинарных шедевров и выпечки",
      ro: "Pentru capodopere culinare și copt",
    },
  },
  {
    id: "dryers",
    slug: "dryers",
    icon: "generic",
    name: { ru: "Сушильные машины", ro: "Uscătoare de rufe" },
    description: {
      ru: "Быстрая и бережная сушка белья",
      ro: "Uscare rapidă și delicată a hainelor",
    },
  },
  {
    id: "coffee-machines",
    slug: "coffee-machines",
    icon: "generic",
    name: { ru: "Кофемашины", ro: "Espresoare de cafea" },
    description: {
      ru: "Ароматный кофе каждый день",
      ro: "Cafea aromată în fiecare zi",
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
  {
    id: "robot-vacuums",
    slug: "robot-vacuums",
    icon: "vacuum",
    name: { ru: "Роботы-пылесосы", ro: "Aspiratoare robot" },
    description: {
      ru: "Автоматическая уборка для вашего дома",
      ro: "Curățare automată pentru casa ta",
    },
  },
  {
    id: "electric-kettles",
    slug: "electric-kettles",
    icon: "generic",
    name: { ru: "Электрочайники", ro: "Fierbătoare electrice" },
    description: {
      ru: "Быстрое кипячение воды",
      ro: "Fierbere rapidă a apei",
    },
  },
  {
    id: "blenders",
    slug: "blenders",
    icon: "generic",
    name: { ru: "Блендеры", ro: "Blendere" },
    description: {
      ru: "Для смузи, коктейлей и соусов",
      ro: "Pentru smoothie-uri, cocktailuri și sosuri",
    },
  },
  {
    id: "food-processors",
    slug: "food-processors",
    icon: "generic",
    name: { ru: "Кухонные комбайны", ro: "Roboți de bucătărie" },
    description: {
      ru: "Многофункциональные помощники на кухне",
      ro: "Ajutoare multifuncționale în bucătărie",
    },
  },
  {
    id: "toasters",
    slug: "toasters",
    icon: "generic",
    name: { ru: "Тостеры и ростеры", ro: "Prăjitoare de pâine și roastere" },
    description: {
      ru: "Хрустящие тосты к завтраку",
      ro: "Pâine prăjită crocantă pentru micul dejun",
    },
  },
  {
    id: "air-conditioners",
    slug: "air-conditioners",
    icon: "generic",
    name: { ru: "Кондиционеры", ro: "Aparate de aer condiționat" },
    description: {
      ru: "Комфортный климат в любое время года",
      ro: "Climat confortabil în orice anotimp",
    },
  },
];

export const demoProducts: DemoProduct[] = [];
