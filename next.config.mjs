/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.clerk.com' },
    ],
  },
  webpack: (config) => {
    // Needed for react-globe.gl / three.js
    config.externals = config.externals || [];
    return config;
  },
};

export default nextConfig;
