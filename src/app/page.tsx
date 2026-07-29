"use client";

import { useLenis } from "@/src/app/lib/lenis";
import Navigation from "@/src/app/components/ui/Navigation";
import Hero from "@/src/app/sections/Hero";
import About from "@/src/app/sections/About";
import Experience from "@/src/app/sections/Experience";
import Projects from "@/src/app/sections/Projects";
import Wins from "@/src/app/sections/Wins";
import Skills from "@/src/app/sections/Skills";
import Architecture from "@/src/app/sections/Architecture";
import Achievements from "@/src/app/sections/Achievements";
import Contact from "@/src/app/sections/Contact";
import Footer from "@/src/app/components/ui/Footer";
import { profile } from "@/src/app/data/profile";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://devashish-portfolio.vercel.app";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  image: `${siteUrl}/opengraph-image`,
  jobTitle: profile.role,
  description: "Full Stack Developer with 1.5+ years of experience building production web applications, backend systems, and AI-powered products.",
  email: profile.email,
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB", "Web Development", "AI Engineering"],
};

export default function Home() {
  useLenis();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Navigation />
      <main>
        <div className="h-[420px]" aria-hidden="true" />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Wins />
        <Skills />
        <Architecture />
        <Achievements />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
