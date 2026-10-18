import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./app/App.tsx";
import { AppProvider } from "./context/AppProvider.tsx";

import "./styles/global.scss";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Nie znaleziono elementu #root");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
