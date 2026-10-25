export const queryParametersSearchTitle = {
  inForce: { text: "inForce", description: "wartość '1' powoduje wyszukiwanie tylko aktów obowiązujących" },
  publisher: { text: "publisher", description: "kod wydawnictwa" },
  year: { text: "year", description: "rok wydania" },
  volume: { text: "volume", description: "zeszyt" },
  position: { text: "position", description: "pozycja" },
  title: { text: "title", description: "fragment tytułu do wyszukania" },
  date: { text: "date", description: "data wydania w formacie yyyy - MM - dd" },
  dateFrom: { text: "dateFrom", description: "minimalna data wydania w formacie yyyy - MM - dd" },
  dateTo: { text: "dateTo", description: "maksymalna data wydania w formacie yyyy - MM - dd" },
  dateEffect: { text: "dateEffect", description: "data wejścia w życie" },
  dateEffectFrom: { text: "dateEffectFrom", description: "minimalna data wejścia w życie" },
  dateEffectTo: { text: "dateEffectTo", description: "maksymalna data wejścia w życie" },
  pubDate: { text: "pubDate", description: "data publikacji" },
  pubDateFrom: { text: "pubDateFrom", description: "minimalna data publikacji" },
  pubDateTo: { text: "pubDateTo", description: "maksymalna data publikacji" },
  type: { text: "type", description: "typ aktu" },
  keyword: { text: "keyword", description: "lista słów kluczowych, oddzielonych przecinkiem" },
  limit: { text: "limit", description: "maksymalna liczba wyników" },
  offset: { text: "offset", description: "indeks początkowy zwracanych wyników" },
  sortBy: { text: "sortBy", description: "kolumna wg której sortować wyniki" },
  sortDir: { text: "sortDir", description: "kierunek sortowania: asc lub desc" },
}

export type LegalActsResponseSearchTitle = {
  totalCount: number; /** Liczba aktów w roku. */
  offset: number; /** Indeks pierwszego aktu. */
  count: number; /** Liczba aktów w odpowiedzi. */
  searchQuery: { /** Informacje o parametrach wyszukiwania. */
    comparator: {  /** Kolejność sortowania. */
      column: string; /** Kolumna sortowania. */

      dir: "asc" | "desc"; /** Kierunek sortowania: asc lub desc. */
    };
    dateEffectType: string; /** Typ porównania daty wejścia w życie. */
    dateEffectFrom: string; /** Początkowa data wejścia w życie. */
    dateEffectTo: string; /** Końcowa data wejścia w życie. */
    dateType: string; /** Typ porównania daty wydania / ogłoszenia — dwa opisy w tabeli. */
    dateFrom: string; /** Początkowa data wydania. */
    dateTo: string; /** Końcowa data wydania. */
    exile: boolean; /** Parametr nieużywany. */
    keyword: string[]; /** Lista słów kluczowych do wyszukania. */
    position: number; /** Numer aktu. */
    pubDateType: string; /** Typ porównania daty publikacji. */
    pubDateFrom: string; /** Początkowa data publikacji. */
    pubDatetTo: string; /** Końcowa data publikacji. */
    publisher: string;  /** Kod wydawcy. */
    publisherName: string; /** Nazwa wydawcy. */
    statusInForce: boolean; /** Czy wyszukiwanie obejmuje tylko akty obowiązujące. */
    title: string; /** Tytuł do wyszukania. */
    type: string[]; /** Lista typów aktu do wyszukania. */
    volume: number; /** Numer zeszytu. */
    year: number; /** Rok wydania. */
  };

  items: { /** Lista aktów. */
    ELI: string; /** Identyfikator ELI. */
    address: string; /** Identyfikator w systemie ISAP. */
    publisher: string; /** Symbol wydawnictwa. */
    year: number; /** Rok wydania. */
    volume: number; /** Numer zeszytu. */
    pos: number; /** Pozycja aktu w roku. */
    title: string; /** Tytuł aktu. */
    displayAddress: string; /** Adres do wyświetlenia. */
    promulgation: string; /** Data ogłoszenia. */
    announcementDate: string; /** Data wydania. */
    textPDF: boolean; /** Czy akt ma tekst w postaci PDF. */
    textHTML: boolean; /** Czy akt ma tekst w postaci HTML. */
    changeDate: string; /** Data ostatniej zmiany. */
    type: string; /** Typ aktu, np. ustawa. */
    status: string; /** Status obowiązywania. */
  }[];
};






export type LegalActReference = {
  id?: string;
  art?: string;
  date?: string;
};

// T	Tekst aktu — osobny plik tekstu prezentowany przez ELI.Nie oznacza automatycznie tekstu jednolitego.
// O	Tekst ogłoszony w dzienniku urzędowym.
// U	Tekst ujednolicony, uwzględniający naniesione zmiany.
// H	Tekst w formacie HTML.
// I	Dodatkowy wariant pliku PDF — nie mam potwierdzonego oficjalnego rozwinięcia tej litery.
export type LegalActText = {
  fileName?: string;
  type?: "T" | "O" | "U" | "H" | "I";
};

export type LegalActDirective = {
  address?: string;
  title?: string;
  date?: string;
};

export type LegalActPrint = {
  term?: number;
  number?: string;
  link?: string;
  linkPrintAPI?: string;
  linkProcessAPI?: string;
};

export type LegalActDetails = {
  // Identyfikacja i publikacja
  ELI?: string;
  address?: string;
  publisher?: string;
  year?: number;
  volume?: number;
  pos?: number;
  title?: string;
  displayAddress?: string;

  // Daty — API zwraca je jako stringi
  promulgation?: string;
  announcementDate?: string;
  changeDate?: string;
  entryIntoForce?: string;
  validFrom?: string;
  repealDate?: string;
  expirationDate?: string;
  legalStatusDate?: string;

  // Status i dostępność tekstów
  type?: string;
  status?: string;
  inForce?: string;
  textPDF?: boolean;
  textHTML?: boolean;

  // Informacje dodatkowe
  comments?: string;
  releasedBy?: string[];
  authorizedBody?: string[];
  obligated?: string[];
  keywords?: string[];
  keywordsNames?: string[];
  previousTitle?: string[];

  // Dokumenty i powiązania
  directives?: LegalActDirective[];
  texts?: LegalActText[];
  prints?: LegalActPrint[];
  references?: Partial<Record<string, LegalActReference[]>>;
};
export type LegalActsTable = {
  ELI: string; /** Identyfikator ELI. */
  address: string; /** Identyfikator w systemie ISAP. */
  publisher: string; /** Symbol wydawnictwa. */
  year: number; /** Rok wydania. */
  volume: number; /** Numer zeszytu. */
  pos: number; /** Pozycja aktu w roku. */
  title: string; /** Tytuł aktu. */
  displayAddress: string; /** Adres do wyświetlenia. */
  promulgation: string; /** Data ogłoszenia. */
  announcementDate: string; /** Data wydania. */
  textPDF: string; /** Link do PDF. */
  textHTML: string; /** Link do HTML. */
  textDetails: string;
  changeDate: string; /** Data ostatniej zmiany. */
  type: string; /** Typ aktu, np. ustawa. */
  status: string; /** Status obowiązywania. */

}[];
export type TypesLegalAct = string[];

export const httpStatusCodes = [
  { code: 200, status: "OK", description: "Zwrócono poprawnie dane" },
  { code: 400, status: "Bad Request", description: "Przesłano błędne żądanie" },
  { code: 404, status: "Not Found", description: "Nie znaleziono zasobu" },
]

export const typesLegalActs = {
  oswiadczenie: "Oświadczenie",
  umowaZbiorowa: "Umowa zbiorowa",
  lista: "Lista",
  konwencja: "Konwencja",
  komunikat: "Komunikat",
  uklad: "Układ",
  oredzie: "Orędzie",
  zalecenie: "Zalecenie",
  dokumentWypowiedzenia: "Dokument wypowiedzenia",
  umowa: "Umowa",
  wykaz: "Wykaz",
  oswiadczenieRzadowe: "Oświadczenie rządowe",
  statut: "Statut",
  ustawa: "Ustawa",
  raport: "Raport",
  apel: "Apel",
  sprostowanie: "Sprostowanie",
  pismoOkolne: "Pismo okólne",
  okolnik: "Okólnik",
  porozumienie: "Porozumienie",
  obwieszczenie: "Obwieszczenie",
  reskrypt: "Reskrypt",
  przepisy: "Przepisy",
  dekret: "Dekret",
  traktat: "Traktat",
  rozkaz: "Rozkaz",
  instrukcja: "Instrukcja",
  sprawozdanie: "Sprawozdanie",
  opinia: "Opinia",
  umowaMiedzynarodowa: "Umowa międzynarodowa",
  wyjasnienie: "Wyjaśnienie",
  wytyczne: "Wytyczne",
  decyzja: "Decyzja",
  wypis: "Wypis",
  stanowisko: "Stanowisko",
  przepisyWykonawcze: "Przepisy wykonawcze",
  rezolucja: "Rezolucja",
  rozporzadzenie: "Rozporządzenie",
  karta: "Karta",
  zawiadomienie: "Zawiadomienie",
  akt: "Akt",
  uchwala: "Uchwała",
  orzeczenie: "Orzeczenie",
  ogloszenie: "Ogłoszenie",
  deklaracja: "Deklaracja",
  regulamin: "Regulamin",
  protokol: "Protokół",
  zarzadzenie: "Zarządzenie",
  informacja: "Informacja",
  postanowienie: "Postanowienie",
  interpretacja: "Interpretacja",
} as const;

export const temp = {
  "list_statuses": "https://api.sejm.gov.pl/eli/statuses",
  "list_reference_types": "https://api.sejm.gov.pl/eli/references",
  "list_document_types": "https://api.sejm.gov.pl/eli/types",
  "list_keywords": "https://api.sejm.gov.pl/eli/keywords",
  "list_institutions": "https://api.sejm.gov.pl/eli/institutions",
  "list_publishers": "https://api.sejm.gov.pl/eli/acts",
  "list_years": "https://api.sejm.gov.pl/eli/acts/{publisher}",
  "list_acts": "https://api.sejm.gov.pl/eli/acts/{publisher}/{year}",
  "act_details": "https://api.sejm.gov.pl/eli/acts/{publisher}/{year}/{position}",
  "act_pdf": "https://api.sejm.gov.pl/eli/acts/{publisher}/{year}/{position}/text.pdf",
  "act_html": "https://api.sejm.gov.pl/eli/acts/{publisher}/{year}/{position}/text.html",
  "act_references": "https://api.sejm.gov.pl/eli/acts/{publisher}/{year}/{position}/references",
  "search": "https://api.sejm.gov.pl/eli/acts/search",
  "list_changed_acts": "https://api.sejm.gov.pl/eli/changes/acts?since={date}&limit={limit}&offset={offset}"
};

export const searchParamsPrawoORuchuDrogowymTJ = {
  [queryParametersSearchTitle.title.text]: "jednolitego tekstu ustawy - Prawo o ruchu drogowym",
  [queryParametersSearchTitle.type.text]: typesLegalActs.obwieszczenie,
  [queryParametersSearchTitle.limit.text]: "1",
  [queryParametersSearchTitle.inForce.text]: "1",
  [queryParametersSearchTitle.sortBy.text]: "promulgation",
  [queryParametersSearchTitle.sortDir.text]: "desc"
}

export const searchParamsPrawoORuchuDrogowymPoTJ = {
  [queryParametersSearchTitle.title.text]: "prawo o ruchu drogowym",
  [queryParametersSearchTitle.limit.text]: "100",
  [queryParametersSearchTitle.inForce.text]: "1",
  [queryParametersSearchTitle.sortBy.text]: "promulgation",
  [queryParametersSearchTitle.sortDir.text]: "desc"
}

//PoRD
export const searchParamsLawsActsConfig = [
  searchParamsPrawoORuchuDrogowymTJ,
  searchParamsPrawoORuchuDrogowymPoTJ,
];



export const searchParamsObwieszczenieTrwalaUtrata = {
  [queryParametersSearchTitle.title.text]: "w sprawie wysokości stawek opłat za korzystanie ze środowiska na rok",
  [queryParametersSearchTitle.dateFrom.text]: "2023-01-01",
  [queryParametersSearchTitle.limit.text]: "10",
}








