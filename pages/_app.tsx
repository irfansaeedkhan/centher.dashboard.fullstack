import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { wrapper } from "@/store";
import { getLibrary } from "@/web3";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ToastContainer theme="colored" autoClose={5000} />
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default wrapper.withRedux(MyApp);
