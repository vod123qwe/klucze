import type { NextConfig } from "next";

const basePath = '/klucze'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  // Zwykłe <img> i linki do plików z public/ nie dostają basePath automatycznie
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
