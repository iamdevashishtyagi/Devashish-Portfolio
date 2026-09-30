"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { navLinks } from "@/src/app/data/profile";

const WORDMARK = "DEVASHISH";
const WORDMARK_CHARACTERS = WORDMARK.split("");

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isDocked, setIsDocked] = useState(false);

  const lastScrollY = useRef(0);
  const wordmarkWrapperRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLAnchorElement>(null);
  const wordmarkSlotRef = useRef<HTMLDivElement>(null);
  const loadingLineRef = useRef<HTMLDivElement>(null);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const remainingCharsRef = useRef<HTMLSpanElement>(null);
  const introBackdropRef = useRef<HTMLDivElement>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Once docked, wordmark is permanently frozen in navbar
  const handleDockWordmark = useCallback(() => {
    setIsDocked(true);
    if (wordmarkWrapperRef.current) {
      wordmarkWrapperRef.current.style.display = "none";
    }
  }, []);

  useEffect(() => {
    // If user reloaded while already scrolled down, immediately freeze in navbar
    if (window.scrollY > 40) {
      handleDockWordmark();
      return;
    }

    const wrapper = wordmarkWrapperRef.current;
    const wordmark = wordmarkRef.current;
    const slot = wordmarkSlotRef.current;
    const loadingLine = loadingLineRef.current;
    const loadingBar = loadingBarRef.current;
    const remainingChars = remainingCharsRef.current;
    const introBackdrop = introBackdropRef.current;

    if (!wrapper || !wordmark || !slot || !loadingLine || !loadingBar || !remainingChars || !introBackdrop) {
      handleDockWordmark();
      return;
    }

    const ctx = gsap.context(() => {
      const initialStyles = window.getComputedStyle(wordmark);

      // Centered initial position
      gsap.set(wordmark, {
        left: "50%",
        top: "50%",
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        fontSize: initialStyles.fontSize,
        fontWeight: 900,
        letterSpacing: initialStyles.letterSpacing,
      });

      const charEls = Array.from(
        wordmark.querySelectorAll<HTMLElement>(".wordmark-character")
      );
      const [firstChar] = charEls;

      // Only first char visible initially
      gsap.set(remainingChars, {
        opacity: 0,
        x: 0,
      });

      // Position loading line below first character
      const dRect = firstChar.getBoundingClientRect();
      gsap.set(loadingLine, {
        top: dRect.bottom + 28,
        opacity: 1,
        display: "block",
      });
      gsap.set(loadingBar, { scaleX: 0, transformOrigin: "left center" });

      const remainingText = WORDMARK.slice(1);
      const naturalWidths = remainingText.split("").map((char) => {
        const measurer = document.createElement("span");
        measurer.style.position = "fixed";
        measurer.style.top = "-9999px";
        measurer.style.left = "-9999px";
        measurer.style.visibility = "hidden";
        measurer.style.whiteSpace = "pre";
        measurer.style.pointerEvents = "none";
        measurer.style.fontSize = initialStyles.fontSize;
        measurer.style.fontWeight = "900";
        measurer.style.fontFamily = initialStyles.fontFamily;
        measurer.style.letterSpacing = initialStyles.letterSpacing;
        measurer.style.textTransform = initialStyles.textTransform;
        document.body.appendChild(measurer);
        measurer.textContent = char;
        const width = measurer.getBoundingClientRect().width;
        document.body.removeChild(measurer);
        return width;
      });

      // Intro timeline
      const intro = gsap.timeline({
        onComplete: () => {
          handleDockWordmark();
        },
      });
      introTimelineRef.current = intro;

      // 1. Loading bar fill
      intro.to(
        loadingBar,
        {
          scaleX: 1,
          duration: 1.3,
          ease: "power2.inOut",
        },
        0.1
      );

      // 2. Loading bar fades out
      intro.to(
        loadingLine,
        {
          opacity: 0,
          scaleY: 0,
          duration: 0.25,
          ease: "power1.in",
          onComplete: () => {
            gsap.set(loadingLine, { display: "none" });
          },
        },
        "+=0.1"
      );

      // 3. Remaining letters slide out
      intro.to(
        remainingChars,
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        "-=0.05"
      );

      const restChars = charEls.slice(1);
      intro.to(
        restChars,
        {
          width: (i: number) => naturalWidths[i],
          duration: 0.55,
          ease: "power2.out",
          onComplete: () => {
            charEls.forEach((el) => {
              gsap.set(el, { width: "auto" });
            });
          },
        },
        "-=0.55"
      );

      // 4. Smooth glide directly into navbar logo slot (One-Way Transition)
      intro.to(
        wordmark,
        {
          x: () => {
            const rect = slot.getBoundingClientRect();
            return rect.left + rect.width / 2 - window.innerWidth / 2;
          },
          y: () => {
            const rect = slot.getBoundingClientRect();
            return rect.top + rect.height / 2 - window.innerHeight / 2;
          },
          fontSize: "1.5rem",
          fontWeight: 900,
          letterSpacing: "-0.025em",
          duration: 0.75,
          ease: "power2.inOut",
        },
        "+=0.2"
      );

      // 5. Intro backdrop fades away simultaneously
      intro.to(
        introBackdrop,
        {
          autoAlpha: 0,
          duration: 0.75,
          ease: "power2.inOut",
        },
        "<"
      );
    });

    // If user starts scrolling during intro, immediately finish intro and dock
    const handleEarlyScroll = () => {
      if (window.scrollY > 20 && introTimelineRef.current) {
        introTimelineRef.current.progress(1);
        handleDockWordmark();
      }
    };
    window.addEventListener("scroll", handleEarlyScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleEarlyScroll);
      ctx.revert();
    };
  }, [handleDockWordmark]);

  // Scroll tracking for navbar background blur & active section
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const hasScrolled = currentScrollY > 20;

      setIsScrolled(hasScrolled);

      const scrollDelta = currentScrollY - lastScrollY.current;
      if (currentScrollY <= 80) {
        setIsHidden(false);
      } else if (Math.abs(scrollDelta) > 3) {
        setIsHidden(scrollDelta > 0);
      }

      lastScrollY.current = currentScrollY;
      const sections = navLinks.map((link) => link.href.replace("#", ""));

      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });

      if (current) {
        setActiveSection(`#${current}`);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Intro Overlay: Active only during first transition, then hidden permanently */}
      {!isDocked && (
        <div
          ref={wordmarkWrapperRef}
          className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
        >
          {/* Frosted blurry effect behind the intro transition */}
          <div
            ref={introBackdropRef}
            className="absolute inset-0 bg-white/75 backdrop-blur-2xl"
            aria-hidden="true"
          />
          <a
            ref={wordmarkRef}
            href="#"
            aria-label="Devashish - Portfolio"
            style={{
              left: "50%",
              top: "50%",
              fontSize: "clamp(3.25rem, 16vw, 16rem)",
              fontWeight: 900,
              fontFamily: "var(--font-medieval-sharp)",
              letterSpacing: "-0.05em",
            }}
            className="pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-sans font-black uppercase leading-none text-black will-change-transform"
          >
            <span className="wordmark-character inline-block">
              {WORDMARK_CHARACTERS[0]}
            </span>
            <span
              ref={remainingCharsRef}
              className="inline-block"
              style={{ opacity: 0 }}
            >
              {WORDMARK_CHARACTERS.slice(1).map((character, index) => (
                <span
                  key={`${character}-${index}`}
                  className="wordmark-character inline-block"
                  style={{ width: 0, verticalAlign: "top" }}
                >
                  {character}
                </span>
              ))}
            </span>
          </a>

          <div
            ref={loadingLineRef}
            className="fixed z-10 left-1/2 h-[2px] w-24 -translate-x-1/2 overflow-hidden rounded-full bg-neutral-200 opacity-0 sm:w-32"
          >
            <div ref={loadingBarRef} className="h-full w-full rounded-full bg-black" />
          </div>
        </div>
      )}

      {/* Modern, Smart, Clear Navbar */}
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        } ${
          isScrolled
            ? "border-b border-neutral-200/80 bg-white/90 backdrop-blur-md shadow-xs"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <div className="flex h-16 items-center justify-between">
            {/* Frozen Navbar Wordmark Slot */}
            <div
              ref={wordmarkSlotRef}
              className="h-8 min-w-36 flex items-center"
            >
              {isDocked && (
                <a
                  href="#"
                  aria-label="Devashish - Back to top"
                  className="font-sans font-black text-2xl tracking-tight text-black transition-opacity hover:opacity-80 flex items-center uppercase"
                >
                  DEVASHISH
                </a>
              )}
            </div>

            {/* Nav Links */}
            <div className="hidden items-center gap-7 text-sm md:flex font-medium">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`transition-colors hover:text-black ${
                    activeSection === link.href
                      ? "text-black font-semibold"
                      : "text-neutral-500"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Action CTA Button */}
            <a
              href="#contact"
              className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-neutral-800 hover:shadow-md"
            >
              Let's talk
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
