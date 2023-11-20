/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  compiler: {
    removeConsole: true,
  },
}

module.exports = nextConfig
