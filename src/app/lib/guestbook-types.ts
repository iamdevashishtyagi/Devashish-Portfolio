// Types for Guestbook Notes & Visits
export interface GuestbookNote {
  id: string;
  name: string;
  company?: string;      // "Where do you work?"
  role?: string;         // "Your role / Designation"
  email?: string;        // "Email - only I'll see this" (HIDDEN from public API, stored in MongoDB for Devashish only)
  message: string;       // max 200 characters
  color: string;         // pastel hex
  avatar?: string;       // preset ID ("dev", "designer", etc.) or data URL / photo URL
  createdAt: string;
  ipHash?: string;
  telemetry?: Record<string, unknown>;
}

export interface VisitData {
  count: number;
  updatedAt: string;
}

// User-specified pastel palette for notes
export const ALLOWED_NOTE_COLORS = [
  "#C9EBD2", // soft mint
  "#FFD1C4", // warm blush
  "#FFE0B8", // apricot peach
  "#CFE7FF", // sky pastel blue
  "#FFE98A", // buttercup yellow
  "#D9CCFF", // soft lavender
] as const;

export type NoteColor = (typeof ALLOWED_NOTE_COLORS)[number];

// Initial welcoming notes for initial load
export const INITIAL_SEED_NOTES: GuestbookNote[] = [
  {
    id: "seed-1",
    name: "Aman Sharma",
    company: "Stealth AI",
    role: "Founding Engineer",
    message: "Loved the clean aesthetic and smooth animations. Especially the physics in the hero section! Keep building.",
    color: "#C9EBD2",
    avatar: "dev",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "seed-2",
    name: "Sarah Lin",
    company: "Figma Studio",
    role: "Product Designer",
    message: "The storytelling throughout 'The Ascent' is inspiring. Great attention to typography, micro-interactions, and pacing.",
    color: "#FFD1C4",
    avatar: "designer",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "seed-3",
    name: "Vikram R.",
    company: "Fintech Labs",
    role: "Full Stack Dev",
    message: "Checked out your Italian Invoice Converter project. Clean compliance logic and solid distributed architecture!",
    color: "#FFE0B8",
    avatar: "builder",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "seed-4",
    name: "Elena Rostova",
    company: "Vector Research",
    role: "AI Researcher",
    message: "The tenant-isolated RAG architecture is spot on. Great work on retrieval chunking pipelines and latency optimization.",
    color: "#CFE7FF",
    avatar: "robot",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "seed-5",
    name: "Anonymous Visitor",
    company: "Indie Hacker",
    role: "Fellow Builder",
    message: "One of the slickest portfolios I've seen in a while. Wishing you huge success in your next chapter!",
    color: "#FFE98A",
    avatar: "spark",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
];
