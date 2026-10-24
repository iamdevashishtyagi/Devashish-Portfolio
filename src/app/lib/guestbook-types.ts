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

