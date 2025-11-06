import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RoutesPage from "./routes.tsx";
import { BrowserRouter } from "react-router";
import "./index.css";
import Providers from "./providers/index.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Providers>
    <BrowserRouter>
      <RoutesPage />
    </BrowserRouter>
  </Providers>
  // </StrictMode>
);
