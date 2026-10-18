import type { ReactNode } from "react";
import { typesLegalActs } from "../pages/ApiLegalRegulationPolishPage/apiPolishRegulationData";
import { AppContext, type AppContextValue } from "./AppContext";

const contextValue: AppContextValue = { typesLegalActs };

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
