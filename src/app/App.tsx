import { lazy } from "react";
import { Route, Routes } from "react-router";
import { LayoutPage } from "../pages/LayoutPage/LayoutPage";
import { LayoutApiPage } from "../pages/LayoutApiPage/LayoutApiPage";
//HomePage
const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const ApiLegalRegulationPolishPage = lazy(
  () =>
    import("../pages/ApiLegalRegulationPolishPage/ApiLegalRegulationPolishPage"),
);
const DisplayLegalActs = lazy(
  () => import("../pages/DisplayLegalActs/DisplayLegalActs"),
);
//OtherPages
// const NotFoundPage = lazy(() => import("../pages/NotFoundPage/NotFoundPage"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutPage />}>
        <Route index element={<HomePage />} />
        <Route element={<LayoutApiPage />}>
          <Route
            path="api-legal-regulation-polish-page"
            element={<ApiLegalRegulationPolishPage />}
          />
          <Route
            path="display-legal-regulation-polish-page"
            element={<DisplayLegalActs />}
          />
        </Route>

        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Route>
    </Routes>
  );
}
