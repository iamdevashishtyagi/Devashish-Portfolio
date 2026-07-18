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

export default function Home() {
  useLenis();

  return (
    <>
      <Navigation />
      <main>
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