/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  // Off: React 18 Strict Mode double-invokes effects in dev, which trips up
  // third-party DOM-manipulating libraries (Swiper carousels) into a stale
  // double-mount state. kgk-group-final disables it for the same reason.
  reactStrictMode: false,

  // Static export -> just upload the generated "out" folder to the server.
  // No Node/terminal needed on the server at all.
  output: 'export',
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
