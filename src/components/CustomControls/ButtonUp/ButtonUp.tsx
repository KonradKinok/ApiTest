import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { ChevronsUp } from "lucide-react";
import styles from "./ButtonUp.module.scss";

export function ButtonUp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = debounce(() => {
      setIsVisible(window.scrollY > 600);
    }, 100);

    // Ustaw poprawny stan od razu po zamontowaniu komponentu
    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, []);

  const handleOnClick = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      className={`${styles.upButton} ${isVisible ? styles.visible : ""}`} // Zmienia klasę na visible
      type="button"
      onClick={handleOnClick}
      aria-label="Przewiń na górę strony"
    >
      <ChevronsUp />
    </button>
  );
}
