import type { FieldsetHTMLAttributes, ReactNode } from "react";
import styles from "./FieldsetCustom.module.scss";

interface FieldsetCustomProps
  extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend: ReactNode;
  children: ReactNode;
}

export function FieldsetCustom({
  legend,
  children,
  className,
  ...fieldsetProps
}: FieldsetCustomProps) {
  const fieldsetClassName = [styles.fieldset, className]
    .filter(Boolean)
    .join(" ");

  return (
    <fieldset
      className={fieldsetClassName}
      {...fieldsetProps}
    >
      <legend className={styles.legend}>{legend}</legend>
      {children}
    </fieldset>
  );
}
