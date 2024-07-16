import React from "react";
import Head from "next/head";
import Script from "next/script";

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
          content="369x.io is worlds best and reliable Web3 token and NFT Marketplace"
        />
        <meta name="keywords" content="369x,369x.io,login,sign up" />
        <meta name="author" content="369x.io" />
        <meta name="robots" content="all,follow" />
        <meta name="google" content="notranslate" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="369x.io" />
        <meta
          property="og:description"
          content="369x.io is worlds best and reliable Web3 token and NFT Marketplace"
        />
        <meta property="og:url" content="https://app.centher.io/" />
        <meta property="og:site_name" content="Centher.io" />
        <meta
          property="og:image"
          itemProp="image"
          content="/images/369x.logo.bg.550.420.png"
        />
        <meta property="og:image:width" content="550" />
        <meta property="og:image:height" content="420" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content="369x.io is worlds best and reliable Web3 token and NFT Marketplace"
        />
        <meta name="twitter:title" content="Centher.io" />
        <meta name="twitter:image" content="/images/369x.logo.bg.550.420.png" />

        {/* TODO: Shivam - Need google site verification content */}
        <meta
          name="google-site-verification"
          content="cmqFPwe-1bs7Dscw6QxvdWPAQ52MuaUV2RrfhE17oo8"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon-180x180-new.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32-new.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16-new.png"
        />
        <link
          rel="mask-icon"
          href="/favicons/maskable-icon.png"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicons/favicon-new.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicons/browserconfig-new.xml"
        />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/favicons/site-new.webmanifest" />
      </Head>

      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){
            dataLayer.push(arguments);
          }
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'personalization_storage': 'denied',
            'functionality_storage': 'denied',
            'security_storage': 'denied',
          });
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
        `}
      </Script>
      {/* End Google Tag Manager */}
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>
      {/* End Google Tag Manager (noscript) */}
    </>
  );
};

export default ScriptTags;
