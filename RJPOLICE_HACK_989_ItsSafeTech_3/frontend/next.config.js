/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/recordings/:path*",
          destination: "/recordings/:path*",
        },
      ];
    },

    // next.config.js
    pageExtensions: ['jsx', 'js', 'ts', 'tsx'], // Add your file extensions
    // Other configurations...
  
  };
  
  module.exports = nextConfig;
  