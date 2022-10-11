import { NextPage } from "next";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { Web3ReactProvider } from "@web3-react/core";
import { Toaster } from "react-hot-toast";

// App Imports
import { wrapper } from "@/store";
import { getLibrary } from "@/web3";
import ScriptTags from "@/components/script.tags";
import "@/styles/globals.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
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
      <Web3ReactProvider getLibrary={getLibrary}>
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
      </Web3ReactProvider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
