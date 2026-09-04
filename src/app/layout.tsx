import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, MedievalSharp  } from "next/font/google";
import ScrollBackground from "./components/layout/ScrollBackground";
import "./globals.css";
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://iamdevashishtyagi.vercel.app";
const GoogleAuthClientID = process.env.Google_Auth_Client_ID;

export const viewport: Viewport = {
  themeColor: "#fbf8f2",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: {
    google: "rFYMNWoOZu9iSzbyet9es9-9J44P3zWxQT7vOtVDIw4",
  },
  title: {
    default: "Devashish Tyagi | Best Website Developer & Full Stack Engineer",
    template: "%s | Devashish Tyagi",
  },
  description:
    "Official portfolio of Devashish Tyagi (iamdevashishtyagi) — Top-rated website developer and full stack engineer in Meerut & India with 1.5+ years of experience building enterprise web applications, Next.js/React platforms, and AI-powered systems.",
  applicationName: "Devashish Tyagi Portfolio",
  authors: [{ name: "Devashish Tyagi", url: siteUrl }],
  creator: "Devashish Tyagi",
  publisher: "Devashish Tyagi",
  category: "technology",
  classification: "Software Engineering Portfolio",
  keywords: [
    "Devashish Tyagi",
    "iamdevashishtyagi",
    "Best website developer",
    "Best website developer in Meerut",
    "Web developer in Meerut",
    "Website Developer in Meerut",
    "Best developer",
    "Best full stack developer in India",
    "Website developer India",
    "Hire website developer",
    "Devashish Tyagi developer",
    "Devashish Tyagi portfolio",
    "Devashish Tyagi full stack developer",
    "Devashish Tyagi software engineer",
    "Devashish Tyagi AI engineer",
    "Full Stack Developer India",
    "Next.js Developer India",
    "React Developer",
    "Node.js Developer",
    "TypeScript Engineer",
    "RAG systems developer",
    "Enterprise ERP Engineer",
    "Web Developer Portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Devashish Tyagi Portfolio",
    title: "Devashish Tyagi | Best Website Developer & Full Stack Engineer",
    description:
      "Top-rated website developer and full stack engineer building production web applications, ERP platforms, and AI-powered systems.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devashish Tyagi | Full Stack Developer & AI Engineer",
    description:
      "Full Stack Developer and AI Engineer building production web applications, ERP platforms, and AI-powered RAG systems.",
    creator: "@iamdevashishtyagi",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${medievalSharp.variable} h-full antialiased`}>
      <Script 
      src="https://devsai-alpha.vercel.app/rag-chat-widget.js" 
      data-api-key={process.env.NEXT_PUBLIC_RAG_WIDGET_API_KEY} 
      data-api-url="https://rag-api-cb8d.onrender.com/api" 
      data-title="Portfolio assistant" 
      data-theme="light"
      data-user-data="true"
      data-auto-open="false"
      data-google-client-id={GoogleAuthClientID}
      strategy="afterInteractive"
      />
      <body className="min-h-full flex flex-col transition-colors duration-700">
        <ScrollBackground />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
