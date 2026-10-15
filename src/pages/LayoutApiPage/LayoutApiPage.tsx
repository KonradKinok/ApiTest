import { Suspense } from "react";
import { Outlet } from "react-router";
import { Loader } from "../../components/CustomControls/Loader/Loader.tsx";
import { NavigationApi } from "../../components/NavigationApi/NavigationApi.tsx";
import styles from "./LayoutApiPage.module.scss";

export function LayoutApiPage() {
  return (
    <div className={styles.site}>
      <header className={styles.siteHeader}>
        <NavigationApi />
      </header>

      <div className={`${styles.pageContainer} `}>
        <main id="main-content" tabIndex={-1} className={styles.mainContent}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
