"use client";

import React from "react";

export interface PresetAvatar {
  id: string;
  name: string;
  category: string;
}

export const PRESET_AVATARS: PresetAvatar[] = [
  { id: "dev", name: "Engineer", category: "Tech" },
  { id: "designer", name: "Designer", category: "Creative" },
  { id: "founder", name: "Founder", category: "Leadership" },
  { id: "builder", name: "Builder", category: "Product" },
  { id: "minimalist", name: "Minimal", category: "Art" },
  { id: "robot", name: "AI Agent", category: "Future" },
  { id: "coffee", name: "Coffee", category: "Vibe" },
  { id: "spark", name: "Innovator", category: "Spirit" },
];

interface AvatarIconProps {
  id: string;
  className?: string;
}

export function AvatarSvg({ id, className = "w-full h-full" }: AvatarIconProps) {
  switch (id) {
    case "dev":
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#3B82F6" />
          <circle cx="24" cy="20" r="10" fill="#FED7AA" />
          {/* Hair */}
          <path d="M14 18C14 13 18 10 24 10C30 10 34 13 34 18C34 19 32 18 24 18C16 18 14 19 14 18Z" fill="#1E293B" />
          {/* Glasses */}
          <circle cx="19" cy="20" r="3.5" stroke="#0F172A" strokeWidth="1.5" fill="#E0F2FE" fillOpacity="0.7" />
          <circle cx="29" cy="20" r="3.5" stroke="#0F172A" strokeWidth="1.5" fill="#E0F2FE" fillOpacity="0.7" />
          <line x1="22.5" y1="20" x2="25.5" y2="20" stroke="#0F172A" strokeWidth="1.5" />
          {/* Smile */}
          <path d="M21 26C22.5 27.5 25.5 27.5 27 26" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
          {/* Hoodie */}
          <path d="M11 44C11 36 17 32 24 32C31 32 37 36 37 44" fill="#1E293B" />
          <path d="M21 32L24 37L27 32" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "designer":
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#A855F7" />
          <circle cx="24" cy="21" r="10" fill="#FDE68A" />
          {/* Beret */}
          <ellipse cx="23" cy="14" rx="12" ry="5" fill="#6B21A8" />
          <circle cx="23" cy="9" r="1.5" fill="#6B21A8" />
          {/* Eyes */}
          <circle cx="20" cy="20" r="1.5" fill="#1E1B4B" />
          <circle cx="28" cy="20" r="1.5" fill="#1E1B4B" />
          {/* Smile */}
          <path d="M21 25C22.5 26.5 25.5 26.5 27 25" stroke="#6B21A8" strokeWidth="1.5" strokeLinecap="round" />
          {/* Clothes */}
          <path d="M10 44C10 35 16 31 24 31C32 31 38 35 38 44" fill="#581C87" />
          <circle cx="24" cy="38" r="2" fill="#FDE68A" />
        </svg>
      );
    case "founder":
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#0F172A" />
          <circle cx="24" cy="20" r="10" fill="#FFEDD5" />
          {/* Sleek Hair */}
          <path d="M14 17C14 11 19 9 24 9C29 9 34 11 34 17C32 16 28 15 24 15C20 15 16 16 14 17Z" fill="#334155" />
          {/* Eyes */}
          <line x1="18.5" y1="20" x2="21.5" y2="20" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="26.5" y1="20" x2="29.5" y2="20" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
          {/* Confident Smile */}
          <path d="M21 25.5C22.5 26.8 25.5 26.8 27 25.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
          {/* Blazer & Tie */}
          <path d="M10 44C10 35 16 31 24 31C32 31 38 35 38 44" fill="#1E293B" />
          <path d="M21 31L24 37L27 31" fill="#FFFFFF" />
          <path d="M23 35L24 43L25 35" fill="#EF4444" />
        </svg>
      );
    case "builder":
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#F97316" />
          <circle cx="24" cy="21" r="10" fill="#FCD34D" />
          {/* Headphones Band */}
          <path d="M13 22C13 14 17 11 24 11C31 11 35 14 35 22" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          {/* Earcups */}
          <rect x="11" y="19" width="4" height="7" rx="2" fill="#1F2937" />
          <rect x="33" y="19" width="4" height="7" rx="2" fill="#1F2937" />
          {/* Eyes & Smirk */}
          <circle cx="20" cy="21" r="1.5" fill="#1F2937" />
          <circle cx="28" cy="21" r="1.5" fill="#1F2937" />
          <path d="M21 26C23 27 26 27 27 25.5" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
          {/* T-Shirt */}
          <path d="M11 44C11 36 17 32 24 32C31 32 37 36 37 44" fill="#EA580C" />
        </svg>
      );
    case "minimalist":
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#E2E8F0" />
          <circle cx="24" cy="19" r="8" fill="#475569" />
          <path d="M12 42C12 33 17 29 24 29C31 29 36 33 36 42" fill="#475569" />
          <circle cx="33" cy="14" r="3" fill="#F59E0B" />
        </svg>
      );
    case "robot":
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#0D9488" />
          {/* Antenna */}
          <line x1="24" y1="12" x2="24" y2="8" stroke="#CCFBF1" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="7" r="2" fill="#FACC15" />
          {/* Head */}
          <rect x="14" y="12" width="20" height="17" rx="4" fill="#115E59" stroke="#99F6E4" strokeWidth="1.5" />
          {/* Visor / Eyes */}
          <rect x="17" y="16" width="14" height="5" rx="2.5" fill="#14B8A6" />
          <circle cx="20.5" cy="18.5" r="1.5" fill="#CCFBF1" />
          <circle cx="27.5" cy="18.5" r="1.5" fill="#CCFBF1" />
          {/* Mouth Grid */}
          <line x1="19" y1="25" x2="29" y2="25" stroke="#99F6E4" strokeWidth="1.5" strokeLinecap="round" />
          {/* Body */}
          <path d="M12 44C12 36 17 32 24 32C31 32 36 36 36 44" fill="#115E59" />
          <circle cx="24" cy="38" r="2" fill="#5EEAD4" />
        </svg>
      );
    case "coffee":
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#78350F" />
          {/* Mug */}
          <rect x="15" y="18" width="18" height="16" rx="3" fill="#FEF3C7" />
          {/* Handle */}
          <path d="M33 21C36 21 37 24 37 26C37 28 36 31 33 31" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" />
          {/* Steam */}
          <path d="M19 14C19 12 21 12 21 10" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24 14C24 12 26 12 26 10" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M29 14C29 12 31 12 31 10" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
          {/* Heart on Mug */}
          <path d="M24 28L22 25.5C20.5 24 22 22 23.5 23L24 23.5L24.5 23C26 22 27.5 24 26 25.5L24 28Z" fill="#B45309" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="24" fill="#4338CA" />
          {/* Big Sparkle */}
          <path
            d="M24 10C24 17.7 17.7 24 10 24C17.7 24 24 30.3 24 38C24 30.3 30.3 24 38 24C30.3 24 24 17.7 24 10Z"
            fill="#FDE047"
          />
          {/* Little Mini Sparkle */}
          <path
            d="M34 10C34 12.5 32 14.5 29.5 14.5C32 14.5 34 16.5 34 19C34 16.5 36 14.5 38.5 14.5C36 14.5 34 12.5 34 10Z"
            fill="#FFFFFF"
          />
        </svg>
      );
    default:
      return null;
  }
}

interface AvatarDisplayProps {
  avatar?: string;
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AvatarDisplay({
  avatar,
  name,
  className = "",
  size = "md",
}: AvatarDisplayProps) {
  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  }[size];

  // If user uploaded a custom photo (data:image or http/https)
  if (avatar && (avatar.startsWith("data:image/") || avatar.startsWith("http://") || avatar.startsWith("https://"))) {
    return (
      <div className={`relative rounded-full overflow-hidden shrink-0 border border-black/10 shadow-sm ${sizeClasses} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} alt={name || "Avatar"} className="w-full h-full object-cover" />
      </div>
    );
  }

  // If user selected one of the 8 preset SVG avatars
  if (avatar && PRESET_AVATARS.some((p) => p.id === avatar)) {
    return (
      <div className={`relative rounded-full overflow-hidden shrink-0 border border-black/10 shadow-sm ${sizeClasses} ${className}`}>
        <AvatarSvg id={avatar} />
      </div>
    );
  }

  // Fallback: Elegant initials
  const initials = (name || "Visitor")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-slate-700 bg-white/70 border border-black/10 shadow-sm shrink-0 ${sizeClasses} ${className}`}
    >
      {initials || "V"}
    </div>
  );
}
