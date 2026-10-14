import { Suspense } from "react";
import { Outlet } from "react-router";
import { Tooltip } from "react-tooltip";
import { Toaster } from "react-hot-toast";
import { Loader } from "../../components/CustomControls/Loader/Loader.tsx";
import { ButtonUp } from "../../components/CustomControls/ButtonUp/ButtonUp.tsx";
import { Navigation } from "../../components/Navigation/Navigation.tsx";
import { Footer } from "../../components/Footer/Footer.tsx";
import styles from "./LayoutPage.module.scss";

export function LayoutPage() {
  return (
    <div className={styles.site}>
      <header className={styles.siteHeader}>
        <Navigation />
      </header>

      <div className={`${styles.pageContainer} `}>
        <main id="main-content" tabIndex={-1} className={styles.mainContent}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <Footer />
      <ButtonUp />
      <Tooltip
        id="app-tooltip"
        className={styles.tooltip}
        border="1px solid var(--color-border)"
      />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "var(--color-toaster-background)",
            color: "var(--color-toaster-text)",
            border: "1px solid var(--color-toaster-border)",
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: "var(--color-toaster-success)",
              secondary: "var(--color-toaster-secondary)",
            },
          },
          error: {
            duration: 6000,
            iconTheme: {
              primary: "var(--color-toaster-error)",
              secondary: "var(--color-toaster-secondary)",
            },
          },
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: "var(--color-toaster-info)",
              secondary: "var(--color-toaster-secondary)",
            },
          },
        }}
      />
    </div>
  );
}
