import axios, { type AxiosResponse } from "axios";
import { queryParametersSearchTitle, type LegalActsResponseSearchTitle, type TypesLegalAct } from "./apiPolishRegulationData"
// const apiClientEli = axios.create({
//   baseURL: "https://eli.gov.pl/eli/",
//   timeout: 10_000,
//   headers: {
//     Accept: "application/json",
//   },
//   responseType: "json",
// });

const apiClientSejm = axios.create({
  baseURL: "https://api.sejm.gov.pl/eli/",
  timeout: 10_000,
  headers: {
    Accept: "application/json",
  },
  responseType: "json",
});
const searchParams = new URLSearchParams({
  [queryParametersSearchTitle.title.text]: "w sprawie wysokości stawek opłat za korzystanie ze środowiska na rok",
  [queryParametersSearchTitle.dateFrom.text]: "2024-01-01",
  [queryParametersSearchTitle.limit.text]: "20",
});



export async function getDzU(): Promise<LegalActsResponseSearchTitle> {
  const response = await apiClientSejm.get(`acts/search?${searchParams}`);
  return response.data;
}

export async function getTypesLegalAct(): Promise<AxiosResponse<TypesLegalAct>> {
  const response: AxiosResponse<TypesLegalAct> = await apiClientSejm.get(`types`);
  return response;
}

