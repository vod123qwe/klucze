import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/klucze',
  assetPrefix: '/klucze',
};

export default nextConfig;
