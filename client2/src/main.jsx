import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/geist";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "./features/theme/ThemeProvider";
import AuthInitializer from "./app/providers/AuthInitializer";
import AppToaster from "./components/shared/Toaster";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthInitializer>
          <App />
        </AuthInitializer>
        <AppToaster />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
