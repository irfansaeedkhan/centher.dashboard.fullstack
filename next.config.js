const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains:
      process.env.NEXT_PUBLIC_APP_ENV === "production"
        ? [
            "centher.infura-ipfs.io",
            "api.centher.io",
            "static.centher.io",
            "static.centher.io.s3.eu-west-3.amazonaws.com",
            "s3.eu-west-3.amazonaws.com",
            "dapi.369x.io",
            "static.369x.io",
          ]
        : [
            "localhost",
            "devapi.centher.io",
            "playgroundapi.centher.io",
            "play-kubapi.centher.io",
            "stag-kubapi.centher.io",
            "static.centher.io",
            "devstatic.centher.io",
            "s3.eu-west-3.amazonaws.com",
            "centher-development.s3.eu-west-3.amazonaws.com",
            "devstatic.centher.io.s3.eu-west-3.amazonaws.com",
            "centher-staging.infura-ipfs.io",
            "upload.wikimedia.org",
          ],
  },
  pageExtensions: ["page.tsx", "page.ts", "api.ts"],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
