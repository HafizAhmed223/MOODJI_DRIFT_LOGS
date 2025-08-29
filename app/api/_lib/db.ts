import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || "test";

if (!MONGODB_URI) {
  // We throw a descriptive error only when a connection is attempted
  // so the app can still build without env configured.
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
  return process.env.MONGODB_COLLECTION || "resonance_drift_log";
}
