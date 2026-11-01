/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Placeholder transparent product PNGs, removed once studio assets land.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pngimg.com",
        pathname: "/uploads/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
