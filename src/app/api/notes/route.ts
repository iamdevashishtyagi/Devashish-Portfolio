import { NextResponse } from "next/server";
import { getNotes, addNote, ALLOWED_NOTE_COLORS, NoteColor } from "@/src/app/lib/db";
import {
  hashIdentifier,
  checkRateLimit,
  sanitizeText,
  isSpam,
  isValidEmail,
  extractServerTelemetry,
} from "@/src/app/lib/security";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const notes = await getNotes();
    return NextResponse.json({ notes });
  } catch (err) {
    console.error("Failed to get notes:", err);
    return NextResponse.json({ error: "Could not load notes", notes: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const serverTelemetry = extractServerTelemetry(req);
    const ip = serverTelemetry.ip;
    const ipHash = hashIdentifier(ip);

    // Rate limit: Max 3 notes per IP per 10 minutes
    const rateLimit = checkRateLimit(`note_${ipHash}`, 3, 600);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "You've shared multiple notes recently. Please wait a few minutes before adding another!" },
        { status: 429 }
      );
    }

    const body = await req.json();
    let { name, company, role, email, message, color, avatar, telemetry } = body;

    // Sanitize inputs
    name = sanitizeText(name || "").slice(0, 45);
    company = sanitizeText(company || "").slice(0, 60);
    role = sanitizeText(role || "").slice(0, 60);
    email = (email || "").trim().slice(0, 100);
    message = sanitizeText(message || "").slice(0, 200); // 200 char max limit

    // Validate email format if provided (optional)
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address, or leave it blank." },
        { status: 400 }
      );
    }

    // Default name if blank
    if (!name.trim()) {
      name = "Anonymous Visitor";
    }

    // Validate message
    if (!message || message.trim().length < 3) {
      return NextResponse.json(
        { error: "Please write at least a few words in your note." },
        { status: 400 }
      );
    }

    // Check spam
    if (isSpam(message) || isSpam(name) || isSpam(company)) {
      return NextResponse.json(
        { error: "Note could not be accepted due to spam filtering." },
        { status: 400 }
      );
    }

    // Validate color against allowed pastel palette
    const colorValid = ALLOWED_NOTE_COLORS.includes(color as NoteColor);
    const finalColor: NoteColor = colorValid ? (color as NoteColor) : ALLOWED_NOTE_COLORS[0];

    // Validate avatar string (either safe data URL under 250KB or preset id)
    let sanitizedAvatar: string | undefined = undefined;
    if (typeof avatar === "string") {
      if (avatar.startsWith("data:image/") && avatar.length < 250000) {
        sanitizedAvatar = avatar;
      } else if (/^[a-zA-Z0-9_-]{1,30}$/.test(avatar)) {
        sanitizedAvatar = avatar;
      }
    }

    // Combine full telemetry for Devashish's private records
    const noteTelemetry = {
      ...serverTelemetry,
      ...(typeof telemetry === "object" ? telemetry : {}),
      ipHash,
    };

    // Save note to database
    const createdNote = await addNote({
      name: name.trim(),
      company: company.trim() || undefined,
      role: role.trim() || undefined,
      email: email ? email.trim() : undefined, // ONLY for Devashish, never exposed publicly
      message: message.trim(),
      color: finalColor,
      avatar: sanitizedAvatar,
      ipHash,
      telemetry: noteTelemetry,
    });

    return NextResponse.json({ success: true, note: createdNote }, { status: 201 });
  } catch (err) {
    console.error("Error creating note:", err);
    return NextResponse.json({ error: "Something went wrong while saving your note." }, { status: 500 });
  }
}
