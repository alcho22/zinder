/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Mock mode previews images via blob: URLs; allow remote URLs your backend returns.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // When your backend is ready you can proxy API calls to avoid CORS in dev:
  // async rewrites() {
  //   return [{ source: '/api/:path*', destination: 'http://localhost:8000/:path*' }];
  // },
};

export default nextConfig;
