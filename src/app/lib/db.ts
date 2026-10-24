import { MongoClient, Db } from "mongodb";
import fs from "fs";
import path from "path";

import {
  GuestbookNote,
  VisitData,
  NoteColor,
  ALLOWED_NOTE_COLORS,
  INITIAL_SEED_NOTES,
} from "./guestbook-types";

export type { GuestbookNote, VisitData, NoteColor };
export { ALLOWED_NOTE_COLORS, INITIAL_SEED_NOTES };

// ---------------------------------------------------------------------------
// Local File Fallback Storage (Used when MongoDB URI is not provided)
// ---------------------------------------------------------------------------
const LOCAL_STORAGE_DIR = path.join(process.cwd(), ".data");
const LOCAL_STORAGE_FILE = path.join(LOCAL_STORAGE_DIR, "guestbook-storage.json");

interface LocalStoreData {
  visitCount: number;
  visitLogs?: Record<string, unknown>[];
  notes: GuestbookNote[];
}

function getLocalStore(): LocalStoreData {
  try {
    if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
      fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    }
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const raw = fs.readFileSync(LOCAL_STORAGE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Could not read local JSON store:", err);
  }
  return {
    visitCount: 1420,
    visitLogs: [],
    notes: INITIAL_SEED_NOTES,
  };
}

function saveLocalStore(data: LocalStoreData) {
  try {
    if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
      fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write to local JSON store:", err);
  }
}

// ---------------------------------------------------------------------------
// MongoDB Client Connection (Singleton Pattern for Next.js / Serverless)
// ---------------------------------------------------------------------------
// Supports MONGODB_URI, MONGO_URI, MONGODB_URL, or DATABASE_URL
const uri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.MONGODB_URL ||
  process.env.DATABASE_URL;

const dbName = process.env.MONGODB_DB_NAME || "portfolio";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    clientPromise = client.connect();
  }
}

export async function getMongoDb(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
  } catch (err) {
    console.warn("MongoDB connection failed, falling back to local store:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public Operations: Visits & Telemetry
// ---------------------------------------------------------------------------

/**
 * Get current aggregate visit count.
 */
export async function getVisitCount(): Promise<number> {
  const db = await getMongoDb();
  if (db) {
    try {
      const doc = await db.collection("visits").findOne({ _id: "site_visits" as unknown as undefined });
      if (doc && typeof doc.count === "number") {
        return doc.count;
      }
      // If collection exists but is empty, seed with initial baseline
      const initialCount = 1420;
      await db.collection("visits").updateOne(
        { _id: "site_visits" as unknown as undefined },
        { $setOnInsert: { count: initialCount, updatedAt: new Date() } },
        { upsert: true }
      );
      return initialCount;
    } catch (err) {
      console.error("Error fetching visit count from MongoDB:", err);
    }
  }

  // Fallback
  const local = getLocalStore();
  return local.visitCount;
}

/**
 * Increment visit count atomically and record rich visitor telemetry.
 */
export async function recordVisit(telemetry?: Record<string, unknown>): Promise<number> {
  const db = await getMongoDb();
  if (db) {
    try {
      // 1. Record detailed telemetry in visit_logs collection
      if (telemetry) {
        await db.collection("visit_logs").insertOne({
          ...telemetry,
          timestamp: new Date(),
        });
      }

      // 2. Increment global counter atomically
      const res = await db.collection("visits").findOneAndUpdate(
        { _id: "site_visits" as unknown as undefined },
        {
          $inc: { count: 1 },
          $set: { updatedAt: new Date() },
        },
        { upsert: true, returnDocument: "after" }
      );
      if (res && typeof res.count === "number") {
        return res.count;
      }
    } catch (err) {
      console.error("Error recording visit in MongoDB:", err);
    }
  }

  // Fallback
  const local = getLocalStore();
  local.visitCount += 1;
  if (telemetry) {
    if (!local.visitLogs) local.visitLogs = [];
    local.visitLogs.unshift({ ...telemetry, timestamp: new Date().toISOString() });
    if (local.visitLogs.length > 200) local.visitLogs.pop();
  }
  saveLocalStore(local);
  return local.visitCount;
}

// ---------------------------------------------------------------------------
// Public Operations: Guestbook Notes
// ---------------------------------------------------------------------------

/**
 * Get all notes, ordered newest first.
 * NOTE: Strips private fields (email and raw IP) to protect visitor privacy.
 */
export async function getNotes(): Promise<GuestbookNote[]> {
  const db = await getMongoDb();
  if (db) {
    try {
      const docs = await db
        .collection("notes")
        .find({})
        .sort({ createdAt: -1 })
        .limit(60)
        .toArray();

      if (docs.length > 0) {
        return docs.map((doc) => ({
          id: doc.id || String(doc._id),
          name: doc.name,
          company: doc.company,
          role: doc.role,
          message: doc.message,
          color: doc.color,
          avatar: doc.avatar,
          createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
          // Notice: doc.email is strictly omitted from public return
        }));
      }

      // If empty in MongoDB, seed initial notes
      const seedInserts = INITIAL_SEED_NOTES.map((note) => ({
        ...note,
        createdAt: new Date(note.createdAt),
      }));
      await db.collection("notes").insertMany(seedInserts);
      return INITIAL_SEED_NOTES;
    } catch (err) {
      console.error("Error fetching notes from MongoDB:", err);
    }
  }

  // Fallback
  const local = getLocalStore();
  return local.notes.map(({ email, telemetry, ...publicFields }) => {
    void email;
    void telemetry;
    return publicFields as GuestbookNote;
  });
}

/**
 * Add a new note to the database with rich author and telemetry data.
 */
export async function addNote(note: {
  name: string;
  company?: string;
  role?: string;
  email?: string;
  message: string;
  color: string;
  avatar?: string;
  ipHash?: string;
  telemetry?: Record<string, unknown>;
}): Promise<GuestbookNote> {
  const newNote: GuestbookNote = {
    ...note,
    id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection("notes").insertOne({
        ...newNote,
        createdAt: new Date(newNote.createdAt),
      });
      // Return note with email omitted for client safety
      const { email, telemetry, ...clientSafeNote } = newNote;
      void email;
      void telemetry;
      return clientSafeNote as GuestbookNote;
    } catch (err) {
      console.error("Error saving note to MongoDB:", err);
    }
  }

  // Fallback
  const local = getLocalStore();
  local.notes = [newNote, ...local.notes];
  saveLocalStore(local);

  const { email, telemetry, ...clientSafeNote } = newNote;
  void email;
  void telemetry;
  return clientSafeNote as GuestbookNote;
}
