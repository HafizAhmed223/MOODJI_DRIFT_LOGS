import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || "test";

if (!MONGODB_URI) {
  console.warn(
    "MONGODB_URI is not set. API routes depending on MongoDB will fail until it's provided.",
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached!.conn) return cached!.conn;
  if (!cached!.promise) {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    cached!.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DBNAME,
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => m);
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export function getCollectionName() {
  return process.env.MONGODB_COLLECTION || "resonannce_drift_log";
}

export async function getResolvedCollection() {
  await connectToDatabase();
  const db = mongoose.connection.db;
  const preferred = getCollectionName();

  try {
    const cursor = db.listCollections({ name: preferred });
    const exists = await cursor.hasNext();
    if (exists) {
      return db.collection(preferred);
    }
  } catch (e) {
    console.error("listCollections check failed:", e);
  }

  try {
    const all = await db.listCollections().toArray();
    const match = all.find(
      (c) => /resonan.*drift.*log/i.test(c.name) || /drift.*log/i.test(c.name),
    );
    if (match) {
      console.warn(
        `Using fallback collection resolved from pattern: ${match.name} (preferred was ${preferred})`,
      );
      return db.collection(match.name);
    }
  } catch (e) {
    console.error("listCollections enumerate failed:", e);
  }

  console.warn(
    `Falling back to preferred collection name even if not found: ${preferred}`,
  );
  return db.collection(preferred);
}
