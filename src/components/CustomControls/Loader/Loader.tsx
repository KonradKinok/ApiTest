import { RotatingLines } from "react-loader-spinner";
import styles from "./Loader.module.scss";

export function Loader() {
  return (
    <div className={styles.containerLoader}>
      <RotatingLines
        visible
        width="96"
        strokeColor="var(--color-loader)"
        strokeWidth="5"
        ariaLabel="Ładowanie treści"
      />
    </div>
  );
}
