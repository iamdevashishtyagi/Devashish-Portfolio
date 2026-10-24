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
      className="group relative flex flex-col items-center justify-center text-center w-[310px] sm:w-[350px] shrink-0 min-h-[210px] p-5 sm:p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-900 bg-white hover:bg-amber-50/60 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_22px_40px_-8px_rgba(0,0,0,0.18),0_8px_16px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 cursor-pointer z-10"
    >
      {/* Decorative Washi Tape Accent */}
      <div
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4.5 rounded-xs bg-slate-200/60 backdrop-blur-xs border border-black/5 shadow-2xs rotate-[1deg]"
        aria-hidden="true"
      />

      <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-amber-100 text-slate-500 group-hover:text-amber-800 flex items-center justify-center mb-4 transition-all group-hover:scale-110">
        <PenLine className="w-5 h-5 transition-transform group-hover:rotate-12" />
      </div>

      <p className="text-slate-800 font-medium text-base leading-snug">
        Your note could be here
      </p>

      <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:text-slate-900 group-hover:underline transition-colors">
        <PlusCircle className="w-3.5 h-3.5" /> Write a note
      </span>
    </button>
  );
}
