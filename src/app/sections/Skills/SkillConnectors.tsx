// src/app/sections/Skills/SkillConnectors.tsx
"use client";

import { useEffect, useState } from "react";

interface SkillConnectorsProps {
  containerRef: React.RefObject<HTMLDivElement>;
  nodeRefs: React.RefObject<Map<string, HTMLButtonElement>>;
  activeId: string | null;
  relatedIds: string[];
  accent: string;
  enabled: boolean;
}

type Line = { id: string; x1: number; y1: number; x2: number; y2: number };

export default function SkillConnectors({
  containerRef,
  nodeRefs,
  activeId,
  relatedIds,
  accent,
  enabled,
}: SkillConnectorsProps) {
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    if (!enabled || !activeId) {
      setLines([]);
      return;
    }

    const measure = () => {
      const container = containerRef.current;
      const nodes = nodeRefs.current;
      if (!container || !nodes) return;
      const containerRect = container.getBoundingClientRect();
      const from = nodes.get(activeId);
      if (!from) return;
      const fromRect = from.getBoundingClientRect();
      const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;

      const next: Line[] = [];
      relatedIds.forEach((id) => {
        const to = nodes.get(id);
        if (!to) return;
        const toRect = to.getBoundingClientRect();
        next.push({
          id,
          x1: fromX,
          y1: fromY,
          x2: toRect.left + toRect.width / 2 - containerRect.left,
          y2: toRect.top + toRect.height / 2 - containerRect.top,
        });
      });
      setLines(next);
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
  }, [activeId, relatedIds, enabled, containerRef, nodeRefs]);

  if (!enabled) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      {lines.map((line) => {
        const midX = (line.x1 + line.x2) / 2;
        const midY = (line.y1 + line.y2) / 2 - 24;
        return (
          <path
            key={line.id}
            d={`M ${line.x1} ${line.y1} Q ${midX} ${midY} ${line.x2} ${line.y2}`}
            fill="none"
            stroke={accent}
            strokeWidth={1.25}
            strokeOpacity={0.35}
            strokeDasharray="3 4"
          />
        );
      })}
    </svg>
  );
}
