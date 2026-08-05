export type Dictionary = {
  localeName: string;
  skipToContent: string;
  navigationLabel: string;
  navigation: {
    home: string;
    catalog: string;
    contacts: string;
  };
  actions: {
    call: string;
    openCatalog: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    stageNote: string;
  };
  routeShell: {
    catalogTitle: string;
    catalogDescription: string;
    categoryTitle: string;
    productTitle: string;
    searchTitle: string;
    contactsTitle: string;
  };
  footer: {
    contacts: string;
    schedule: string;
    legal: string;
    privacy: string;
    personalData: string;
    rights: string;
  };
  languageSwitcherLabel: string;
};
