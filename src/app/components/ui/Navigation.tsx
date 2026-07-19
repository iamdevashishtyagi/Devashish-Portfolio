"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navLinks } from "@/src/app/data/profile";

gsap.registerPlugin(ScrollTrigger);

const WORDMARK = "DEVASHISH";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const lastScrollY = useRef(0);
  const wordmarkWrapperRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLAnchorElement>(null);
  const wordmarkSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wordmarkWrapperRef.current;
    const wordmark = wordmarkRef.current;
    const slot = wordmarkSlotRef.current;

    if (!wrapper || !wordmark || !slot) return;

    const ctx = gsap.context(() => {
      const initialStyles = window.getComputedStyle(wordmark);

      /*
       * Base centered position for the wordmark itself.
       * This element is only ever touched by the ScrollTrigger
       * animation below — entrance sliding is handled entirely
       * by the wrapper's `x`, so these two tweens never collide.
       */
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

      /*
       * Existing scroll-driven wordmark animation
       * (hero -> navbar), untouched.
       */
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

      /*
       * Entrance animation: slide the whole wordmark in from
       * completely outside the right edge of the viewport.
       *
       * This only ever animates the WRAPPER's `x`, never the
       * wordmark's own transform properties, so it can never
       * fight with the ScrollTrigger tween above.
       */
      const offscreenX = () =>
        window.innerWidth + wordmark.getBoundingClientRect().width;

      gsap.set(wrapper, { x: offscreenX });

      const intro = gsap.timeline({
        onComplete: () => {
          /*
           * Automatically perform the same scroll interaction
           * as the original manual scroll behavior.
           */
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

      intro.to(wrapper, {
        x: 0,
        duration: 1.1,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const hasScrolled = currentScrollY > 50;

      setIsScrolled(hasScrolled);

      const scrollDelta = currentScrollY - lastScrollY.current;

      // Keep the bar present while the hero wordmark transitions into it.
      if (currentScrollY < 420) {
        setIsHidden(false);
      } else if (Math.abs(scrollDelta) > 2) {
        setIsHidden(scrollDelta > 0);
      }

      lastScrollY.current = currentScrollY;

      // Detect active section
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
      {/*
        Entrance wrapper: covers the full viewport, fixed in place.
        Only its `x` (translateX) is ever animated — for the
        slide-in-from-the-right entrance. It never touches
        left/top/xPercent/yPercent/fontSize, so it can't conflict
        with the wordmark's own ScrollTrigger animation.
      */}
      <div
        ref={wordmarkWrapperRef}
        className={`pointer-events-none fixed inset-0 z-[60] will-change-transform transition-opacity duration-300 ${
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
          {WORDMARK}
        </a>
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