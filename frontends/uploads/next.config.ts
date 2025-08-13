import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['image.tmdb.org', 'www.gravatar.com', 'localhost'],
  },
  reactStrictMode: false,
};

export default nextConfig;
