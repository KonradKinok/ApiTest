import { useEffect } from "react";
import { FieldsetCustom } from "../../components/CustomControls/FieldsetCustom/FieldsetCustom";
import { useTypesLegalActSearch } from "../../hooks/useTypesLegalActSearch";
import {
  queryParametersSearchTitle,
  searchParamsLawsActsConfig,
  type LegalActsResponseSearchTitle,
} from "../ApiLegalRegulationPolishPage/apiPolishRegulationData";
import styles from "./DisplayLegalActs.module.scss";

type LegalAct = LegalActsResponseSearchTitle["items"][number];

function LegalActDetails({ act }: { act: LegalAct }) {
  return (
    <article>
      <p>
        {act.title} ({act.displayAddress})
      </p>
      <p>Data publikacji: {act.promulgation}</p>

      <p>
        <a
          href={`https://eli.gov.pl/eli/${act.ELI}/ogl`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Strona aktu w ELI
        </a>
      </p>

      {act.textPDF && (
        <p>
          <a
            href={`https://api.sejm.gov.pl/eli/acts/${act.ELI}/text.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Otwórz PDF
          </a>
        </p>
      )}
    </article>
  );
}

export default function DisplayLegalActs() {
  // Pierwsze wyszukiwanie: najnowszy tekst jednolity.
  const paramsTJ = new URLSearchParams(searchParamsLawsActsConfig[0]);

  const {
    data: dataTJ,
    loading: loadingTJ,
    error: errorTJ,
    getData: pobierzTJ,
  } = useTypesLegalActSearch(paramsTJ);

  const aktTJ = dataTJ?.items[0];
  const dataPublikacjiTJ = aktTJ?.promulgation;

  // Drugie wyszukiwanie: akty od daty publikacji tekstu jednolitego.
  const paramsPoTJ = new URLSearchParams(searchParamsLawsActsConfig[1]);

  if (dataPublikacjiTJ) {
    paramsPoTJ.set(
      queryParametersSearchTitle.pubDateFrom.text,
      dataPublikacjiTJ,
    );
  }

  const {
    data: dataPoTJ,
    loading: loadingPoTJ,
    error: errorPoTJ,
    getData: pobierzPoTJ,
  } = useTypesLegalActSearch(paramsPoTJ);

  useEffect(() => {
    void pobierzTJ();
  }, [pobierzTJ]);

  useEffect(() => {
    if (!dataPublikacjiTJ) return;

    void pobierzPoTJ();
  }, [dataPublikacjiTJ, pobierzPoTJ]);

  // Wyszukiwanie od daty publikacji może zwrócić również sam tekst
  // jednolity. Wykluczamy go na podstawie identyfikatora ELI.
  const pozostaleAkty =
    dataPoTJ?.items.filter((item) => item.ELI !== aktTJ?.ELI) ?? [];

  return (
    <section className={styles.mainContainer}>
      <div className={styles.form}>
        <FieldsetCustom legend="Prawo o ruchu drogowym — tekst jednolity">
          {loadingTJ && <p>Pobieranie tekstu jednolitego…</p>}
          {errorTJ && <p role="alert">{errorTJ}</p>}

          {!loadingTJ && !errorTJ && dataTJ && !aktTJ && (
            <p>Nie znaleziono tekstu jednolitego.</p>
          )}

          {!loadingTJ && !errorTJ && aktTJ && <LegalActDetails act={aktTJ} />}
        </FieldsetCustom>
      </div>

      <div className={styles.form}>
        <FieldsetCustom legend="Akty od daty publikacji tekstu jednolitego">
          {!dataPublikacjiTJ && <p>Oczekiwanie na tekst jednolity.</p>}

          {dataPublikacjiTJ && (
            <>
              <p>Wyszukiwanie od: {dataPublikacjiTJ}</p>

              {loadingPoTJ && <p>Pobieranie aktów…</p>}
              {errorPoTJ && <p role="alert">{errorPoTJ}</p>}

              {!loadingPoTJ && !errorPoTJ && dataPoTJ && (
                <>
                  {pozostaleAkty.length === 0 && (
                    <p>Nie znaleziono innych aktów.</p>
                  )}

                  {pozostaleAkty.map((item) => (
                    <LegalActDetails key={item.ELI} act={item} />
                  ))}

                  {dataPoTJ.totalCount > dataPoTJ.items.length && (
                    <p>
                      Wynik zawiera tylko część znalezionych aktów. Pozostałe
                      wymagają pobrania kolejnych stron.
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </FieldsetCustom>
      </div>
    </section>
  );
}
