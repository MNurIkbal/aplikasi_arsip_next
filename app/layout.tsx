import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Roboto_Slab } from "next/font/google";

export const metadata: Metadata = {
  title: "Aplikasi Arsip",
  description: "Aplikasi Arsip dengan Next.js, Prisma, dan MySQL",
};

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto-slab", // Variabel CSS
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en">
      <body className={`${robotoSlab.variable} antialiased font-serif`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
