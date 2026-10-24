import { MongoClient, Db } from "mongodb";
import dns from "dns";
import { GuestbookNote, NoteColor, ALLOWED_NOTE_COLORS } from "./guestbook-types";

// Fix for Windows / ISP DNS blocking MongoDB SRV queries (querySrv ECONNREFUSED)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // Ignored in environments where setServers is restricted
}

export type { GuestbookNote, NoteColor };
export { ALLOWED_NOTE_COLORS };

// ---------------------------------------------------------------------------
// MongoDB Client Connection (Singleton Pattern for Next.js / Serverless)
// ---------------------------------------------------------------------------
function resolveMongoUri(rawUri: string): string {
  // If user provides mongodb+srv for cluster0.mtupg1c.mongodb.net,
  // resolve to direct replicaSet nodes to bypass Windows / ISP DNS SRV blocking (ECONNREFUSED)
  if (rawUri.startsWith("mongodb+srv://") && rawUri.includes("cluster0.mtupg1c.mongodb.net")) {
    const credsAndRest = rawUri.slice("mongodb+srv://".length);
    const credentials = credsAndRest.split("@")[0];
    return `mongodb://${credentials}@ac-6d3djsk-shard-00-00.mtupg1c.mongodb.net:27017,ac-6d3djsk-shard-00-01.mtupg1c.mongodb.net:27017,ac-6d3djsk-shard-00-02.mtupg1c.mongodb.net:27017/developer-portfolio?ssl=true&replicaSet=atlas-x620k3-shard-0&authSource=admin`;
  }
  return rawUri;
}

const rawUri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.MONGODB_URL ||
  process.env.DATABASE_URL ||
  "mongodb://localhost:27017/";

const uri = resolveMongoUri(rawUri);

const dbName = process.env.MONGODB_DB_NAME || "developer-portfolio";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

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

/**
 * Get connected MongoDB database instance.
 */
export async function getMongoDb(): Promise<Db> {
  if (!clientPromise) {
    throw new Error("MongoDB client is not initialized.");
  }
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

// ---------------------------------------------------------------------------
// Public Operations: Visits & Telemetry (Pure MongoDB)
// ---------------------------------------------------------------------------

/**
 * Get current aggregate visit count from MongoDB.
 */
export async function getVisitCount(): Promise<number> {
  try {
    const db = await getMongoDb();
    const doc = await db.collection("visits").findOne({ _id: "site_visits" as unknown as undefined });
    if (doc && typeof doc.count === "number") {
      return doc.count;
    }
    // Baseline seed on fresh database initialization
    const initialCount = 1420;
    await db.collection("visits").updateOne(
      { _id: "site_visits" as unknown as undefined },
      { $setOnInsert: { count: initialCount, updatedAt: new Date() } },
      { upsert: true }
    );
    return initialCount;
  } catch (err) {
    console.error("Error fetching visit count from MongoDB:", err);
    return 1420;
  }
}

/**
 * Atomically increment visit count and record rich visitor telemetry in MongoDB.
 */
export async function recordVisit(telemetry?: Record<string, unknown>): Promise<number> {
  try {
    const db = await getMongoDb();

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
    return 1421;
  } catch (err) {
    console.error("Error recording visit in MongoDB:", err);
    return await getVisitCount();
  }
}

// ---------------------------------------------------------------------------
// Public Operations: Guestbook Notes (Pure MongoDB)
// ---------------------------------------------------------------------------

/**
 * Get all real notes from MongoDB, ordered newest first.
 * NOTE: Strips private fields (email and raw IP) to protect visitor privacy.
 */
export async function getNotes(): Promise<GuestbookNote[]> {
  try {
    const db = await getMongoDb();
    const docs = await db
      .collection("notes")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return docs.map((doc) => ({
      id: doc.id || String(doc._id),
      name: doc.name,
      company: doc.company,
      role: doc.role,
      message: doc.message,
      color: doc.color,
      avatar: doc.avatar,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      // doc.email and doc.telemetry.ip are strictly omitted from public return
    }));
  } catch (err) {
    console.error("Error fetching notes from MongoDB:", err);
    return [];
  }
}

/**
 * Add a new real note directly to MongoDB with rich author and telemetry data.
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
  await db.collection("notes").insertOne({
    ...newNote,
    createdAt: new Date(newNote.createdAt),
  });

  // Return note with private email stripped for client response
  const { email, telemetry, ...clientSafeNote } = newNote;
  void email;
  void telemetry;
  return clientSafeNote as GuestbookNote;
}
