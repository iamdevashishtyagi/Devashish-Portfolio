"use client";

import { useEffect, useState } from "react";
import { profile } from "@/src/app/data/profile";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    // Listen for real-time updates broadcast by visit tracker
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === "number") {
        setVisitCount(customEvent.detail);
      }
    };
    window.addEventListener("portfolio_visit_updated", handleUpdate);

    // Initial fetch
    fetch("/api/visits")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.count === "number") {
          setVisitCount(data.count);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener("portfolio_visit_updated", handleUpdate);
  }, []);

  return (
    <footer className="bg-black border-t border-neutral-900 py-8">
      <div className="container-narrow px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <p className="text-sm text-slate-400">
              © {year} {profile.name}. All rights reserved.
            </p>
            {visitCount !== null && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-medium text-slate-400 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{visitCount.toLocaleString()} visits</span>
              </span>
            )}
          </div>

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
