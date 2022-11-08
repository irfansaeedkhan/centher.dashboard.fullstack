import { NextPage } from "next";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { Web3ReactProvider } from "@web3-react/core";
import { Toaster } from "react-hot-toast";
import Moralis from "moralis";

// App Imports
import { RefreshContextProvider } from "@/web3/context/refresh.context";
import { ChainInfoContextProvider } from "@/web3/context/chain.info.context";
import { getLibrary } from "@/web3";
import { useCreateSocketIOConnection } from "@/socket.io";
import ScriptTags from "@/components/script.tags";
import "@/styles/globals.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Create a socket.io connection
  useCreateSocketIOConnection();
  
  Moralis.start({
    apiKey: process.env.NEXT_PUBLIC_MORALIS_URL,
    // ...and any other configuration
  });

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <NextNProgress
        color="#FEBF32"
        options={{
          showSpinner: false,
        }}
      />
      <ScriptTags />
      <RefreshContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ChainInfoContextProvider>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                // Define default options
                className: "",
                duration: 5000,
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
            {getLayout(<Component {...pageProps} />)}
          </ChainInfoContextProvider>
        </Web3ReactProvider>
      </RefreshContextProvider>
    </>
  );
}

export default MyApp;
