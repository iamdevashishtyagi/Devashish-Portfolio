"use client";

import React from "react";
import { GuestbookNote } from "@/src/app/lib/guestbook-types";
import { AvatarDisplay } from "@/src/app/lib/avatars";

interface NoteCardProps {
  note: GuestbookNote;
  index: number;
}

// Organic rotation variations for authentic sticky note feel
const ROTATIONS = [
  "-rotate-1",
  "rotate-1",
  "-rotate-[0.5deg]",
  "rotate-[1.2deg]",
  "-rotate-[1.2deg]",
  "rotate-[0.7deg]",
];

export default function NoteCard({ note, index }: NoteCardProps) {
  const rotationClass = ROTATIONS[index % ROTATIONS.length];

  // Format relative or friendly date
  const formattedDate = (() => {
    try {
      const date = new Date(note.createdAt);
      const diffMs = Date.now() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 5) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  })();

  // Format designation and company nicely
  const authorSubtitle = (() => {
    const parts: string[] = [];
    if (note.role) parts.push(note.role);
    if (note.company) parts.push(note.company);
    return parts.join(" at ") || null;
  })();

  return (
    <article
      className={`group relative flex flex-col justify-between w-[310px] sm:w-[350px] shrink-0 min-h-[210px] p-5 sm:p-6 rounded-2xl border border-black/10 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_22px_40px_-8px_rgba(0,0,0,0.22),0_8px_16px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 hover:rotate-0 hover:z-20 cursor-default ${rotationClass}`}
      style={{
        backgroundColor: note.color,
      }}
    >
      {/* Decorative Washi Tape / Paper Pin at top center */}
      <div
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4.5 rounded-xs bg-white/50 backdrop-blur-xs border border-black/5 shadow-2xs rotate-[-1deg] group-hover:rotate-0 transition-transform"
        aria-hidden="true"
      />

      {/* Note Content */}
      <div className="pt-2">
        <p className="text-slate-800 text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words font-normal font-sans">
          {note.message}
        </p>
      </div>

      {/* Footer / Author Bar with Avatar */}
      <div className="mt-5 pt-3.5 border-t border-black/8 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <AvatarDisplay avatar={note.avatar} name={note.name} size="sm" />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-900 truncate text-xs">
              {note.name}
            </span>
            {authorSubtitle && (
              <span className="text-[11px] text-slate-600 truncate mt-0.5 opacity-80">
                {authorSubtitle}
              </span>
            )}
          </div>
        </div>
        <span className="text-[11px] text-slate-500 font-medium shrink-0 ml-auto">
          {formattedDate}
        </span>
      </div>
    </article>
  );
}
