import Head from 'next/head';

const AdminHeader = ({title="Nether NFT Platform", description="Nether NFT Platform"})=>{
    return(
        <Head>
            <title>{title}</title>
            <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui"/>
            <meta name="description" content="Official Nether NFT Platform."/>
            <meta name="keywords" content="nether nft , nft market place , nethernft login, nether nft"/>
            <meta name="author" content="Nether NFT Platform."/>
            <meta name="robots" content="all,follow"/>
            <meta name="google" content="notranslate" />
            <meta name="theme-color" content="#000000"/>
            <meta name="msapplication-navbutton-color" content="#000000"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="#000000"/>
            <meta name="msapplication-TileColor" content="#000000"/>
            
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Nether NFT Platform" />
            <meta property="og:description" content="Nether NFT Platform" />
            <meta property="og:url" content="https://app.nethernft.io/" />
            <meta property="og:site_name" content="Uroboro Platform" />
            <meta property="og:image" content="https://app.nethernft.io/nethernft-logo-320x320.png" />
            <meta property="og:image:width" content="420" />
            <meta property="og:image:height" content="420" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:description" content="Nether NFT Platform" />
            <meta name="twitter:title" content="Nether NFT Platform" />
            <meta name="twitter:image" content="https://app.nethernft.io/nethernft-logo-420x420.png" />
            <meta name="google-site-verification" content="" />

            <link rel="apple-touch-icon" sizes="180x180" href="https://app.nethernft.io/nethernft-logo-320x320.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="https://app.nethernft.io/nethernft-logo-320x320.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="https://app.nethernft.io//nethernft-logo-320x320.png"/>
            <link rel="manifest" href="https://app.nethernft.io/manifest.json" />
            <link rel="mask-icon" href="https://app.nethernft.io/nethernft-logo-320x320.png" color="#b59a5a"></link>
        </Head>
    )
}

export default AdminHeader;