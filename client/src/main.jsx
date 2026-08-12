import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource-variable/geist";

import { Provider } from "react-redux";

import { store } from "./app/store";

import App from "./App";

import "./index.css";

import { ThemeProvider } from "./components/theme/ThemeProvider";
import AuthInitializer from "./components/common/AuthInitializer";
import AppToaster from "./components/common/Toaster";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthInitializer>
          <App />
          <AppToaster />
        </AuthInitializer>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
