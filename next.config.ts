import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Prevent Prisma from being externalized to ensure binaries are bundled
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Include Prisma binaries in the serverless function bundle
      config.externals = [...(config.externals || []), '_http_common'];
    }
    return config;
  },
  // Ensure output file tracing includes Prisma client files
  outputFileTracingIncludes: {
    '/api/**': ['./node_modules/.prisma/client/**/*'],
  },
};

export default nextConfig;


