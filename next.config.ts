import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    unoptimized: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizePackageImports: ['three']
  },
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      'three': 'three'
    });
    return config;
  }
};

export default nextConfig;
