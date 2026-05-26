import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Analytics } from "@/components/ui/Analytics";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | Klarify`,
  },
  description:
    "A practical guide for founders, institutions, and innovators navigating blockchain, fintech, digital assets, and compliance across African regulated markets.",
  keywords: [
    "African fintech regulation",
    "blockchain compliance Africa",
    "digital asset regulation Nigeria",
    "ARIP framework",
    "startup compliance Africa",
    "Klarify",
    "regulated markets Africa",
    "regulatory readiness",
    "trust infrastructure",
    "fintech compliance",
  ],
  authors: [{ name: "Chimezie Chuta" }],
  creator: "Klarify",
  publisher: "Klarify",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Klarify",
    title: SITE_NAME,
    description:
      "The strategic framework for building trust-ready products in African regulated markets. Register for the virtual launch.",
    images: [
      {
        url: "/images/mockup-book.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Building in regulated markets starts here. A guide for founders navigating African fintech and blockchain compliance.",
    images: ["/images/mockup-book.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
