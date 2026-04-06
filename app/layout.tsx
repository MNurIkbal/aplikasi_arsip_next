import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Aplikasi Arsip",
  description: "Aplikasi Arsip dengan Next.js, Prisma, dan MySQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en">
      <body>
        <Providers>{children}</Providers>

      </body>
    </html>
  );
}
