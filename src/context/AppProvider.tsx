import { useEffect, type ReactNode } from "react";
import { typesLegalActs } from "../pages/ApiLegalRegulationPolishPage/apiPolishRegulationData";
import { nameDzuTable } from "../pages/ApiLegalRegulationPolishPage/apiPolishRegulationFunction";
import { AppContext, type AppContextValue } from "./AppContext";
import { useLegalActApiSearchContext } from "../hooks/useLegalActApiSearchContext";

export function AppProvider({ children }: { children: ReactNode }) {
  const pordConfig = nameDzuTable.PoRD;
  const rejestracjaConfig = nameDzuTable.RozRejestracjaPojazdow;

  const {
    data: dataPoRD,
    loading: loadingPoRD,
    error: errorPoRD,
    getData: getDataPoRD,
  } = useLegalActApiSearchContext(
    pordConfig.idDzU,
    pordConfig.paramsSearchTitleText,
  );

  const {
    data: dataRejestracja,
    loading: loadingRejestracja,
    error: errorRejestracja,
    getData: getDataRejestracja,
  } = useLegalActApiSearchContext(
    rejestracjaConfig.idDzU,
    rejestracjaConfig.paramsSearchTitleText,
  );

  useEffect(() => {
    void getDataPoRD();
    void getDataRejestracja();
  }, [getDataPoRD, getDataRejestracja]);

  const contextValue: AppContextValue = {
    typesLegalActs,
    refreshPoRD: () => getDataPoRD(true),
    dataPoRD: dataPoRD ?? [],
    loadingPoRD,
    errorPoRD,
    dataRejestracja: dataRejestracja ?? [],
    loadingRejestracja,
    errorRejestracja,
    refreshRejestracja: () => getDataRejestracja(true),
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
