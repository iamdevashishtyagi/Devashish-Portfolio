"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import { initScrollBackground } from "./lib/gsap";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    initScrollBackground();
  }, []);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col transition-colors duration-700">
        {children}
      </body>
    </html>
  );
}