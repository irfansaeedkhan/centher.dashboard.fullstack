import type { AppProps } from "next/app";
import { useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Web3ReactProvider } from "@web3-react/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RootState, wrapper } from "@/store";
import { getLibrary } from "@/web3";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore<RootState>();

  return (
    <PersistGate loading={null} persistor={store.__persistor}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ToastContainer theme="colored" autoClose={5000} />
        <Component {...pageProps} />
      </Web3ReactProvider>
    </PersistGate>
  );
}

export default wrapper.withRedux(MyApp);
