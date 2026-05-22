import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://portfolio-kaptaincs3.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mbi Enow Leonard Appelgryn — Software Engineer",
    template: "%s | Leonard Appelgryn",
  },
  description:
    "Portfolio of Mbi Enow Leonard Appelgryn, a full-stack software engineer specializing in Next.js, React, and TypeScript. Featuring projects in travel tech, secure systems, and enterprise architecture.",
  keywords: [
    "software engineer",
    "full-stack developer",
    "frontend engineer",
    "Next.js",
    "React",
    "TypeScript",
    "React Native",
    "Expo",
    "PostgreSQL",
    "Prisma",
    "AWS",
    "Redis",
    "Zustand",
    "web developer",
    "mobile developer",
    "Cameroon",
    "Douala",
    "Buea",
    "remote developer",
    "Central Africa",
    "API design",
    "system architecture",
    "cloud computing",
    "fintech",
    "travel tech",
    "edtech",
    "portfolio",
    "Leonard Appelgryn",
    "KaptainCS3",
  ],
  authors: [{ name: "Mbi Enow Leonard Appelgryn", url: SITE_URL }],
  creator: "Leonard Appelgryn",
  publisher: "Leonard Appelgryn",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "KaptainCS3 Portfolio",
    title: "Mbi Enow Leonard Appelgryn — Software Engineer",
    description:
      "Full-stack software engineer building with Next.js, React, and TypeScript. Explore projects, skills, and experience.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mbi Enow Leonard Appelgryn — Software Engineer",
    description:
      "Full-stack software engineer building with Next.js, React, and TypeScript.",
    creator: "@KaptainCS3",
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-hidden">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
