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
      process.env.APP_ENV === "production"
        ? [
            "static.centher.io",
            "s3.eu-west-3.amazonaws.com",
            "centher.infura-ipfs.io",
          ]
        : [
            "localhost",
            "devapi.centher.io",
            "static.centher.io",
            "devstatic.centher.io",
            "s3.eu-west-3.amazonaws.com",
            "centher-development.s3.eu-west-3.amazonaws.com",
            "devstatic.centher.io.s3.eu-west-3.amazonaws.com",
            "centher-staging.infura-ipfs.io",
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
