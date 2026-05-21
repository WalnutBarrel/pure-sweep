import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "PureSweep Cleaning | Premium Cleaning Services in Auckland",
    template: "%s | PureSweep Cleaning"
  },
  description: "Refined residential, commercial, deep, carpet, and move-in/move-out cleaning services in Auckland, New Zealand. Experience an immaculate, bespoke cleaning service.",
  metadataBase: new URL("https://puresweep.co.nz"),
  alternates: {
    canonical: "/",
  },

  manifest: "/site.webmanifest",
  openGraph: {
    title: "PureSweep Cleaning | Premium Cleaning Services in Auckland",
    description: "Refined residential, commercial, deep, carpet, and move-in/move-out cleaning services in Auckland, New Zealand.",
    locale: "en_NZ",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "PureSweep Cleaning Auckland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PureSweep Cleaning | Premium Cleaning Services in Auckland",
    description: "Refined residential, commercial, deep, carpet, and move-in/move-out cleaning services in Auckland, New Zealand.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${manrope.variable} ${GeistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
