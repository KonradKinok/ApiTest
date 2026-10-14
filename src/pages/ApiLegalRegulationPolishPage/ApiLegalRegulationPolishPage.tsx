import { Calculator } from "lucide-react";
import { ButtonUniversal } from "../../components/CustomControls/ButtonUniversal/ButtonUniversal";
import { FieldsetCustom } from "../../components/CustomControls/FieldsetCustom/FieldsetCustom";
import styles from "./ApiLegalRegulationPolishPage.module.scss";
import { useState, type SubmitEvent } from "react";
import { displayErrorMessage } from "../../globalFunctions/globalFunctions";
import { getDzU, getTypesLegalAct } from "./apiPolishRegulationFunction";
import type { AxiosResponse } from "axios";
import type {
  LegalActsResponseSearchTitle,
  TypesLegalAct,
} from "./apiPolishRegulationData";

export default function ApiLegalRegulationPolishPage() {
  const [typesLegalAct, setTypesLegalAct] = useState<string[]>([]);
  const [axiosAnswer, setAxiosAnswer] =
    useState<AxiosResponse<TypesLegalAct>>();
  const [obwieszczenie, setObwieszczenie] =
    useState<LegalActsResponseSearchTitle>();
  const handleSubmitFirstForm = async (event: SubmitEvent<HTMLFormElement>) => {
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

  const handleSubmitSecondForm = async (
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
      <form className={styles.form} onSubmit={handleSubmitFirstForm}>
        <FieldsetCustom legend="Oblicz termin administracyjny">
          <pre className={styles.preJson}>
            Wynik: {JSON.stringify(typesLegalAct, null, 2)}{" "}
          </pre>
          <pre className={styles.preJson}>
            Wynik: {JSON.stringify(axiosAnswer, null, 2)}{" "}
          </pre>
          <ButtonUniversal
            className={styles.submitButton}
            type="submit"
            icon={<Calculator />}
            fullWidth
          >
            Oblicz termin
          </ButtonUniversal>
        </FieldsetCustom>
      </form>
      <form className={styles.form} onSubmit={handleSubmitSecondForm}>
        <FieldsetCustom legend="Oblicz termin administracyjny">
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
