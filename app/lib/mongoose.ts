import mongoose from "mongoose";

// Cached connection across hot reloads in dev and across route invocations
declare global {
  // eslint-disable-next-line no-var
  var mongooseConn:
    | { promise: Promise<typeof mongoose> | null; conn: typeof mongoose | null }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI as string | undefined;

if (!global.mongooseConn) {
  global.mongooseConn = { promise: null, conn: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (global.mongooseConn?.conn) return global.mongooseConn.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Please set it in environment variables.",
    );
  }

  if (!global.mongooseConn?.promise) {
    const opts: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };
    global.mongooseConn!.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => m);
  }

  global.mongooseConn!.conn = await global.mongooseConn!.promise!;
  return global.mongooseConn!.conn!;
}
