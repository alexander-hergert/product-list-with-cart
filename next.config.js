/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["images.ctfassets.net", "img.clerk.com", "res.cloudinary.com"],
  },
};

module.exports = nextConfig;
