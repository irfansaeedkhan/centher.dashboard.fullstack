import Head from "next/head";

const PublicHead = ({
  title = "Nether NFT Platform",
  description = "Nether NFT Platform",
  imagelink = "/images/nether.nft.favicon.svg",
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui"
      />
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="nether nft , nft market place , nethernft login, nether nft"
      />
      <meta name="author" content="Nether NFT Platform." />
      <meta name="robots" content="all,follow" />
      <meta name="google" content="notranslate" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-navbutton-color" content="#000000" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://app.nethernft.io/" />
      <meta property="og:site_name" content="Nether Platform" />
      <meta property="og:image" content={imagelink} />
      <meta property="og:image:width" content="320" />
      <meta property="og:image:height" content="320" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={imagelink} />
      <meta name="google-site-verification" content="" />

      <link rel="apple-touch-icon" sizes="180x180" href={imagelink} />
      <link rel="icon" type="image/png" sizes="32x32" href={imagelink} />
      <link rel="icon" type="image/png" sizes="16x16" href={imagelink} />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href={imagelink} color="#b59a5a"></link>
    </Head>
  );
};

export default PublicHead;
