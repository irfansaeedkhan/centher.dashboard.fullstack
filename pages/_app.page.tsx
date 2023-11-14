import { NextPage } from "next";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { Web3ReactProvider } from "@web3-react/core";
import { Toaster } from "react-hot-toast";

// App Imports
import { RefreshContextProvider } from "@/web3/context/refresh.context";
import { getLibrary } from "@/web3";
// import { useCreateSocketIOConnection } from "@/socket.io";
import ScriptTags from "@/components/script.tags";
import { CookiesConstentModal } from "@/components/modal/cookies-consent.modal";
import "@/styles/globals.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Create a socket.io connection
  // useCreateSocketIOConnection();
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <ScriptTags />
      <CookiesConstentModal />

      <NextNProgress
        color="linear-gradient(270.23deg, #5691ff -9.34%, #72f6d1 17.09%, #76e268 48.54%, #ffd505 78.11%, #ff5e52 107.63%)"
        options={{
          showSpinner: false,
        }}
      />
      <RefreshContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              // Define default options
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },

              // Default options for specific types
              success: {
                duration: 3000,
              },
            }}
          />
          {getLayout(<Component {...pageProps} />)}
        </Web3ReactProvider>
      </RefreshContextProvider>
    </>
  );
}

export default MyApp;
