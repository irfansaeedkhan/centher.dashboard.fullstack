import { useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { wrapper } from "@/store";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/web3";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }) {
  const store = useStore();

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
