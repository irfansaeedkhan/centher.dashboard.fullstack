import type { AppProps } from "next/app";
import "../styles/globals.css";

const t = {
  name: "pages/_app.tsx",
};

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
