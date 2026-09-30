"use client";

import { profile } from "@/src/app/data/profile";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-neutral-900 py-8">
      <div className="container-narrow px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {year} {profile.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href={profile.github}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label="Devashish Tyagi on GitHub"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              <FaGithub className="w-4 h-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label="Devashish Tyagi on LinkedIn"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email Devashish Tyagi"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
