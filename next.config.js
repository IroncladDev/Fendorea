/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.discordapp.com', "storage.googleapis.com", "gravatar.com"],
  },
}

module.exports = nextConfig
