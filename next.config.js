const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "ipfs.moralis.io",
      "devapi.centher.io",
      "devstatic.centher.io",
      "localhost",
      "centher-development.s3.eu-west-3.amazonaws.com",
      "devstatic.centher.io.s3.eu-west-3.amazonaws.com",
      "s3.eu-west-3.amazonaws.com",
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
