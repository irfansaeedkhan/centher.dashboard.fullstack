import React from "react";
import Script from "next/script";
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
          content="Official Nether-NFT Platform website."
        />
        <meta name="keywords" content="nethernft, login , sign up" />
        <meta name="author" content="Nether-NFT Platform." />
        <meta name="robots" content="all,follow" />
        <meta name="google" content="notranslate" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Nether-NFT Platform" />
        <meta property="og:description" content="Nether-NFT Platform" />
        <meta property="og:url" content="https://app.nethernft.io/" />
        <meta property="og:site_name" content="Nether-NFT  Platform" />
        <meta property="og:image" content="/images/nether.nft.logo.svg" />
        <meta property="og:image:width" content="420" />
        <meta property="og:image:height" content="420" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content="Uroboro Platform" />
        <meta name="twitter:title" content="Nether-NFT Platform" />
        <meta name="twitter:image" content="/images/nether.nft.logo.svg" />
        <meta name="google-site-verification" content="Will-Provide-later" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/favicon.ico" color="#B59A5A"></link>
      </Head>
      <Script src="https://unpkg.com/flowbite@1.5.3/dist/flowbite.js"></Script>
      <link
        rel="stylesheet"
        href="https://unpkg.com/flowbite@1.5.3/dist/flowbite.min.css"
      />
      <Script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/index.min.js"></Script>
    </>
  );
};

export default ScriptTags;
