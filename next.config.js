/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["images.ctfassets.net"],
  },
};

module.exports = nextConfig;
