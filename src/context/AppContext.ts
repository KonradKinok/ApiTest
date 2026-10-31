import { createContext } from "react";
import type { LegalActsTable, typesLegalActs } from "../pages/ApiLegalRegulationPolishPage/apiPolishRegulationData";

export type AppContextValue = {
  typesLegalActs: typeof typesLegalActs;

  refreshPoRD: () => Promise<void>;
  dataPoRD: LegalActsTable;
  loadingPoRD: boolean;
  errorPoRD: string | null;

  refreshRejestracja: () => Promise<void>;
  dataRejestracja: LegalActsTable;
  loadingRejestracja: boolean;
  errorRejestracja: string | null;



};

export const AppContext = createContext<AppContextValue | undefined>(undefined);
