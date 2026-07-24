// src/app/sections/Experience/AscentPath.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AscentPathProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  markerRefs: React.RefObject<Map<string, HTMLDivElement>>;
  order: string[];
  accent: string;
  reduced: boolean;
}

export default function AscentPath({ containerRef, markerRefs, order, accent, reduced }: AscentPathProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const [d, setD] = useState("");
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const markers = markerRefs.current;
      if (!container || !markers) return;
      const containerRect = container.getBoundingClientRect();

      const points = order
        .map((id) => markers.get(id))
        .filter((el): el is HTMLDivElement => !!el)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - containerRect.left,
            y: r.top + r.height / 2 - containerRect.top,
          };
        });

      if (points.length < 2) return;

      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midY = (prev.y + curr.y) / 2;
        path += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
      }
      setD(path);
      setBox({ w: containerRect.width, h: containerRect.height });
    };

    measure();
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, markerRefs, order]);

  useEffect(() => {
    if (!pathRef.current || !d) return;
    const length = pathRef.current.getTotalLength();

    if (reduced) {
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: 0 });
      return;
    }

    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
    const tween = gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: svgWrapRef.current,
        start: "top 75%",
        end: "bottom 55%",
        scrub: 0.6,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [d, reduced]);

  return (
    <div ref={svgWrapRef} className="absolute inset-0 pointer-events-none hidden md:block">
      <svg width={box.w} height={box.h} className="overflow-visible">
        <path ref={pathRef} d={d} fill="none" stroke={accent} strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
      </svg>
    </div>
  );
}
