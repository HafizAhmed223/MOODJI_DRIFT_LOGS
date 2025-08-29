import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongoose";
import { DriftLogModel } from "../../lib/models/DriftLog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseIntOrDefault(value: string | null, def: number) {
  const n = Number.parseInt(value || "", 10);
  return Number.isFinite(n) && n > 0 ? n : def;
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseIntOrDefault(searchParams.get("page"), 1);
    const limit = parseIntOrDefault(searchParams.get("limit"), 20);
    const skip = (page - 1) * limit;

    const totalUsersAgg = await DriftLogModel.aggregate([
      { $group: { _id: "$userId" } },
      { $count: "count" },
    ]);
    const total = totalUsersAgg[0]?.count || 0;

    const users = await DriftLogModel.aggregate([
      { $sort: { created_at: -1 } },
      {
        $group: {
          _id: "$userId",
          latest: { $first: "$$ROOT" },
          total_entries: { $sum: 1 },
          completed: {
            $sum: { $cond: ["$final_payload", 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          user_id: "$_id",
          latest_entry: "$latest",
          total_entries: 1,
          journey_completion: {
            $cond: [
              { $eq: ["$total_entries", 0] },
              0,
              { $multiply: [{ $divide: ["$completed", "$total_entries"] }, 100] },
            ],
          },
          latest_mood: "$latest.creation.mood_label",
          last_activity: "$latest.created_at",
          constellation: "$latest.celestium_mapping.constellation",
          status: "$latest.law_portion.status",
        },
      },
      { $sort: { last_activity: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]).exec();

    // Normalize nested latest_entry to have user_id instead of userId
    const normalized = users.map((u: any) => ({
      ...u,
      latest_entry: u.latest_entry
        ? {
            ...u.latest_entry,
            user_id: u.latest_entry.userId,
            created_at: new Date(u.latest_entry.created_at).toISOString(),
          }
        : null,
      last_activity: new Date(u.last_activity).toISOString(),
    }));

    return NextResponse.json({ users: normalized, page, limit, total });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to load users", details: err?.message || String(err) },
      { status: 500 },
    );
  }
}
