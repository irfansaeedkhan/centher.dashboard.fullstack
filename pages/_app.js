import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/web3";
import { persistor, store } from "@/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ToastContainer theme="colored" autoClose={5000} />
          <Component {...pageProps} />
        </Web3ReactProvider>
      </PersistGate>
    </Provider>
  );
}
