import type { Metadata } from "next";
import { Inter, Markazi_Text, Shadows_Into_Light, Caveat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import ErrorBoundary from "@/components/ErrorBoundary";

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
  title: "Fair Shoppe",
  description: "Your one-stop shop for thrift and custom items",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
