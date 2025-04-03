import type { Metadata } from "next";
import { Inter, Markazi_Text, Shadows_Into_Light, Caveat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });
const markazi = Markazi_Text({
  subsets: ["latin"],
  variable: "--font-markazi",
});
const shadows = Shadows_Into_Light({
  subsets: ["latin"],
  variable: "--font-shadows",
  weight: "400",
});
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "The Fair Shoppe",
  description: "Utilizing the power of creativity and technology to transform businesses and enrich lives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
 
      </head>
      <body className={`${inter.className} ${markazi.variable} ${shadows.variable} ${caveat.variable}`}>
        <Providers>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
