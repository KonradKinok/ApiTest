import axios, { type AxiosResponse } from "axios";
import { queryParametersSearchTitle, type LegalActDetails, type LegalActsResponseSearchTitle, type LegalActsTable, type TypesLegalAct } from "./apiPolishRegulationData"
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



export async function getDzUBySearchParams(searchParams: URLSearchParams): Promise<LegalActsResponseSearchTitle> {
  const response = await apiClientSejm.get(`acts/search?${searchParams}`);
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

export async function getFirstDzU(idDzU: string) {
  const response = await apiClientSejm.get<LegalActDetails>(`acts/${idDzU}`);
  return response.data;

}


export const nameDzu = [
  { PoRD: { startTekst: "", tuj: "" } },
];
export const gettedDzUTable = [

];

export async function getDzUToTable(idDzU: string, paramsSearchTitleText: string) {

  const dzUTable: LegalActsTable = [];
  const searchParamsPoTj = new URLSearchParams({
    [queryParametersSearchTitle.title.text]: paramsSearchTitleText,
    [queryParametersSearchTitle.limit.text]: "100",
    [queryParametersSearchTitle.inForce.text]: "1",
    [queryParametersSearchTitle.sortBy.text]: "promulgation",
    [queryParametersSearchTitle.sortDir.text]: "desc"
  });


  const startAct = await getFirstDzU(idDzU);
  const tekstUjednolicony = startAct.texts?.find(
    (text) => text.type === "U"
  )?.fileName;
  if (startAct.ELI && tekstUjednolicony) {
    console.log(
      "TEKST UJEDNOLICONY:",
      `https://api.sejm.gov.pl/eli/acts/${startAct.ELI}/text/U/${encodeURIComponent(tekstUjednolicony)}`,
      tekstUjednolicony
    );
  }
  const references = startAct?.references;
  const powiazaniaTJ =
    references?.["Inf. o tekście jednolitym"] ?? []; //{"id": "DU/2024/1251"},
  const tjId = powiazaniaTJ[0]?.id;

  //Dodanie pierwszego aktu do tablicy


  let tjAct, afterTjActs;
  if (tjId) {
    tjAct = await getFirstDzU(tjId);
    const promulgation = tjAct?.promulgation;
    if (promulgation) {
      searchParamsPoTj.set(
        queryParametersSearchTitle.pubDateFrom.text,
        promulgation,
      );
      afterTjActs = getDzUBySearchParams(searchParamsPoTj);
    }
  }

  const firstAct = tjId ? tjAct : startAct;

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
      textPDF: `https://api.sejm.gov.pl/eli/acts/${startAct.ELI}/text/U/${encodeURIComponent(tekstUjednolicony)}`,
      textHTML: startAct.textHTML ? `https://api.sejm.gov.pl/eli/acts/${startAct.ELI}/text.html` : "",
      textDetails: "",
      changeDate: startAct.changeDate ?? "",
      type: startAct.type ?? "",
      status: startAct.status ?? "",
    });
  }

  if (afterTjActs) {
    (await afterTjActs).items.map((item) => {
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
        textPDF: item.textPDF ? `https://api.sejm.gov.pl/eli/acts/${item.ELI}/text.pdf` : "",
        textHTML: item.textHTML ? `https://api.sejm.gov.pl/eli/acts/${item.ELI}/text.html` : "",
        textDetails: item.address ? `https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=${item.address}` : "",
        changeDate: item.changeDate ?? "",
        type: item.type ?? "",
        status: item.status ?? "",

      });
    })
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
      textPDF: firstAct.textPDF ? `https://api.sejm.gov.pl/eli/acts/${firstAct.ELI}/text.pdf` : "",
      textHTML: firstAct.textHTML ? `https://api.sejm.gov.pl/eli/acts/${firstAct.ELI}/text.html` : "",
      textDetails: firstAct.address ? `https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=${firstAct.address}` : "",
      changeDate: firstAct.changeDate ?? "",
      type: firstAct.type ?? "",
      status: firstAct.status ?? "",

    });
  }
  else {
    return []
  }

  return dzUTable;
}


// Pobiera akty w pętli
// const obwieszczenia = await Promise.all(
//   powiazaniaTJ.map(async ({ id }) => {
//     const response = await apiClientSejm.get(`acts / ${ id }`);
//     return response.data;
//   })
// );