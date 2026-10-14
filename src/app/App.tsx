import { lazy } from "react";
import { Route, Routes } from "react-router";
import { LayoutPage } from "../pages/LayoutPage/LayoutPage";
//HomePage
const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const ApiLegalRegulationPolishPage = lazy(
  () =>
    import("../pages/ApiLegalRegulationPolishPage/ApiLegalRegulationPolishPage"),
);
//OtherPages
// const NotFoundPage = lazy(() => import("../pages/NotFoundPage/NotFoundPage"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutPage />}>
        <Route index element={<HomePage />} />
        <Route path={"api-legal-regulation-polish-page"}>
          <Route index element={<ApiLegalRegulationPolishPage />} />
          {/* <Route path="dokumenty" element={<DocumentsPage />} /> */}
        </Route>

        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Route>
    </Routes>
  );
}
