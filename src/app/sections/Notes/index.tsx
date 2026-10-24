"use client";

import React, { useState, useEffect, useRef } from "react";
import { PenSquare, MessageSquareHeart } from "lucide-react";
import { GuestbookNote } from "@/src/app/lib/guestbook-types";
import { collectClientTelemetry } from "@/src/app/lib/telemetry";
import NoteCard from "./NoteCard";
import PromptCard from "./PromptCard";
import WriteNoteModal from "./WriteNoteModal";

export default function NotesSection() {
  const [notes, setNotes] = useState<GuestbookNote[]>([]);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasTracked = useRef(false);

  // 1. Visit Count Tracking & Retrieval
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    async function handleVisits() {
      try {
        const SESSION_KEY = "devashish_portfolio_session_tracked";
        const hasTrackedSession = sessionStorage.getItem(SESSION_KEY);

        if (!hasTrackedSession) {
          // New browser tab / session: Increment unique visit with silent client telemetry
          const telemetry = collectClientTelemetry();
          const res = await fetch("/api/visits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telemetry }),
          });
          const data = await res.json();
          if (data && typeof data.count === "number") {
            setVisitCount(data.count);
            sessionStorage.setItem(SESSION_KEY, "true");
            window.dispatchEvent(new CustomEvent("portfolio_visit_updated", { detail: data.count }));
          }
        } else {
          // Same session / refresh: Fetch existing count without incrementing
          const res = await fetch("/api/visits");
          const data = await res.json();
          if (data && typeof data.count === "number") {
            setVisitCount(data.count);
            window.dispatchEvent(new CustomEvent("portfolio_visit_updated", { detail: data.count }));
          }
        }
      } catch (err) {
        console.error("Could not process visit count:", err);
      }
    }

    handleVisits();
  }, []);

  // 2. Fetch Notes
  useEffect(() => {
    async function loadNotes() {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        if (data.notes && Array.isArray(data.notes)) {
          setNotes(data.notes);
        }
      } catch (err) {
        console.error("Could not load notes:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadNotes();
  }, []);

  // 3. Callback when a new note is created
  const handleNoteAdded = (newNote: GuestbookNote) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  // Prepare 2 balanced streams of cards for the infinite scrolling rows
  const prepareRows = () => {
    if (isLoading && notes.length === 0) {
      return { row1: [], row2: [] };
    }

    // Split notes into two groups
    const group1: (GuestbookNote | "prompt")[] = [];
    const group2: (GuestbookNote | "prompt")[] = [];

    // Always include prompt card in row 1 for high visibility
    group1.push("prompt");

    notes.forEach((note, index) => {
      if (index % 2 === 0) {
        group1.push(note);
      } else {
        group2.push(note);
      }
    });

    // If row 2 is empty or has very few items, balance from group1
    if (group2.length === 0) {
      group2.push("prompt");
    }

    // Repeat items to ensure seamless infinite looping without gaps
    const multiplyItems = <T,>(arr: T[], minLength = 8): T[] => {
      if (arr.length === 0) return [];
      let result = [...arr];
      while (result.length < minLength) {
        result = [...result, ...arr];
      }
      // Duplicate once more so translate(-50%) produces a seamless loop
      return [...result, ...result];
    };

    return {
      row1: multiplyItems(group1, 8),
      row2: multiplyItems(group2, 8),
    };
  };

  const { row1, row2 } = prepareRows();

  return (
    <section
      id="notes"
      className="relative w-full overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 transition-colors duration-700"
      style={{
        backgroundColor: "var(--notes-bg, #FFFFFF)",
      }}
    >
      <div className="container-narrow px-4 sm:px-6 md:px-8 mb-10 sm:mb-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-sm uppercase tracking-widest text-current/50 flex items-center gap-2">
                <MessageSquareHeart className="w-4 h-4 text-rose-500 shrink-0" />
                COMMUNITY GUESTBOOK
              </span>

              {/* Live Visit Count Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-current/10 text-xs font-mono text-current/70">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>
                  {visitCount ? (
                    <>
                      <strong className="text-current font-semibold">{visitCount.toLocaleString()}</strong> visitors
                    </>
                  ) : (
                    "Live"
                  )}
                </span>
              </div>
            </div>

            <h2 className="heading-2 mt-1 text-current">
              BEFORE YOU LEAVE, LEAVE A NOTE
            </h2>

            <p className="body-large max-w-2xl mt-3 text-current/55">
              Drop a thought, feedback, or say hello. Pick a pastel card and leave your mark on the wall before you go.
            </p>
          </div>

          {/* Top Right Action Button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <PenSquare className="w-4 h-4 text-amber-300" />
              <span>Write a note</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2 Infinite Scrolling Rows Container */}
      <div className="relative w-full overflow-hidden space-y-6 sm:space-y-8 py-3">
        {/* Soft edge gradient masks for smooth fade-in and fade-out */}
        <div
          className="absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[var(--notes-bg,#FFFFFF)] to-transparent pointer-events-none z-30"
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[var(--notes-bg,#FFFFFF)] to-transparent pointer-events-none z-30"
          aria-hidden="true"
        />

        {/* ROW 1: Infinite Scrolling to the LEFT */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-left flex items-center gap-6 sm:gap-7 py-4 px-3">
            {row1.map((item, idx) =>
              item === "prompt" ? (
                <PromptCard key={`row1-prompt-${idx}`} onClick={() => setIsModalOpen(true)} />
              ) : (
                <NoteCard key={`row1-note-${item.id}-${idx}`} note={item} index={idx} />
              )
            )}
          </div>
        </div>

        {/* ROW 2: Infinite Scrolling to the RIGHT */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-right flex items-center gap-6 sm:gap-7 py-4 px-3">
            {row2.map((item, idx) =>
              item === "prompt" ? (
                <PromptCard key={`row2-prompt-${idx}`} onClick={() => setIsModalOpen(true)} />
              ) : (
                <NoteCard key={`row2-note-${item.id}-${idx}`} note={item} index={idx + 1} />
              )
            )}
          </div>
        </div>
      </div>

      {/* Write Note Modal */}
      <WriteNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNoteAdded={handleNoteAdded}
      />
    </section>
  );
}
