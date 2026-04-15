import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Roboto_Slab, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
      lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${robotoSlab.variable} antialiased font-serif`} suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
