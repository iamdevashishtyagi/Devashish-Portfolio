"use client";

import { profile } from "@/src/app/data/profile";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal py-8">
      <div className="container-narrow px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {year} {profile.name}. Built with Next.js & GSAP.
          </p>

          <div className="flex items-center gap-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cream transition-colors"
            >
              <FaGithub className="w-4 h-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cream transition-colors"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="text-gray-400 hover:text-cream transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
