import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongoose";
import { DriftLogModel } from "../../../../lib/models/DriftLog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    await connectToDatabase();

    const docs = await DriftLogModel.find({ userId })
      .sort({ created_at: 1 })
      .lean()
      .exec();

    const entries = docs.map((d) => ({
      ...d,
      user_id: d.userId,
      created_at: new Date(d.created_at).toISOString(),
    }));

    return NextResponse.json({ entries });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to load drift logs", details: err?.message || String(err) },
      { status: 500 },
    );
  }
}
