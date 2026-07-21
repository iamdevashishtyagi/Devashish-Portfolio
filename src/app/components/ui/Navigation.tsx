"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navLinks } from "@/src/app/data/profile";

gsap.registerPlugin(ScrollTrigger);

const WORDMARK = "DEVASHISH";
const WORDMARK_CHARACTERS = WORDMARK.split("");

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const lastScrollY = useRef(0);
  const wordmarkWrapperRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLAnchorElement>(null);
  const wordmarkSlotRef = useRef<HTMLDivElement>(null);
  const loadingLineRef = useRef<HTMLDivElement>(null);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const remainingCharsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrapper = wordmarkWrapperRef.current;
    const wordmark = wordmarkRef.current;
    const slot = wordmarkSlotRef.current;
    const loadingLine = loadingLineRef.current;
    const loadingBar = loadingBarRef.current;
    const remainingChars = remainingCharsRef.current;

    if (!wrapper || !wordmark || !slot || !loadingLine || !loadingBar || !remainingChars) return;

    const ctx = gsap.context(() => {
      const initialStyles = window.getComputedStyle(wordmark);
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
      gsap.fromTo(
        wordmark,
        {
          left: "50%",
          top: "50%",
          x: 0,
          y: 0,
          xPercent: -50,
          yPercent: -50,
          fontSize: initialStyles.fontSize,
          fontWeight: 900,
          letterSpacing: initialStyles.letterSpacing,
        },
        {
          x: () => {
            const finalFontSize = 24;
            const initialFontSize = Number.parseFloat(initialStyles.fontSize);
            const initialWidth = wordmark.getBoundingClientRect().width;
            const finalWidth = initialWidth * (finalFontSize / initialFontSize);

            return (
              slot.getBoundingClientRect().left -
              window.innerWidth / 2 +
              finalWidth / 2
            );
          },

          y: () => {
            const rect = slot.getBoundingClientRect();
            return rect.top + rect.height / 2 - window.innerHeight / 2;
          },

          fontSize: "1.5rem",
          fontWeight: 600,
          letterSpacing: "-0.025em",

          ease: "none",

          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "+=420",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      // Get the D character and measure it
      const charEls = Array.from(
        wordmark.querySelectorAll<HTMLElement>(".wordmark-character")
      );
      const [firstChar] = charEls;

      // Set initial state - only D visible, remaining letters hidden behind it
      gsap.set(remainingChars, {
        opacity: 0,
        x: 0,
      });

      // Measure the width of the remaining text as a single block
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

      // Get the full remaining text as a single block
      const remainingText = WORDMARK.slice(1);
      measurer.textContent = remainingText;
      const remainingWidth = measurer.getBoundingClientRect().width;

      document.body.removeChild(measurer);

      // Position the loading line
      const dRect = firstChar.getBoundingClientRect();
      gsap.set(loadingLine, {
        top: dRect.bottom + 28,
        opacity: 1,
        display: "block",
      });
      gsap.set(loadingBar, { scaleX: 0, transformOrigin: "left center" });

      const intro = gsap.timeline({
        onComplete: () => {
          const scrollProxy = { value: window.scrollY };

          gsap.to(scrollProxy, {
            value: 420,
            duration: 1.8,
            ease: "power2.inOut",
            onUpdate: () => {
              window.scrollTo(0, scrollProxy.value);
            },
          });
        },
      });

      // Loading bar animation
      intro.to(
        loadingBar,
        {
          scaleX: 1,
          duration: 1.3,
          ease: "power2.inOut",
        },
        0.2
      );

      intro.to(
        loadingLine,
        {
          opacity: 0,
          scaleY: 0,
          duration: 0.1,
          ease: "power1.in",
          onComplete: () => {
            gsap.set(loadingLine, { display: "none" });
          },
        },
        "+=0.15"
      );

      // NEW ANIMATION: The remaining letters slide out from behind D as a single solid block
      intro.to(
        remainingChars,
        {
          opacity: 1,
          x: 0, // Move from left to right
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.05"
      );

      // Also animate the individual letter widths to match their natural widths
      // but now they should appear as a solid block
      const restChars = charEls.slice(1);
      const naturalWidths = remainingText.split("").map((char) => {
        const measurer2 = document.createElement("span");
        measurer2.style.position = "fixed";
        measurer2.style.top = "-9999px";
        measurer2.style.left = "-9999px";
        measurer2.style.visibility = "hidden";
        measurer2.style.whiteSpace = "pre";
        measurer2.style.pointerEvents = "none";
        measurer2.style.fontSize = initialStyles.fontSize;
        measurer2.style.fontWeight = "900";
        measurer2.style.fontFamily = initialStyles.fontFamily;
        measurer2.style.letterSpacing = initialStyles.letterSpacing;
        measurer2.style.textTransform = initialStyles.textTransform;
        document.body.appendChild(measurer2);
        measurer2.textContent = char;
        const width = measurer2.getBoundingClientRect().width;
        document.body.removeChild(measurer2);
        return width;
      });

      // Animate widths simultaneously (not staggered)
      intro.to(
        restChars,
        {
          width: (i: number) => naturalWidths[i],
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            charEls.forEach((el) => {
              gsap.set(el, { width: "auto" });
            });
          },
        },
        "-=0.6"
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const hasScrolled = currentScrollY > 50;

      setIsScrolled(hasScrolled);

      const scrollDelta = currentScrollY - lastScrollY.current;
      if (currentScrollY < 420) {
        setIsHidden(false);
      } else if (Math.abs(scrollDelta) > 2) {
        setIsHidden(scrollDelta > 0);
      }

      lastScrollY.current = currentScrollY;
      const sections = navLinks.map((link) => link.href.replace("#", ""));

      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;

        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
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
      <div
        ref={wordmarkWrapperRef}
        className={`pointer-events-none fixed inset-0 z-[60] transition-opacity duration-300 ${
          isHidden ? "opacity-0" : "opacity-100"
        }`}
      >
        <a
          ref={wordmarkRef}
          href="#"
          aria-label="Back to top"
          style={{
            left: "50%",
            top: "50%",
            fontSize: "clamp(3.25rem, 16vw, 16rem)",
            fontWeight: 900,
            fontFamily: "var(--font-medieval-sharp)",
            letterSpacing: "-0.09em",
          }}
          className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-sans uppercase leading-none text-charcoal will-change-transform ${
            isHidden ? "pointer-events-none" : ""
          }`}
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
          className="fixed left-1/2 h-[2px] w-24 -translate-x-1/2 overflow-hidden rounded-full bg-charcoal/15 opacity-0 sm:w-32"
        >
          <div ref={loadingBarRef} className="h-full w-full rounded-full bg-charcoal" />
        </div>
      </div>

      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        } ${
          isScrolled
            ? "border-b border-gray-100 bg-cream/90 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <div className="flex h-16 items-center justify-between">
            <div
              ref={wordmarkSlotRef}
              className="h-8 w-36"
              aria-hidden="true"
            />

            <div className="hidden items-center gap-6 text-sm md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`transition-colors hover:text-charcoal ${
                    activeSection === link.href
                      ? "font-medium text-charcoal"
                      : "text-gray-400"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <a
              href="#contact"
              className="rounded-full bg-charcoal px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-gray-800"
            >
              Let's talk
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}