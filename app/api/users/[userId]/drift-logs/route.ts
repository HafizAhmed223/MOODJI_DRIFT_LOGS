import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongoose";
import { DriftLogModel } from "../../../../lib/models/DriftLog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = params;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "'userId' is required" } },
        { status: 400 },
      );
    }

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
      {
        error: { code: "INTERNAL_ERROR", message: "Failed to load drift logs" },
      },
      { status: 500 },
    );
  }
}
