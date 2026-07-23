"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { Project } from "@/src/app/data/profile";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Pause,
  Play,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface ProjectShowcaseProps {
  projects: Project[];
}

type ProjectAccent = {
  color: string;
  glow: string;
  rgb: string;
};

const ACCENTS: Record<Project["accent"], ProjectAccent> = {
  blue: {
    color: "#60A5FA",
    glow: "rgba(96, 165, 250, 0.24)",
    rgb: "96, 165, 250",
  },
  violet: {
    color: "#A78BFA",
    glow: "rgba(167, 139, 250, 0.24)",
    rgb: "167, 139, 250",
  },
  amber: {
    color: "#FBBF24",
    glow: "rgba(251, 191, 36, 0.24)",
    rgb: "251, 191, 36",
  },
};

const getProjectPersonality = (project: Project) => {
  switch (project.filter) {
    case "enterprise":
      return {
        label: "STRUCTURED SYSTEM",
        description: "Dense data. Many moving parts. One operational surface.",
      };

    case "compliance":
      return {
        label: "PRECISION ENGINE",
        description: "Rules become deterministic systems.",
      };

    case "saas":
      return {
        label: "OPERATING PRODUCT",
        description: "Daily workflows reduced to useful decisions.",
      };

    case "ai":
      return {
        label: "INTELLIGENCE LAYER",
        description: "Knowledge becomes searchable, contextual, and useful.",
      };

    case "marketing":
      return {
        label: "DIGITAL PRESENCE",
        description: "Performance, structure, and perception working together.",
      };

    default:
      return {
        label: "ENGINEERING SYSTEM",
        description: "A problem translated into a working product.",
      };
  }
};

export default function ProjectShowcase({
  projects,
}: ProjectShowcaseProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const artifactRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactionTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const currentProject = projects[activeIndex];

  const currentAccent = useMemo(
    () => ACCENTS[currentProject.accent],
    [currentProject.accent]
  );

  const personality = useMemo(
    () => getProjectPersonality(currentProject),
    [currentProject]
  );

  const selectedImage =
    currentProject.images[selectedImageIndex] ?? currentProject.images[0];

  const nextIndex = (activeIndex + 1) % projects.length;

  const previousIndex =
    (activeIndex - 1 + projects.length) % projects.length;

  const goToProject = useCallback(
    (index: number, direction: 1 | -1 = 1) => {
      if (index === activeIndex || !projects[index]) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        setActiveIndex(index);
        setSelectedImageIndex(0);
        return;
      }

      const animatedElements = [
        artifactRef.current,
        detailRef.current,
      ].filter((element): element is HTMLDivElement => Boolean(element));

      if (!animatedElements.length) {
        setActiveIndex(index);
        setSelectedImageIndex(0);
        return;
      }

      gsap.killTweensOf(animatedElements);

      const timeline = gsap.timeline();

      timeline
        .to(animatedElements, {
          opacity: 0,
          x: direction * -30,
          duration: 0.22,
          ease: "power2.in",
          stagger: 0.025,
        })
        .add(() => {
          setActiveIndex(index);
          setSelectedImageIndex(0);
        })
        .set(animatedElements, {
          x: direction * 40,
        })
        .to(animatedElements, {
          opacity: 1,
          x: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.06,
        });
    },
    [activeIndex, projects]
  );

  const goNext = useCallback(() => {
    goToProject(nextIndex, 1);
  }, [goToProject, nextIndex]);

  const goPrevious = useCallback(() => {
    goToProject(previousIndex, -1);
  }, [goToProject, previousIndex]);

  const pauseAutoplayTemporarily = useCallback(() => {
    setIsInteracting(true);

    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }

    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
      interactionTimeoutRef.current = null;
    }, 5000);
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (
      isPaused ||
      isInteracting ||
      projects.length <= 1
    ) {
      return;
    }

    timerRef.current = setTimeout(() => {
      goNext();
    }, 9000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    activeIndex,
    isPaused,
    isInteracting,
    goNext,
    projects.length,
  ]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (event.key === "Escape") {
          setIsLightboxOpen(false);
        }

        if (event.key === "ArrowRight") {
          setSelectedImageIndex((index) =>
            Math.min(
              currentProject.images.length - 1,
              index + 1
            )
          );
        }

        if (event.key === "ArrowLeft") {
          setSelectedImageIndex((index) =>
            Math.max(0, index - 1)
          );
        }

        return;
      }

      if (event.key === "ArrowRight") {
        goNext();
      }

      if (event.key === "ArrowLeft") {
        goPrevious();
      }

      if (event.key === " ") {
        event.preventDefault();
        setIsPaused((value) => !value);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    currentProject.images.length,
    goNext,
    goPrevious,
    isLightboxOpen,
  ]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (window.innerWidth < 768) return;

      const rect = root.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(".project-depth-layer", {
        x: x * 10,
        y: y * 8,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
      });

      gsap.to(".project-artifact", {
        rotateY: x * 3,
        rotateX: y * -3,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const handlePointerLeave = () => {
      gsap.to(".project-depth-layer", {
        x: 0,
        y: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(".project-artifact", {
        rotateY: 0,
        rotateX: 0,
        duration: 1,
        ease: "power3.out",
      });
    };

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const handleImageInteractionStart = () => {
    setIsInteracting(true);
  };

  const handleImageInteractionEnd = () => {
    setIsInteracting(false);
  };

  return (
    <>
      <div
        ref={rootRef}
        className="relative"
        style={
          {
            "--project-accent": currentAccent.color,
            "--project-glow": currentAccent.glow,
            "--project-rgb": currentAccent.rgb,
          } as React.CSSProperties
        }
      >
        {/* Project atmosphere */}
        <div
          className="pointer-events-none absolute -inset-24 opacity-30 blur-3xl transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${currentAccent.glow}, transparent 55%)`,
          }}
        />

        {/* Archive header */}
        <div className="relative mb-8 flex items-center justify-between border-b border-current/10 pb-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.25em] text-current/35">
              PROJECT ARCHIVE
            </span>

            <span className="h-px w-8 bg-current/20" />

            <span
              className="font-mono text-[10px] tracking-[0.2em] transition-colors duration-700"
              style={{
                color: currentAccent.color,
              }}
            >
              {personality.label}
            </span>
          </div>

          <div className="font-mono text-xs text-current/35">
            <span className="text-current">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>

            <span className="mx-1">/</span>

            {String(projects.length).padStart(2, "0")}
          </div>
        </div>

        {/* Main exhibition canvas */}
        <div
          className="relative min-h-[680px] overflow-hidden rounded-[2rem] border border-current/10 bg-current/[0.025] p-4 md:p-8 lg:p-12"
          style={{
            background: `radial-gradient(circle at 35% 30%, rgba(${currentAccent.rgb}, 0.08), transparent 42%)`,
          }}
        >
          {/* Background project identity */}
          <div className="project-depth-layer pointer-events-none absolute inset-0">
            <div className="absolute -right-10 -top-16 select-none font-mono text-[clamp(10rem,28vw,26rem)] font-bold leading-none tracking-[-0.12em] text-current/[0.025]">
              {String(activeIndex + 1).padStart(2, "0")}
            </div>

            <div className="absolute bottom-8 left-8 max-w-[260px] font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-current/20">
              {personality.description}
            </div>
          </div>

          {/* Progress rail */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-current/10">
            <div
              className="h-full transition-all duration-700"
              style={{
                width: `${
                  ((activeIndex + 1) / projects.length) * 100
                }%`,
                backgroundColor: currentAccent.color,
              }}
            />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            {/* Visual evidence */}
            <div
              ref={artifactRef}
              className="project-artifact relative"
              style={{
                perspective: "1200px",
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-current/35">
                    Evidence /{" "}
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>

                  <p className="mt-2 text-sm text-current/45">
                    {currentProject.category}
                  </p>
                </div>

                <span className="font-mono text-[10px] text-current/25">
                  {currentProject.year}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                onPointerEnter={handleImageInteractionStart}
                onPointerLeave={handleImageInteractionEnd}
                className="group relative block w-full overflow-hidden rounded-2xl border border-current/10 bg-current/[0.04] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-current/60"
                aria-label={`Open ${selectedImage.alt} in fullscreen`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70" />

                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white/70 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70" />

                    System snapshot
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <p className="max-w-md text-sm leading-relaxed text-white/80">
                      {selectedImage.caption}
                    </p>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white/70 backdrop-blur-md transition-transform duration-500 group-hover:rotate-45">
                      <Maximize2 className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </button>

              {/* Evidence thumbnails */}
              {currentProject.images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {currentProject.images.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => {
                        setSelectedImageIndex(index);
                        pauseAutoplayTemporarily();
                      }}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 ${
                        index === selectedImageIndex
                          ? "border-current/60 opacity-100"
                          : "border-current/10 opacity-45 hover:opacity-80"
                      }`}
                      aria-label={`View ${image.alt}`}
                      aria-pressed={
                        index === selectedImageIndex
                      }
                    >
                      <img
                        src={image.src}
                        alt=""
                        className="h-full w-full object-cover"
                      />

                      {index === selectedImageIndex && (
                        <span
                          className="absolute inset-x-0 bottom-0 h-0.5"
                          style={{
                            backgroundColor: currentAccent.color,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Story */}
            <div
              ref={detailRef}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: currentAccent.color,
                      boxShadow: `0 0 20px ${currentAccent.color}`,
                    }}
                  />

                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-current/35">
                    {personality.label}
                  </span>
                </div>

                <h3 className="max-w-xl text-4xl font-medium leading-[0.95] tracking-[-0.04em] text-current md:text-5xl">
                  {currentProject.title}
                </h3>

                <p className="mt-6 max-w-lg text-lg leading-relaxed text-current/55">
                  {currentProject.oneLiner}
                </p>

                <div className="mt-10 space-y-8">
                  <StoryBlock
                    index="01"
                    label="The problem"
                    content={currentProject.problem}
                    accentColor={currentAccent.color}
                  />

                  <StoryBlock
                    index="02"
                    label="The approach"
                    content={currentProject.solution}
                    accentColor={currentAccent.color}
                  />
                </div>
              </div>

              <div className="mt-12">
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 border-y border-current/10 py-5">
                  {currentProject.metrics.map((metric) => (
                    <div key={metric.label}>
                      <p
                        className="text-2xl font-semibold tracking-tight transition-colors duration-700"
                        style={{
                          color: currentAccent.color,
                        }}
                      >
                        {metric.value}
                      </p>

                      <p className="mt-1 text-[10px] uppercase leading-tight tracking-[0.12em] text-current/35">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Stack */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {currentProject.stack.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-current/10 px-3 py-1.5 font-mono text-[10px] text-current/50 transition-colors duration-300 hover:border-current/30 hover:text-current/80"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  {currentProject.links.demo && (
                    <a
                      href={currentProject.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm text-current/65 transition-colors hover:text-current"
                    >
                      Visit live system

                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </a>
                  )}

                  {currentProject.links.github && (
                    <a
                      href={currentProject.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm text-current/45 transition-colors hover:text-current"
                    >
                      <FaGithub className="h-4 w-4" />

                      Source
                    </a>
                  )}

                  {currentProject.links.caseStudy &&
                    currentProject.links.caseStudy !== "#" && (
                      <a
                        href={currentProject.links.caseStudy}
                        className="group inline-flex items-center gap-2 text-sm text-current/45 transition-colors hover:text-current"
                      >
                        Case study

                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </a>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exploration controls */}
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          {/* Previous */}
          <button
            type="button"
            onClick={goPrevious}
            className="group flex items-center gap-4 text-left"
            aria-label={`Previous project: ${projects[previousIndex].title}`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-current/15 transition-all duration-300 group-hover:-translate-x-1 group-hover:border-current/50">
              <ArrowLeft className="h-4 w-4" />
            </span>

            <span className="hidden sm:block">
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-current/30">
                Previous
              </span>

              <span className="mt-1 block max-w-[180px] truncate text-sm text-current/55">
                {projects[previousIndex].title}
              </span>
            </span>
          </button>

          {/* Center controls */}
          <div className="flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() =>
                setIsPaused((value) => !value)
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-current/10 text-current/40 transition-all hover:border-current/40 hover:text-current"
              aria-label={
                isPaused
                  ? "Resume project rotation"
                  : "Pause project rotation"
              }
            >
              {isPaused ? (
                <Play className="h-3.5 w-3.5" />
              ) : (
                <Pause className="h-3.5 w-3.5" />
              )}
            </button>

            <div className="flex items-center gap-2">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() =>
                    goToProject(
                      index,
                      index > activeIndex ? 1 : -1
                    )
                  }
                  className="group relative h-8 w-8"
                  aria-label={`Open ${project.title}`}
                  aria-current={
                    index === activeIndex
                      ? "step"
                      : undefined
                  }
                >
                  <span
                    className={`absolute left-1/2 top-1/2 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                      index === activeIndex
                        ? "w-7"
                        : "w-1.5 bg-current/25 group-hover:w-3 group-hover:bg-current/60"
                    }`}
                    style={
                      index === activeIndex
                        ? {
                            backgroundColor:
                              currentAccent.color,
                          }
                        : undefined
                    }
                  />
                </button>
              ))}
            </div>

            <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-current/25 sm:block">
              {isPaused ? "Paused" : "Auto exploring"}
            </span>
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={goNext}
            className="group flex items-center justify-end gap-4 text-right"
            aria-label={`Next project: ${projects[nextIndex].title}`}
          >
            <span className="hidden sm:block">
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-current/30">
                Next
              </span>

              <span className="mt-1 block max-w-[180px] truncate text-sm text-current/55">
                {projects[nextIndex].title}
              </span>
            </span>

            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-current/15 transition-all duration-300 group-hover:translate-x-1 group-hover:border-current/50">
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>

        {/* Collection hint */}
        <div className="mt-14 flex items-center justify-center gap-3 text-current/25">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />

          <span className="font-mono text-[9px] uppercase tracking-[0.25em]">
            Continue through the collection
          </span>
        </div>
      </div>

      {/* Fullscreen evidence viewer */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${currentProject.title} project evidence`}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white"
            aria-label="Close image viewer"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative max-h-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-[82vh] max-w-full rounded-xl object-contain"
            />

            <div className="mt-5 flex items-start justify-between gap-6 text-white">
              <div>
                <p className="text-sm text-white/80">
                  {selectedImage.caption}
                </p>

                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  {currentProject.title} · Evidence{" "}
                  {selectedImageIndex + 1}/
                  {currentProject.images.length}
                </p>
              </div>

              {currentProject.images.length > 1 && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImageIndex((index) =>
                        Math.max(0, index - 1)
                      )
                    }
                    disabled={selectedImageIndex === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 disabled:opacity-30"
                    aria-label="Previous image"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImageIndex((index) =>
                        Math.min(
                          currentProject.images.length - 1,
                          index + 1
                        )
                      )
                    }
                    disabled={
                      selectedImageIndex ===
                      currentProject.images.length - 1
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 disabled:opacity-30"
                    aria-label="Next image"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface StoryBlockProps {
  index: string;
  label: string;
  content: string;
  accentColor: string;
}

function StoryBlock({
  index,
  label,
  content,
  accentColor,
}: StoryBlockProps) {
  return (
    <div className="group flex gap-4">
      <div className="flex w-8 shrink-0 flex-col items-center">
        <span
          className="font-mono text-[10px] transition-colors duration-500"
          style={{
            color: accentColor,
          }}
        >
          {index}
        </span>

        <span className="mt-3 h-full w-px bg-current/10 transition-colors duration-500 group-hover:bg-current/30" />
      </div>

      <div className="pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-current/35">
          {label}
        </p>

        <p className="mt-3 max-w-lg text-sm leading-relaxed text-current/60">
          {content}
        </p>
      </div>
    </div>
  );
}