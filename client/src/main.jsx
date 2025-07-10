import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import { App } from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="top-center" expand={true} richColors />
    <App />
  </StrictMode>
);
