/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["d3", "d3-array", "d3-scale", "d3-shape", "d3-selection", "d3-transition", "d3-ease", "d3-interpolate", "d3-color", "internmap", "robust-predicates", "delaunator", "topojson-client"],
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
