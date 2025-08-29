import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../_lib/db";
import { DriftLog } from "../../../_lib/models";

export async function GET(_req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectToDatabase();

    const userId = params.userId;
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const logs = await DriftLog.find({ userId }).sort({ created_at: 1 }).lean();
    if (!logs || logs.length === 0) {
      return NextResponse.json({ error: "User not found or no drift logs" }, { status: 404 });
    }

    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error(`/api/users/${params.userId}/drift-logs error:`, err);
    const message = err?.message || "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
