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
    default: "House & Office Cleaning Auckland | PureSweep",
    template: "%s | Auckland House Cleaning | PureSweep"
  },
  description: "Auckland's premium house cleaning and office cleaning service. Refined residential, commercial, deep, and carpet cleaning.",
  metadataBase: new URL("https://puresweep.co.nz"),

  manifest: "/site.webmanifest",
  openGraph: {
    title: "House & Office Cleaning Auckland | PureSweep",
    description: "Auckland's premium house cleaning and office cleaning service. Refined residential, commercial, deep, and carpet cleaning.",
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
    title: "House & Office Cleaning Auckland | PureSweep",
    description: "Auckland's premium house cleaning and office cleaning service.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${manrope.variable} ${GeistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
