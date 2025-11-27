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
  turbopack: {
    rules: {
      '*.glsl': {
        loaders: ['raw-loader'],
      },
      '*.vs': {
        loaders: ['raw-loader'],
      },
      '*.fs': {
        loaders: ['raw-loader'],
      },
      '*.vert': {
        loaders: ['raw-loader'],
      },
      '*.frag': {
        loaders: ['raw-loader'],
      },
    }
  },
  webpack: (config, { isServer, dev }) => {
    // Don't externalize Three.js in development or client-side
    if (isServer && !dev) {
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

    // Optimize Three.js for production
    if (!dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'three/examples/jsm': 'three/examples/jsm'
      };
    }

    return config;
  }
};

export default nextConfig;
