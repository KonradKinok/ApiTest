import { Calculator } from "lucide-react";
import { ButtonUniversal } from "../../components/CustomControls/ButtonUniversal/ButtonUniversal";
import { FieldsetCustom } from "../../components/CustomControls/FieldsetCustom/FieldsetCustom";
import styles from "./ApiLegalRegulationPolishPage.module.scss";
import { useEffect, useState, type SubmitEvent } from "react";
import { displayErrorMessage } from "../../globalFunctions/globalFunctions";
import { getDzU, getTypesLegalAct } from "./apiPolishRegulationFunction";
import type { AxiosResponse } from "axios";
import type {
  LegalActsResponseSearchTitle,
  TypesLegalAct,
} from "./apiPolishRegulationData";
import { useTypesLegalActConfig } from "../../hooks/useTypesLegalActConfig";
import { useAppContext } from "../../hooks/useAppContext";
import { useTypesLegalActSearch } from "../../hooks/useTypesLegalActSearch";

export default function ApiLegalRegulationPolishPage() {
  const { typesLegalActs } = useAppContext();
  const [, setTypesLegalAct] = useState<string[]>([]);
  const [axiosAnswer, setAxiosAnswer] =
    useState<AxiosResponse<TypesLegalAct>>();
  const [obwieszczenie, setObwieszczenie] =
    useState<LegalActsResponseSearchTitle>();

  const { data, loading, error, getData } = useTypesLegalActConfig();
  const {
    data: dataActTrwalaUtrata,
    loading: loadingActTrwalaUtrata,
    error: errorActTrwalaUtrata,
    getData: getDataActTrwalaUtrata,
  } = useTypesLegalActSearch();

  const displayTekstBoolean =
    !errorActTrwalaUtrata &&
    !loadingActTrwalaUtrata &&
    dataActTrwalaUtrata &&
    dataActTrwalaUtrata.totalCount > 0 &&
    dataActTrwalaUtrata.items.length > 0;

  useEffect(() => {
    void getData();
  }, [getData]);

  useEffect(() => {
    void getDataActTrwalaUtrata();
  }, [getDataActTrwalaUtrata]);

  const handleSubmitTypesLegalActs = async (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const response = await getTypesLegalAct();
      setTypesLegalAct(response.data);
      setAxiosAnswer(response);
    } catch (error) {
      displayErrorMessage(
        "ApiLegalRegulationPolishPage",
        "handleSubmitFirstForm",
        error,
      );
    }
  };

  const handleSubmitObwieszczenieTrwalaUtrata = async (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const response = await getDzU();
      setObwieszczenie(response);
    } catch (error) {
      displayErrorMessage(
        "ApiLegalRegulationPolishPage",
        "handleSubmitSecondForm",
        error,
      );
    }
  };
  return (
    <section className={styles.mainContainer}>
      <form className={styles.form} onSubmit={handleSubmitTypesLegalActs}>
        <FieldsetCustom legend="Typy aktów prawnych - konfiguracja">
          {loading && <p>Pobieranie typów aktów prawnych…</p>}
          {error && <p role="alert">{error}</p>}
          {data && <p>Typy aktów prawnych: {data.join(", ")}</p>}
          <p>{Object.values(typesLegalActs).join(", ")}</p>
          {/* {loading ? (
            <p>Pobieranie typów aktów prawnych…</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : data ? (
            <p>Typy aktów prawnych: {data.join(", ")}</p>
          ) : null} */}
          <pre className={styles.preJson}>
            Wynik: {JSON.stringify(axiosAnswer, null, 2)}{" "}
          </pre>
          <ButtonUniversal
            className={styles.submitButton}
            type="submit"
            icon={<Calculator />}
            fullWidth
          >
            Pokaż dane
          </ButtonUniversal>
        </FieldsetCustom>
      </form>
      <form
        className={styles.form}
        onSubmit={handleSubmitObwieszczenieTrwalaUtrata}
      >
        <FieldsetCustom legend="Oblicz termin administracyjny">
          {displayTekstBoolean &&
            dataActTrwalaUtrata.items.map((item) => {
              return (
                <div>
                  <p>{`${item.title} (${item.displayAddress})`}</p>
                  <p>{item.ELI}</p>
                  <p>{item.announcementDate}</p>
                  <p>
                    Link{" "}
                    <a
                      href={`https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=${item.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LINK
                    </a>
                  </p>
                  <p>
                    Link ELI{" "}
                    <a
                      href={`https://eli.gov.pl/eli/${item.ELI}/ogl`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LINK
                    </a>
                  </p>
                  <p>
                    Link Sejm PDF{" "}
                    <a
                      href={`https://api.sejm.gov.pl/eli/acts/${item.ELI}/text.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LINK
                    </a>
                  </p>
                </div>
              );
            })}
          <pre className={styles.preJson}>
            Wynik: {JSON.stringify(obwieszczenie, null, 2)}{" "}
          </pre>
          <ButtonUniversal
            className={styles.submitButton}
            type="submit"
            icon={<Calculator />}
            fullWidth
          >
            Obwieszczenie
          </ButtonUniversal>
        </FieldsetCustom>
      </form>
    </section>
  );
}
