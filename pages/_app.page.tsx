import { createContext } from "react";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import * as mediasoupClient from "mediasoup-client";

// App Imports
import { RefreshContextProvider } from "@/web3/context/refresh.context";
import ScriptTags from "@/components/script.tags";
import { CookiesConstentModal } from "@/components/modal/cookies-consent.modal";
import { Web3ModalProvider } from "@/web3/context/web3-modal";
import { GlobalModal } from "@/components/modal/global-modal/global-modal";
import { StreamProvider } from "@/hooks/stream/use.core";

import "@/styles/globals.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const StreamContext = createContext(null);

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Create a socket.io connection
  // useCreateSocketIOConnection();
  const getLayout = Component.getLayout || ((page) => page);

  const deviceInstance = new mediasoupClient.Device();

  return (
    <>
      <ScriptTags />
      <CookiesConstentModal />

      <NextNProgress
        color="linear-gradient(270.23deg, #5691ff -9.34%, #72f6d1 17.09%, #21BF7F 48.54%, #ffd505 78.11%, #ff5e52 107.63%)"
        options={{
          showSpinner: false,
        }}
      />
      <StreamProvider deviceInstance={deviceInstance}>
        <RefreshContextProvider>
          <GlobalModal>
            <Web3ModalProvider>
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
            </Web3ModalProvider>
          </GlobalModal>
        </RefreshContextProvider>
      </StreamProvider>
    </>
  );
}

export default MyApp;
