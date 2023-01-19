import "../styles/globals.css";
import React from "react";
import { ReactFlowProvider } from "reactflow";
import { AppContextProvider } from "../hooks/contextHooks";

// import mqtt from "mqtt";

export default function App({ Component, pageProps }) {
  // useEffect(() => {
  //   const options = {
  //     port: 1884,
  //     host: "localhost",
  //     clean: true,
  //   };

  //   const client = mqtt.connect(options);
  //   client.on("connect", () => console.log("Device connected"));
  // });
  return (
    <AppContextProvider>
      <ReactFlowProvider>
        <Component {...pageProps} />
      </ReactFlowProvider>
    </AppContextProvider>
  );
}
