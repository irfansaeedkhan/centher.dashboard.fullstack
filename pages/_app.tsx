import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { wrapper } from "@/store";
import { getLibrary } from "@/web3";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ToastContainer theme="colored" autoClose={5000} />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // Define default options
          className: "",
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default wrapper.withRedux(MyApp);
