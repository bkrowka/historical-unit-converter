
export const translations = {
  en: {
    heritageConverter: 'Historical Unit Converter',
    converterDescription: 'Convert historical units to modern measurements.',
    valueLabel: 'Value',
    enterPlaceholder: 'enter',
    fromLabel: 'From',
    selectHistoricalUnit: 'select historical unit',
    toLabel: 'To',
    selectModernUnit: 'select modern unit',
    is: 'is',
    errorEmpty: 'Input cannot be empty.',
    errorInvalid: 'Invalid input: Please enter a valid number.',
    errorUnitSelection: 'A "from" or "to" unit must be selected.',
    errorUnitNotFound: (category: string) => `Conversion unit not found in category '${category}'.`,
    categories: {
      length: 'length',
      mass: 'mass',
      volume: 'volume',
      area: 'area',
      time: 'time',
    },
    units: {
      // Universal (Time) - Translated
      moment: 'moment',
      lunar_month: 'lunar month',
      solar_year: 'solar year',

      // Described
      stopa: 'stopa (old polish)',

      // Modern - Translated
      meter: 'meter',
      kilometer: 'kilometer',
      foot_modern: 'foot',
      inch_modern: 'inch',
      square_meter: 'square meter',
      hectare: 'hectare',
      acre: 'acre',
      kilogram: 'kilogram',
      gram: 'gram',
      pound_modern: 'pound',
      liter: 'liter',
      gallon_us: 'gallon (us)',
      cubic_meter: 'cubic meter',
      second: 'second',
      minute: 'minute',
      hour: 'hour',
      day: 'day',
    },
  },
  pl: {
    heritageConverter: 'Konwerter Jednostek Historycznych',
    converterDescription: 'Przeliczaj jednostki historyczne na współczesne miary.',
    valueLabel: 'Wartość',
    enterPlaceholder: 'wprowadź',
    fromLabel: 'Z',
    selectHistoricalUnit: 'wybierz jednostkę historyczną',
    toLabel: 'Do',
    selectModernUnit: 'wybierz jednostkę współczesną',
    is: 'to',
    errorEmpty: 'Pole nie może być puste.',
    errorInvalid: 'Nieprawidłowe dane: Wprowadź prawidłową liczbę.',
    errorUnitSelection: 'Należy wybrać jednostkę "z" i "do".',
    errorUnitNotFound: (category: string) => `Nie znaleziono jednostki konwersji w kategorii '${category}'.`,
    categories: {
      length: 'długość',
      mass: 'masa',
      volume: 'objętość',
      area: 'powierzchnia',
      time: 'czas',
    },
    units: {
      // Universal (Time) - Translated
      moment: 'chwila',
      lunar_month: 'miesiąc księżycowy',
      solar_year: 'rok słoneczny',

      // Described
      stopa: 'stopa (staropolska)',
      
      // Modern - Translated
      meter: 'metr',
      kilometer: 'kilometr',
      foot_modern: 'stopa',
      inch_modern: 'cal',
      square_meter: 'metr kw.',
      hectare: 'hektar',
      acre: 'akr',
      kilogram: 'kilogram',
      gram: 'gram',
      pound_modern: 'funt',
      liter: 'litr',
      gallon_us: 'galon (usa)',
      cubic_meter: 'metr sześcienny',
      second: 'sekunda',
      minute: 'minuta',
      hour: 'godzina',
      day: 'dzień',
    },
  },
};

export type Language = keyof typeof translations;
export const LANGUAGES: Language[] = ['en', 'pl'];

export const getTranslation = (lang: Language) => translations[lang];
