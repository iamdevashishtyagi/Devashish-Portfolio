"use client";

import React from "react";
import { PlusCircle, PenLine } from "lucide-react";

interface PromptCardProps {
  onClick: () => void;
}

export default function PromptCard({ onClick }: PromptCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-center justify-between text-center w-[320px] sm:w-[360px] shrink-0 min-h-[265px] sm:min-h-[285px] p-6 sm:p-7 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-900 bg-white/95 hover:bg-amber-50/70 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_22px_42px_-8px_rgba(0,0,0,0.18),0_8px_18px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 cursor-pointer z-10"
    >
      {/* Decorative Washi Tape Accent */}
      <div
        className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-5 sm:h-5.5 rounded-[2px] bg-slate-200/80 backdrop-blur-xs border-y border-black/10 shadow-xs rotate-[1deg] group-hover:rotate-0 transition-transform pointer-events-none"
        aria-hidden="true"
      />

      <div className="flex-1 flex flex-col items-center justify-center pt-2">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-slate-100 group-hover:bg-amber-100 text-slate-700 group-hover:text-amber-900 flex items-center justify-center mb-3.5 border-2 border-white shadow-md ring-1 ring-black/10 transition-all group-hover:scale-110">
          <PenLine className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12" />
        </div>

        <p className="text-slate-900 font-bold text-base sm:text-[17px] leading-snug tracking-tight">
          Your note could be here
        </p>

        <p className="text-xs text-slate-500 mt-1 max-w-[210px] leading-relaxed">
          Share a memory, feedback, or a quick hello to Devashish.
        </p>
      </div>

      <div className="w-full pt-3.5 border-t border-slate-200/60 flex items-center justify-center">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xs group-hover:bg-amber-600 transition-colors">
          <PlusCircle className="w-3.5 h-3.5" />
          Write a note
        </span>
      </div>
    </button>
  );
}
