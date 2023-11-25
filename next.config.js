const baseUrl = new URL(
  process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: baseUrl.hostname,
      },
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
