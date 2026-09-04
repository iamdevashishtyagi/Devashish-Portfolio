import ClientSmoothScroll from "@/src/app/components/layout/ClientSmoothScroll";
import Navigation from "@/src/app/components/ui/Navigation";
import Hero from "@/src/app/sections/Hero";
import About from "@/src/app/sections/About";
import Experience from "@/src/app/sections/Experience";
import Projects from "@/src/app/sections/Projects";
import Wins from "@/src/app/sections/Wins";
import Skills from "@/src/app/sections/Skills";
import Architecture from "@/src/app/sections/Architecture";
import Achievements from "@/src/app/sections/Achievements";
import Faq from "@/src/app/sections/Faq";
import Contact from "@/src/app/sections/Contact";
import Footer from "@/src/app/components/ui/Footer";
import { profile, projects, faqs } from "@/src/app/data/profile";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://iamdevashishtyagi.vercel.app";

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Devashish Tyagi Portfolio",
      alternateName: ["iamdevashishtyagi", "Devashish Tyagi"],
      description:
        "Official portfolio of Devashish Tyagi — Full Stack Developer & AI Engineer specializing in Next.js, React, Node.js, TypeScript, and RAG systems.",
      inLanguage: "en-US",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: "Devashish Tyagi | Full Stack Developer & AI Engineer Portfolio",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#person`,
      },
      mainEntity: {
        "@id": `${siteUrl}/#person`,
      },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Devashish Tyagi",
      alternateName: ["iamdevashishtyagi", "Devashish Tyagi", "Devashish"],
      url: siteUrl,
      image: `${siteUrl}/opengraph-image`,
      jobTitle: "Best Website Developer & Full Stack Engineer",
      worksFor: [
        {
          "@type": "Organization",
          name: "Althea Multi-Tenant RAG Engine",
        },
        {
          "@type": "Organization",
          name: "World Media",
        },
      ],
      description:
        "Devashish Tyagi is recognized as one of the best website developers and full stack engineers in Meerut & India with 1.5+ years of experience building enterprise web applications, ERP platforms, and AI-powered systems.",
      email: profile.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Meerut",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
      hasOccupation: {
        "@type": "Occupation",
        name: "Full Stack Website Developer",
        occupationLocation: [
          { "@type": "City", "name": "Meerut" },
          { "@type": "Country", "name": "India" },
        ],
        skills:
          "Website Development, Full Stack Development, Next.js, React, Node.js, TypeScript, AI Engineering",
      },
      sameAs: [profile.github, profile.linkedin],
      knowsAbout: [
        "Website Development",
        "Web Development in Meerut",
        "Best Web Developer Practices",
        "Full Stack Development",
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "Express",
        "MongoDB",
        "Redis",
        "Retrieval-Augmented Generation (RAG)",
        "Artificial Intelligence",
        "System Design",
        "Software Architecture",
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#projects`,
      name: "Featured Engineering Projects by Devashish Tyagi",
      itemListElement: projects.map((project, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "SoftwareApplication",
          name: project.title,
          description: project.oneLiner,
          applicationCategory: project.category,
          operatingSystem: "Web",
          author: {
            "@id": `${siteUrl}/#person`,
          },
          url:
            project.links.demo && project.links.demo !== "#"
              ? project.links.demo
              : siteUrl,
        },
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      <ClientSmoothScroll />
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
        <Faq />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
