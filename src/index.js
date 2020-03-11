import React from "react";
import ReactDOM from "react-dom";
import { HotKeyProvider } from "./context/HotKeyContext";

import App from "./App";

/**
 * HotKeyProvider needs to wrap the components you'd like hot keys for.
 */

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <HotKeyProvider>
      <App />
    </HotKeyProvider>
  </React.StrictMode>,
  rootElement
);
