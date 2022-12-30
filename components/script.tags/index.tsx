import React from "react";
import Head from "next/head";

const ScriptTags = () => {
  return (
    <>
      <Head>
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

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="mask-icon" href="/favicon.ico" color="#B59A5A"></link>
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
    </>
  );
};

export default ScriptTags;
