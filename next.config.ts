import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  i18n: {
    locales: ['en', 'fr', 'de','id'],
    defaultLocale: 'id',
  },
};

export default nextConfig;
