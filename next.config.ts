import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Preserve extra detail in the three sponsorship photographs.
    qualities: [75, 90],
    remotePatterns: [
      // Supabase Storage public buckets (uploaded photos/logos).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
