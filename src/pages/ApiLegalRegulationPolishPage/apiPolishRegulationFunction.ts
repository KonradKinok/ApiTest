import axios, { type AxiosResponse } from "axios";
import { polishActApiUrls, queryParametersSearchTitle, type LegalActDetails, type LegalActReference, type LegalActsResponseSearchTitle, type LegalActsTable, type TypesLegalAct } from "./apiPolishRegulationData"
// const apiClientEli = axios.create({
//   baseURL: "https://eli.gov.pl/eli/",
//   timeout: 10_000,
//   headers: {
//     Accept: "application/json",
//   },
//   responseType: "json",
// });

export const apiClientSejm = axios.create({
  baseURL: "https://api.sejm.gov.pl/eli/",
  timeout: 10_000,
  headers: {
    Accept: "application/json",
  },
  responseType: "json",
});

//search Params
export const searchParams = new URLSearchParams({
  [queryParametersSearchTitle.title.text]: "w sprawie wysokości stawek opłat za korzystanie ze środowiska na rok",
  [queryParametersSearchTitle.dateFrom.text]: "2023-01-01",
  [queryParametersSearchTitle.limit.text]: "20",
});

export const searchParamsPrawoORuchuDrogowymPoTJ = {
  [queryParametersSearchTitle.title.text]: "prawo o ruchu drogowym",
  [queryParametersSearchTitle.limit.text]: "100",
  [queryParametersSearchTitle.inForce.text]: "1",
  [queryParametersSearchTitle.sortBy.text]: "promulgation",
  [queryParametersSearchTitle.sortDir.text]: "desc"
}



export async function getDzUBySearchParams(
  searchParams: URLSearchParams,
  signal?: AbortSignal
): Promise<LegalActsResponseSearchTitle> {
  const response = await apiClientSejm.get<LegalActsResponseSearchTitle>(
    `acts/search?${searchParams}`,
    { signal }
  );

  return response.data;
}

export async function getTypesLegalAct(): Promise<AxiosResponse<TypesLegalAct>> {
  const response: AxiosResponse<TypesLegalAct> = await apiClientSejm.get(`types`);
  return response;
}
export async function getFirstDzUPoRD(): Promise<LegalActDetails> {
  const response = await apiClientSejm.get("acts/DU/1997/602");
  return response.data;
}

export async function getFirstDzU(idDzU: string, signal?: AbortSignal): Promise<LegalActDetails> {
  const response = await apiClientSejm.get<LegalActDetails>(
    `acts/${idDzU}`,
    { signal }
  );
  return response.data;

}


export const nameDzuTable = {
  PoRD: { idDzU: "DU/1997/602", paramsSearchTitleText: "prawo o ruchu drogowym" },
  RozRejestracjaPojazdow: { idDzU: "DU/2024/1709", paramsSearchTitleText: "rejestracji i oznaczania pojazdów, wymagań dla tablic rejestracyjnych oraz wzorów innych dokumentów związanych z rejestracją pojazdów" },
};


export const gettedDzUTable = [

];

export async function getDzUToTable(idDzU: string, paramsSearchTitleText: string, signal?: AbortSignal): Promise<LegalActsTable> {

  const dzUTable: LegalActsTable = [];

  //Sprawdzenie paramsSearchTitleText
  const title = paramsSearchTitleText.trim();
  if (!title) {
    throw new Error("Tytuł wyszukiwania nie może być pusty.");
  }

  const searchParamsPoTj = new URLSearchParams({
    [queryParametersSearchTitle.title.text]: title,
    [queryParametersSearchTitle.limit.text]: "100",
    [queryParametersSearchTitle.inForce.text]: "1",
    [queryParametersSearchTitle.sortBy.text]: "promulgation",
    [queryParametersSearchTitle.sortDir.text]: "desc"
  });


  //Pobranie tekstu podstawowego
  const startAct = await getFirstDzU(idDzU, signal);
  console.log("startAct:", startAct)
  //Wyszukanie id tekstu ujednoliconego
  // {
  //   "fileName": "D19970602Lj.pdf",
  //     "type": "U"
  // }
  const tekstUjednolicony = startAct.texts?.find(
    (text) => text.type === "U"
  )?.fileName;

  //Pobranie obiektu references z aktu podstawowego
  const references = startAct?.references;

  //Wyszukanie najnowszego id tekstu jednolitego
  const powiazaniaTJ =
    references?.["Inf. o tekście jednolitym"] ?? []; //{"id": "DU/2024/1251"},
  const tjId = latestTjId(powiazaniaTJ);

  let tjAct: LegalActDetails | undefined;

  //Pobranie tekstu jednolitego
  if (tjId) {
    tjAct = await getFirstDzU(tjId, signal);
  }
  const promulgation = tjAct?.promulgation || startAct.promulgation;

  if (!promulgation) {
    throw new Error("Brak daty publikacji potrzebnej do wyszukiwania aktów.");
  }
  //Ustawienie daty do wyszukiwania, od której należy szukać zmian w katach prawnych
  searchParamsPoTj.set(
    queryParametersSearchTitle.pubDateFrom.text,
    promulgation
  );

  //Pobranie aktów po dacie tekstu jednolitego, jeśli istnieje lub tekstu podstawowego.
  const afterTjActs = await getDzUBySearchParams(searchParamsPoTj, signal);

  //Ustawienie pierwszego aktu jako aktu jednolitego, jeśli istnieje lub tekstu podstawowego.
  const firstAct = tjAct ?? startAct;
  //Dodanie tekstu ujednoliconego do tablicy
  if (startAct && tekstUjednolicony) {
    dzUTable.push({
      ELI: startAct.ELI ?? "",
      address: startAct.address ?? "",
      announcementDate: startAct.announcementDate ?? "",
      publisher: startAct.publisher ?? "",
      year: startAct.year ?? 0,
      volume: startAct.volume ?? 0,
      pos: startAct.pos ?? 0,
      title: startAct.title ? `(tekst ujednolicony) ${startAct.title}` : "",
      displayAddress: startAct.displayAddress ?? "",
      promulgation: startAct.promulgation ?? "",
      textPDF: startAct.ELI ? polishActApiUrls.unifiedPdf(startAct.ELI, tekstUjednolicony) : "",
      textHTML: startAct.textHTML && startAct.ELI ? polishActApiUrls.html(startAct.ELI) : "",
      textDetails: "",
      changeDate: startAct.changeDate ?? "",
      type: startAct.type ?? "",
      status: startAct.status ?? "",
    });
  }

  if (afterTjActs) {
    console.log("Po tekście jednolitym: ", afterTjActs);
    for (const item of afterTjActs.items) {
      dzUTable.push({
        ELI: item.ELI ?? "",
        address: item.address ?? "",
        announcementDate: item.announcementDate ?? "",
        publisher: item.publisher ?? "",
        year: item.year ?? 0,
        volume: item.volume ?? 0,
        pos: item.pos ?? 0,
        title: item.title ?? "",
        displayAddress: item.displayAddress ?? "",
        promulgation: item.promulgation ?? "",
        textPDF: item.textPDF && item.ELI ? polishActApiUrls.pdf(item.ELI) : "",
        textHTML: item.textHTML && item.ELI ? polishActApiUrls.html(item.ELI) : "",
        textDetails: item.address ? polishActApiUrls.details(item.address) : "",
        changeDate: item.changeDate ?? "",
        type: item.type ?? "",
        status: item.status ?? "",
      });
    }
  }

  if (firstAct) {
    dzUTable.push({
      ELI: firstAct.ELI ?? "",
      address: firstAct.address ?? "",
      announcementDate: firstAct.announcementDate ?? "",
      publisher: firstAct.publisher ?? "",
      year: firstAct.year ?? 0,
      volume: firstAct.volume ?? 0,
      pos: firstAct.pos ?? 0,
      title: firstAct.title ?? "",
      displayAddress: firstAct.displayAddress ?? "",
      promulgation: firstAct.promulgation ?? "",
      textPDF: firstAct.textPDF && firstAct.ELI ? polishActApiUrls.pdf(firstAct.ELI) : "",
      textHTML: firstAct.textHTML && firstAct.ELI ? polishActApiUrls.html(firstAct.ELI) : "",
      textDetails: firstAct.address ? polishActApiUrls.details(firstAct.address) : "",
      changeDate: firstAct.changeDate ?? "",
      type: firstAct.type ?? "",
      status: firstAct.status ?? "",
    });
  }

  return dzUTable;
}

function latestTjId(powiazaniaTJ: LegalActReference[]) {
  const latestTjId = powiazaniaTJ.reduce<
    { id: string; year: number; position: number } | undefined
  >((latest, { id }) => {
    const match = /^DU\/(\d{4})\/(\d+)$/.exec(id ?? "");

    if (!match) return latest;

    const year = Number(match[1]);
    const position = Number(match[2]);

    if (
      !latest ||
      year > latest.year ||
      (year === latest.year && position > latest.position)
    ) {
      return { id: id!, year, position };
    }

    return latest; //"DU/2024/1251"
  }, undefined);

  return latestTjId?.id;
}
// Pobiera akty w pętli
// const obwieszczenia = await Promise.all(
//   powiazaniaTJ.map(async ({ id }) => {
//     const response = await apiClientSejm.get(`acts / ${ id }`);
//     return response.data;
//   })
// );
