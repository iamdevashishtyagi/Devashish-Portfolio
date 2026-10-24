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
      className={`group relative flex flex-col justify-between w-[320px] sm:w-[360px] shrink-0 min-h-[265px] sm:min-h-[285px] p-5 sm:p-6 rounded-2xl border border-black/10 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_22px_42px_-8px_rgba(0,0,0,0.22),0_8px_18px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 hover:rotate-0 hover:z-20 cursor-default ${rotationClass}`}
      style={{
        backgroundColor: note.color,
      }}
    >
      {/* Decorative Washi Tape at top center */}
      <div
        className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-5 sm:h-5.5 rounded-[2px] bg-white/70 backdrop-blur-xs border-y border-black/10 shadow-[0_1px_3px_rgba(0,0,0,0.06)] rotate-[-1deg] group-hover:rotate-0 transition-transform pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Note Content */}
      <div className="pt-2 sm:pt-3 flex-1 flex flex-col justify-start">
        <p className="text-slate-900 text-[14.5px] sm:text-[15.5px] leading-relaxed whitespace-pre-wrap break-words font-normal font-sans tracking-[-0.01em]">
          {note.message}
        </p>
      </div>

      {/* Footer / Author Bar with Avatar */}
      <div className="mt-4 pt-3.5 border-t border-black/10 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <AvatarDisplay avatar={note.avatar} name={note.name} size="card" />
          <div className="flex flex-col min-w-0 justify-center">
            <span className="font-bold text-slate-950 truncate text-[13px] sm:text-[13.5px] tracking-tight">
              {note.name}
            </span>
            {authorSubtitle ? (
              <span className="text-[11px] sm:text-[11.5px] text-slate-700/80 truncate font-medium">
                {authorSubtitle}
              </span>
            ) : (
              <span className="text-[11px] text-slate-500/70 truncate">
                Visitor
              </span>
            )}
          </div>
        </div>
        <span className="text-[11px] font-medium text-slate-600 bg-black/[0.04] px-2.5 py-1 rounded-full border border-black/5 shrink-0 ml-auto whitespace-nowrap">
          {formattedDate}
        </span>
      </div>
    </article>
  );
}
