import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure output file tracing includes Prisma client files for Vercel deployment
  outputFileTracingIncludes: {
    '/api/**': ['./app/generated/client/**/*'],
  },
};

export default nextConfig;
