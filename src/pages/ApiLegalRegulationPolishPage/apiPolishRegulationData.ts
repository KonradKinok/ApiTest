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

export type TypesLegalAct = string[];




















