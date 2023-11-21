/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**.amazonaws.com",
      },
      {
        hostname: "**.notion.so",
      },
    ],
  },
};

export default nextConfig;
