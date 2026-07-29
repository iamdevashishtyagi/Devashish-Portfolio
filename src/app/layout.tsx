import type { Metadata } from "next";
import { Geist, Geist_Mono, MedievalSharp  } from "next/font/google";
import ScrollBackground from "./components/layout/ScrollBackground";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://iamdevashishtyagi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Devashish Tyagi | Full Stack Developer",
  description:
    "Devashish Tyagi is a Full Stack Developer in India with 1.5+ years of experience building production web applications, backend systems, and AI-powered products.",
  applicationName: "Devashish Tyagi Portfolio",
  authors: [{ name: "Devashish Tyagi", url: siteUrl }],
  creator: "Devashish Tyagi",
  publisher: "Devashish Tyagi",
  keywords: [
    "Devashish Tyagi",
    "Devashish Tyagi developer",
    "Full Stack Developer India",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "Web Developer Portfolio",
    "AI Developer India",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Devashish Tyagi Portfolio",
    title: "Devashish Tyagi | Full Stack Developer",
    description: "Full Stack Developer building production web applications, backend systems, and AI-powered products.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devashish Tyagi | Full Stack Developer",
    description: "Full Stack Developer building production web applications, backend systems, and AI-powered products.",
  },
  robots: { index: true, follow: true },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const medievalSharp = MedievalSharp({
  variable: "--font-medieval-sharp",
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${medievalSharp.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col transition-colors duration-700">
        {/* <ScrollBackground /> */}
        {children}
      </body>
    </html>
  );
}
