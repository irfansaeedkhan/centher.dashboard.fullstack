import React from "react";
import Head from "next/head";

const ScriptTags = () => {
  return (
    <>
      <Head>
        <title>Centher.io</title>

        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui"
        />

        <meta
          name="description"
          content="Centher.io is worlds best and reliable Web3 token and NFT Marketplace"
        />
        <meta name="keywords" content="Centher,Centher.io,login,sign up" />
        <meta name="author" content="Centher.io" />
        <meta name="robots" content="all,follow" />
        <meta name="google" content="notranslate" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Centher.io" />
        <meta
          property="og:description"
          content="Centher.io is worlds best and reliable Web3 token and NFT Marketplace"
        />
        <meta property="og:url" content="https://app.centher.io/" />
        <meta property="og:site_name" content="Centher.io" />
        <meta property="og:image" content="/images/centher.logo.png" />
        <meta property="og:image:width" content="420" />
        <meta property="og:image:height" content="420" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content="Centher.io is worlds best and reliable Web3 token and NFT Marketplace"
        />
        <meta name="twitter:title" content="Centher.io" />
        <meta name="twitter:image" content="/images/centher.logo.png" />

        {/* TODO: Shivam - Need google site verification content */}
        <meta name="google-site-verification" content="Will-Provide-later" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#141416"
        />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#141416" />
        <meta
          name="msapplication-config"
          content="/favicons/browserconfig.xml"
        />
        <meta name="theme-color" content="#141416" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
      </Head>
    </>
  );
};

export default ScriptTags;
