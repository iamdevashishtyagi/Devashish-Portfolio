// src/app/sections/Projects/ProjectArtifacts.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ProjectImage } from "@/src/app/data/profile";

interface ProjectArtifactsProps {
  images: ProjectImage[];
  accent: string;
}

export default function ProjectArtifacts({
  images,
  accent,
}: ProjectArtifactsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const closeModal = () => setOpenIndex(null);

  const showPrevious = () => {
    if (openIndex === null) return;

    setOpenIndex((openIndex - 1 + images.length) % images.length);
  };

  const showNext = () => {
    if (openIndex === null) return;

    setOpenIndex((openIndex + 1) % images.length);
  };

  useEffect(() => {
    if (openIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openIndex]);

  if (!images.length) {
    return (
      <p className="text-sm text-current/40 italic">
        No snapshots captured for this system yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Artifact Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, i) => (
          <button
            key={image.src}
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-current/10 bg-current/5 text-left"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, 220px"
              className="object-cover object-top opacity-90 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
            />

            <span
              className="absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider backdrop-blur-sm"
              style={{
                backgroundColor: `${accent}26`,
                color: accent,
              }}
            >
              EX-{String(i + 1).padStart(2, "0")}
            </span>

            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
              <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                View snapshot
              </span>
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={images[openIndex].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 backdrop-blur-md sm:p-4"
          onClick={closeModal}
        >
          <div
            className="relative flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-3 py-2 sm:px-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white/90">
                  {images[openIndex].caption}
                </p>

                <p className="mt-0.5 text-[10px] font-mono uppercase tracking-widest text-white/35">
                  EX-{String(openIndex + 1).padStart(2, "0")}{" "}
                  <span className="mx-1">/</span> {images.length}
                </p>
              </div>

              <button
                onClick={closeModal}
                aria-label="Close artifact"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white/60 transition-all hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Image */}
            <div className="relative flex items-center justify-center bg-black px-1 pb-1 sm:px-2 sm:pb-2">
              <div className="relative max-h-[82vh] w-full">
                <Image
                  src={images[openIndex].src}
                  alt={images[openIndex].alt}
                  width={1600}
                  height={1000}
                  priority
                  sizes="100vw"
                  className="block h-auto max-h-[82vh] w-full object-contain"
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={showPrevious}
                    aria-label="Previous artifact"
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-xl text-white/70 backdrop-blur-md transition-all hover:bg-black/80 hover:text-white"
                  >
                    ‹
                  </button>

                  <button
                    onClick={showNext}
                    aria-label="Next artifact"
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-xl text-white/70 backdrop-blur-md transition-all hover:bg-black/80 hover:text-white"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
