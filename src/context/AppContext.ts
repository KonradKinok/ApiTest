import { createContext } from "react";
import type { typesLegalActs } from "../pages/ApiLegalRegulationPolishPage/apiPolishRegulationData";

export type AppContextValue = {
  typesLegalActs: typeof typesLegalActs;
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);
