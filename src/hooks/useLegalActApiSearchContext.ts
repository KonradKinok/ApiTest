import { useCallback, useRef, useState } from "react";
import { isAxiosError } from "axios";
import type { LegalActsTable } from "../pages/ApiLegalRegulationPolishPage/apiPolishRegulationData";
import { getDzUToTable } from "../pages/ApiLegalRegulationPolishPage/apiPolishRegulationFunction";
import { httpStatusCodes } from "../pages/ApiLegalRegulationPolishPage/apiPolishRegulationData";
import { useLocalStorage } from "./useLocalStorage";

type LegalActCache = {
  date: string;
  data: LegalActsTable;
};

function getToday(): string {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

// Podstawowe sprawdzenie struktury odczytanej z localStorage.
function isLegalActCache(value: unknown): value is LegalActCache {
  return (
    typeof value === "object" &&
    value !== null &&
    "date" in value &&
    typeof value.date === "string" &&
    "data" in value &&
    Array.isArray(value.data)
  );
}

export function useLegalActApiSearchContext(
  idDzU: string,
  paramsSearchTitleText: string,
  signal?: AbortSignal,
) {
  // Uwzględnienie obu parametrów zapobiega użyciu danych
  // pobranych dla innego wyszukiwania.
  const storageKey = `legalAct:v1:${JSON.stringify([
    idDzU,
    paramsSearchTitleText,
  ])}`;

  const [storedValue, setStoredValue] = useLocalStorage<unknown>(
    null,
    storageKey,
  );

  const cache = isLegalActCache(storedValue)
    ? storedValue
    : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inProgress = useRef(false);

  const getData = useCallback(async (
    force = false,
  ): Promise<void> => {
    if (signal?.aborted || inProgress.current) return;
    if (!force && cache?.date === getToday()) {
      setError(null);
      return;
    }

    inProgress.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await getDzUToTable(
        idDzU,
        paramsSearchTitleText,
        signal,
      );

      if (signal?.aborted) return;

      // Data jest zapisywana dopiero po udanym pobraniu.
      setStoredValue({
        date: getToday(),
        data: result,
      } satisfies LegalActCache);
    } catch (err) {
      if (signal?.aborted) return;

      const status = isAxiosError(err)
        ? err.response?.status
        : undefined;

      const errorText =
        status !== undefined
          ? getTextError(status)
          : err instanceof Error
            ? err.message
            : "Nieznany błąd";

      setError(errorText);
    } finally {
      inProgress.current = false;
      setLoading(false);
    }
  }, [
    cache,
    idDzU,
    paramsSearchTitleText,
    signal,
    setStoredValue,
  ]);

  return {
    data: cache?.data ?? null,
    loading,
    error,
    getData,
  };
}

function getTextError(status: number): string {
  const statusInfo = httpStatusCodes.find(
    (item) => item.code === status,
  );

  return statusInfo
    ? `[${statusInfo.code} ${statusInfo.status}]: ${statusInfo.description}`
    : `[${status}]: Nieznany błąd`;
}