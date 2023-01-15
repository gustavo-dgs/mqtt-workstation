import "../styles/globals.css";
import React from "react";
import { ReactFlowProvider } from "reactflow";
import { AppContextProvider } from "../hooks/contextHooks";

export default function App({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <ReactFlowProvider>
        <Component {...pageProps} />
      </ReactFlowProvider>
    </AppContextProvider>
  );
}
