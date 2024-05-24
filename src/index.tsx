import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import GlobalStateProvider from "./contexts/Global";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <GlobalStateProvider>
    <App />
  </GlobalStateProvider>
);
