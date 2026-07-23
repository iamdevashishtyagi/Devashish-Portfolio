// src/app/sections/Projects/ProjectArtifacts.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ProjectImage } from "@/src/app/data/profile";

interface ProjectArtifactsProps {
  images: ProjectImage[];
  accent: string;
}

export default function ProjectArtifacts({ images, accent }: ProjectArtifactsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!images.length) {
    return (
      <p className="text-sm text-current/40 italic">
        No captured artifacts for this system yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((image, i) => (
          <button
            key={image.src}
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-current/10 bg-current/5 text-left"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, 220px"
              className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
            />
            <span
              className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-mono tracking-wider uppercase rounded backdrop-blur-sm"
              style={{ backgroundColor: `${accent}26`, color: accent }}
            >
              EX-{String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={images[openIndex].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-black/40 rounded-2xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={images[openIndex].src}
                alt={images[openIndex].alt}
                fill
                sizes="100vw"
                className="object-contain bg-black/60"
              />
            </div>
            <div className="p-4 flex items-start justify-between gap-4">
              <p className="text-sm text-white/80">{images[openIndex].caption}</p>
              <button
                onClick={() => setOpenIndex(null)}
                aria-label="Close artifact"
                className="shrink-0 text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
