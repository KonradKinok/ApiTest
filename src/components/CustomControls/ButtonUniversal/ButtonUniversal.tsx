import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import styles from "./ButtonUniversal.module.scss";

export type ButtonUniversalVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";
export type ButtonUniversalSize = "small" | "medium" | "large";

export interface ButtonUniversalProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon: ReactNode;
  iconPosition?: "start" | "end";
  variant?: ButtonUniversalVariant;
  size?: ButtonUniversalSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: ReactNode;
}

export const ButtonUniversal = forwardRef<
  HTMLButtonElement,
  ButtonUniversalProps
>(function ButtonUniversal(
  {
    children,
    icon,
    iconPosition = "end",
    variant = "primary",
    size = "medium",
    fullWidth = false,
    isLoading = false,
    loadingText = "Proszę czekać…",
    className = "",
    disabled = false,
    type = "button",
    ...buttonProps
  },
  ref,
) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    isLoading ? styles.loading : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const displayedIcon = isLoading ? (
    <LoaderCircle className={styles.spinner} />
  ) : (
    icon
  );

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={classNames}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      <span className={styles.content}>
        {iconPosition === "start" && (
          <span className={styles.icon} aria-hidden="true">
            {displayedIcon}
          </span>
        )}

        <span className={styles.label}>
          {isLoading ? loadingText : children}
        </span>

        {iconPosition === "end" && (
          <span className={styles.icon} aria-hidden="true">
            {displayedIcon}
          </span>
        )}
      </span>
    </button>
  );
});
