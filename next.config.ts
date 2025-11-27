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
    optimizePackageImports: ['three'],
    esmExternals: true
  },
  webpack: (config, { isServer }) => {
    // Only externalize on server-side to prevent SSR issues
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'three': 'three'
      });
    }
    
    // Ensure proper handling of Three.js modules
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });

    return config;
  }
};

export default nextConfig;
