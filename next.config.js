/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  // Off: React 18 Strict Mode double-invokes effects in dev, which trips up
  // third-party DOM-manipulating libraries (Swiper carousels) into a stale
  // double-mount state. kgk-group-final disables it for the same reason.
  reactStrictMode: false,

  // Keep the deployable static bundle for shared hosting.
  output: 'export',
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
