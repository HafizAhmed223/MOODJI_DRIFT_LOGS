import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, getResolvedCollection } from "../../../_lib/db";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    await connectToDatabase();

    const { userId } = await context.params;
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const col = await getResolvedCollection();

    const logs = await col
      .find({ $or: [{ userId }, { user_id: userId }] })
      .sort({ created_at: 1 })
      .toArray();

    if (!logs || logs.length === 0) {
      console.warn(
        `[drift-logs] No logs for userId="${userId}" in collection "${col.collectionName}"`,
      );
      return NextResponse.json(
        { error: "User not found or no drift logs" },
        { status: 404 },
      );
    }

    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error("/api/users/[userId]/drift-logs error:", err);
    const message = err?.message || "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
