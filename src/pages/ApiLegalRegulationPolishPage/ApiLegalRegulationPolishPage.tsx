import { Calculator } from "lucide-react";
import { ButtonUniversal } from "../../components/CustomControls/ButtonUniversal/ButtonUniversal";
import { FieldsetCustom } from "../../components/CustomControls/FieldsetCustom/FieldsetCustom";
import styles from "./ApiLegalRegulationPolishPage.module.scss";
import { useState, type SubmitEvent } from "react";
import { displayErrorMessage } from "../../globalFunctions/globalFunctions";
import {
  getDzUToTable,
  getFirstDzU,
  // getFirstDzU,
  getTypesLegalAct,
} from "./apiPolishRegulationFunction";
import type { AxiosResponse } from "axios";
import {
  searchParamsLawsActsConfig,
  type LegalActDetails,
  // type LegalActReference,
  type LegalActsResponseSearchTitle,
  type LegalActsTable,
  type TypesLegalAct,
} from "./apiPolishRegulationData";
import { useTypesLegalActConfig } from "../../hooks/useTypesLegalActConfig";
import { useAppContext } from "../../hooks/useAppContext";
import { useTypesLegalActSearch } from "../../hooks/useTypesLegalActSearch";
import ApiSingleLegalAct from "./ApiSingleLegalAct";

export default function ApiLegalRegulationPolishPage() {
  const { refreshPoRD, dataPoRD, loadingPoRD, errorPoRD } = useAppContext();
  const { dataRejestracja, loadingRejestracja, errorRejestracja } =
    useAppContext();
  const tempDisplay = false;
  const { typesLegalActs } = useAppContext();
  const [, setTypesLegalAct] = useState<string[]>([]);
  const [axiosAnswer, setAxiosAnswer] =
    useState<AxiosResponse<TypesLegalAct>>();
  const [obwieszczenie, setObwieszczenie] =
    useState<LegalActsResponseSearchTitle | null>();
  const [firstActPoRD, setFirstActPoRD] = useState<LegalActDetails | null>();
  const [firstAct, setFirstAct] = useState<LegalActsTable | []>([]);
  const searchParams = new URLSearchParams(searchParamsLawsActsConfig[1]);

  const { data, loading, error, getData } = useTypesLegalActConfig();
  const {
    data: dataAct,
    loading: loadingAct,
    error: errorAct,
    getData: getDataAct,
  } = useTypesLegalActSearch(searchParams);

  const displayTekstBoolean =
    !errorAct &&
    !loadingAct &&
    dataAct &&
    dataAct.totalCount > 0 &&
    dataAct.items.length > 0 &&
    false;

  // useEffect(() => {
  //   void getData();
  // }, [getData]);

  // useEffect(() => {
  //   void getDataAct();
  // }, [getDataAct]);

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
      setObwieszczenie(dataAct);
    } catch (error) {
      displayErrorMessage(
        "ApiLegalRegulationPolishPage",
        "handleSubmitSecondForm",
        error,
      );
    }
  };

  const handleSubmitFirstActPoRD = async (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const result = await getFirstDzU("DU/1997/602");
      setFirstActPoRD(result);
    } catch (error) {
      displayErrorMessage(
        "ApiLegalRegulationPolishPage",
        "handleSubmitFirstAct",
        error,
      );
    }
  };

  const handleSubmitFirstAct = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await getDzUToTable(
        "DU/1997/602",
        "prawo o ruchu drogowym",
      );
      setFirstAct(result);
    } catch (error) {
      displayErrorMessage(
        "ApiLegalRegulationPolishPage",
        "handleSubmitFirstAct",
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
            dataAct.items.map((item) => {
              return (
                <div key={item.ELI}>
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
          {tempDisplay &&
            searchParamsLawsActsConfig.map((item) => (
              <ApiSingleLegalAct
                key={new URLSearchParams(item).toString()}
                config={item}
              />
            ))}
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
      <form className={styles.form} onSubmit={handleSubmitFirstActPoRD}>
        <FieldsetCustom legend="Pierwszy akt prawny PoRD">
          {/* {searchParamsLawsActsConfig.map((item) => (
            <ApiSingleLegalAct
              key={new URLSearchParams(item).toString()}
              config={item}
            />
          ))} */}
          <pre className={styles.preJson}>
            Wynik FirstAct PoRD: {JSON.stringify(firstActPoRD, null, 2)}{" "}
          </pre>
          <ButtonUniversal
            className={styles.submitButton}
            type="submit"
            icon={<Calculator />}
            fullWidth
          >
            First Act
          </ButtonUniversal>
        </FieldsetCustom>
      </form>
      <form className={styles.form} onSubmit={handleSubmitFirstAct}>
        <FieldsetCustom legend="Pierwszy akt prawny">
          {/* {searchParamsLawsActsConfig.map((item) => (
            <ApiSingleLegalAct
              key={new URLSearchParams(item).toString()}
              config={item}
            />
          ))} */}
          {firstAct &&
            firstAct.map((item) => (
              <div key={item.ELI}>
                <p>ELI: {item.ELI}</p>
                <p>address: {item.address}</p>
                <p>announcementDate: {item.announcementDate}</p>
                <p>publisher: {item.publisher}</p>
                <p>year: {item.year}</p>
                <p>volume: {item.volume}</p>
                <p>pos: {item.pos}</p>
                <p>title: {item.title}</p>
                <p>displayAddress: {item.displayAddress}</p>
                <p>promulgation: {item.promulgation}</p>
                <p>
                  textPDF{" "}
                  <a
                    href={item.textPDF}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.textPDF}
                  </a>
                </p>
                <p>
                  textHTML{" "}
                  <a
                    href={item.textHTML}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.textHTML}
                  </a>
                </p>
                <p>
                  textDetails{" "}
                  <a
                    href={item.textDetails}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.textDetails}
                  </a>
                </p>
                <p>changeDate: {item.changeDate}</p>
                <p>type: {item.type}</p>
                <p>status: {item.status}</p>
              </div>
            ))}
          <pre className={styles.preJson}>
            Wynik FirstAct: {JSON.stringify(firstAct, null, 2)}{" "}
          </pre>
          <ButtonUniversal
            className={styles.submitButton}
            type="submit"
            icon={<Calculator />}
            fullWidth
          >
            First Act
          </ButtonUniversal>
        </FieldsetCustom>
      </form>
      <form className={styles.form} onSubmit={handleSubmitFirstAct}>
        <FieldsetCustom legend="Akty prawne z tablicy">
          {errorPoRD && <p>{errorPoRD}</p>}
          {dataPoRD &&
            dataPoRD.map((item) => (
              <div key={item.ELI}>
                <p>ELI: {item.ELI}</p>
                <p>address: {item.address}</p>
                <p>announcementDate: {item.announcementDate}</p>
                <p>publisher: {item.publisher}</p>
                <p>year: {item.year}</p>
                <p>volume: {item.volume}</p>
                <p>pos: {item.pos}</p>
                <p>title: {item.title}</p>
                <p>displayAddress: {item.displayAddress}</p>
                <p>promulgation: {item.promulgation}</p>

                <p>
                  textPDF{" "}
                  <a
                    href={item.textPDF}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.textPDF}
                  </a>
                </p>
                <p>
                  textHTML{" "}
                  <a
                    href={item.textHTML}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.textHTML}
                  </a>
                </p>
                <p>
                  textDetails{" "}
                  <a
                    href={item.textDetails}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.textDetails}
                  </a>
                </p>
                <p>changeDate: {item.changeDate}</p>
                <p>type: {item.type}</p>
                <p>status: {item.status}</p>
              </div>
            ))}
          <hr />
          {errorRejestracja && <p>{errorRejestracja}</p>}
          {dataRejestracja &&
            dataRejestracja.map((item) => (
              <div key={item.ELI}>
                <p>ELI: {item.ELI}</p>
                <p>address: {item.address}</p>
                <p>announcementDate: {item.announcementDate}</p>
                <p>publisher: {item.publisher}</p>
                <p>year: {item.year}</p>
                <p>volume: {item.volume}</p>
                <p>pos: {item.pos}</p>
                <p>title: {item.title}</p>
                <p>displayAddress: {item.displayAddress}</p>
                <p>promulgation: {item.promulgation}</p>

                <p>
                  textPDF{" "}
                  <a
                    href={item.textPDF}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.textPDF}
                  </a>
                </p>
                <p>
                  textHTML{" "}
                  <a
                    href={item.textHTML}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.textHTML}
                  </a>
                </p>
                <p>
                  textDetails{" "}
                  <a
                    href={item.textDetails}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.textDetails}
                  </a>
                </p>
                <p>changeDate: {item.changeDate}</p>
                <p>type: {item.type}</p>
                <p>status: {item.status}</p>
              </div>
            ))}
          <ButtonUniversal
            className={styles.submitButton}
            type="button"
            icon={<Calculator />}
            fullWidth
            isLoading={loadingPoRD}
            loadingText="Pobieranie…"
            onClick={() => void refreshPoRD()}
          >
            Odśwież PoRD
          </ButtonUniversal>
        </FieldsetCustom>
      </form>
    </section>
  );
}
