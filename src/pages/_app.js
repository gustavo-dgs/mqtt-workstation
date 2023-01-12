import "../styles/globals.css";
import { Provider } from "react-redux";
import { ReactFlowProvider } from "reactflow";
import store from "../store";

export default function App({ Component, pageProps }) {
  return (
    <ReactFlowProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ReactFlowProvider>
  );
}
