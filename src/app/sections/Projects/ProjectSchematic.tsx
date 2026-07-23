// src/app/sections/Projects/ProjectSchematic.tsx
"use client";

import { Project } from "@/src/app/data/profile";

interface ProjectSchematicProps {
  mockup: Project["mockup"];
  accent: string;
  className?: string;
}

/**
 * Each project type gets a small, abstract schematic instead of a generic
 * icon — a visual shorthand for the mechanism underneath the screenshots.
 * Rendered in the accent color at low opacity so it reads as structure,
 * not decoration.
 */
export default function ProjectSchematic({
  mockup,
  accent,
  className = "",
}: ProjectSchematicProps) {
  const common = {
    viewBox: "0 0 200 140",
    className,
    "aria-hidden": true as const,
  };
  const stroke = accent;

  switch (mockup) {
    case "table":
      // Structured rows/columns — the ERP's ledger of records.
      return (
        <svg {...common}>
          <rect x="4" y="4" width="192" height="132" rx="6" fill="none" stroke={stroke} strokeOpacity="0.25" />
          {[1, 2, 3, 4].map((r) => (
            <line key={r} x1="4" y1={4 + r * 26.4} x2="196" y2={4 + r * 26.4} stroke={stroke} strokeOpacity="0.18" />
          ))}
          {[1, 2, 3].map((c) => (
            <line key={c} x1={4 + c * 48} y1="4" x2={4 + c * 48} y2="136" stroke={stroke} strokeOpacity="0.18" />
          ))}
          <rect x="10" y="10" width="36" height="14.4" rx="2" fill={stroke} fillOpacity="0.5" />
        </svg>
      );

    case "document":
      // A ruled ledger page with a validation seal — compliance's signature.
      return (
        <svg {...common}>
          <rect x="46" y="6" width="108" height="128" rx="4" fill="none" stroke={stroke} strokeOpacity="0.3" />
          {[0, 1, 2, 3, 4, 5].map((l) => (
            <line key={l} x1="58" y1={26 + l * 16} x2="142" y2={26 + l * 16} stroke={stroke} strokeOpacity="0.2" />
          ))}
          <circle cx="150" cy="112" r="18" fill="none" stroke={stroke} strokeOpacity="0.55" strokeWidth="1.5" />
          <path d="M142 112l5 6 11-13" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "calendar":
      // Day grid with one lit cell — attendance caught mid check-in.
      return (
        <svg {...common}>
          <rect x="8" y="14" width="184" height="118" rx="6" fill="none" stroke={stroke} strokeOpacity="0.28" />
          <line x1="8" y1="38" x2="192" y2="38" stroke={stroke} strokeOpacity="0.3" />
          {Array.from({ length: 6 }).map((_, col) => (
            <line key={col} x1={8 + col * 30.6} y1="14" x2={8 + col * 30.6} y2="132" stroke={stroke} strokeOpacity="0.14" />
          ))}
          {Array.from({ length: 3 }).map((_, row) => (
            <line key={row} x1="8" y1={38 + row * 31.3} x2="192" y2={38 + row * 31.3} stroke={stroke} strokeOpacity="0.14" />
          ))}
          <rect x="70" y="69" width="30.6" height="31.3" fill={stroke} fillOpacity="0.45" />
        </svg>
      );

    case "chat":
      // Alternating grounded/retrieved bubbles connected by a thread.
      return (
        <svg {...common}>
          <rect x="10" y="12" width="108" height="26" rx="13" fill="none" stroke={stroke} strokeOpacity="0.4" />
          <rect x="82" y="52" width="108" height="26" rx="13" fill={stroke} fillOpacity="0.4" />
          <rect x="10" y="92" width="130" height="26" rx="13" fill="none" stroke={stroke} strokeOpacity="0.4" />
          <line x1="64" y1="38" x2="120" y2="52" stroke={stroke} strokeOpacity="0.3" strokeDasharray="2 3" />
          <line x1="120" y1="78" x2="70" y2="92" stroke={stroke} strokeOpacity="0.3" strokeDasharray="2 3" />
        </svg>
      );

    case "landing":
    default:
      // Editorial hero stack — big line, short line, a call-to-action pill.
      return (
        <svg {...common}>
          <rect x="16" y="18" width="150" height="10" rx="2" fill={stroke} fillOpacity="0.5" />
          <rect x="16" y="38" width="96" height="7" rx="2" fill={stroke} fillOpacity="0.28" />
          <rect x="16" y="52" width="120" height="7" rx="2" fill={stroke} fillOpacity="0.28" />
          <rect x="16" y="80" width="64" height="20" rx="10" fill="none" stroke={stroke} strokeOpacity="0.55" />
          <rect x="16" y="112" width="52" height="16" rx="3" fill={stroke} fillOpacity="0.16" />
          <rect x="74" y="112" width="52" height="16" rx="3" fill={stroke} fillOpacity="0.16" />
          <rect x="132" y="112" width="52" height="16" rx="3" fill={stroke} fillOpacity="0.16" />
        </svg>
      );
  }
}
