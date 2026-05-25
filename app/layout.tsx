import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { StructuredData } from "@/components/StructuredData"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

const SITE_URL = "https://kaptaincs3.dev"

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Mbi Enow Leonard Appelgryn — Full Stack Software Engineer",
        template: "%s | Leonard Appelgryn",
    },
    description:
        "Portfolio of Mbi Enow Leonard Appelgryn, a Full Stack Software Engineer specializing in Next.js, React, and TypeScript. Featuring projects in travel tech, secure systems, and enterprise architecture.",
    keywords: [
        "Full Stack Software Engineer",
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
        title: "Mbi Enow Leonard Appelgryn — Full Stack Software Engineer",
        description:
            "Full Stack Software Engineer building with Next.js, React, and TypeScript. Explore projects, skills, and experience.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mbi Enow Leonard Appelgryn — Full Stack Software Engineer",
        description:
            "Full Stack Software Engineer building with Next.js, React, and TypeScript.",
        creator: "@KaptainCS3",
    },
    alternates: {
        canonical: "/",
    },
    manifest: "/manifest.webmanifest",
    category: "technology",
    other: {
        "google-site-verification":
            "sRXjLJ6ktZ35u_3mS2EoirZbDMNGi_ZH_E1zxo6Clj8",
    },
    verification: {
        google: "sRXjLJ6ktZ35u_3mS2EoirZbDMNGi_ZH_E1zxo6Clj8",
        other: { "msvalidate.01": "93A28F7701C72141F5E0413ACBC96D69" },
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
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
    )
}
