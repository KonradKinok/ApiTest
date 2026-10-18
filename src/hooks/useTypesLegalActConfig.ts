import { useCallback, useRef, useState } from "react";
import { isAxiosError } from "axios";
import type { TypesLegalAct } from "../pages/ApiLegalRegulationPolishPage/apiPolishRegulationData";
import { apiClientSejm } from "../pages/ApiLegalRegulationPolishPage/apiPolishRegulationFunction";
import { httpStatusCodes } from "../pages/ApiLegalRegulationPolishPage/apiPolishRegulationData";

export function useTypesLegalActConfig() {
  const [data, setData] = useState<TypesLegalAct | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inProgress = useRef(false);
  const getData = useCallback(async (): Promise<void> => {
    if (inProgress.current) return;

    inProgress.current = true;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await apiClientSejm.get<TypesLegalAct>("types");
      setData(result.data);
    } catch (err) {
      const status = isAxiosError(err) ? err.response?.status : undefined;

      const errorText = status !== undefined
        ? getTextError(status)
        : err instanceof Error ? err.message : "Nieznany błąd";

      setError(errorText);

    } finally {
      inProgress.current = false;
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getData };
};

function getTextError(status: number): string {
  const statusInfo = httpStatusCodes.find(item => item.code === status);

  return statusInfo
    ? `[${statusInfo.code} ${statusInfo.status}]: ${statusInfo.description}`
    : `[${status}]: Nieznany błąd`;
}

