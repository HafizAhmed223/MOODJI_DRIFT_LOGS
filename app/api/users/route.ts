import { NextRequest } from "next/server";
import { connectToDatabase } from "../_lib/db";
import { DriftLog } from "../_lib/models";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "20", 10), 1),
      100,
    );
    const skip = (page - 1) * limit;

    // Aggregate distinct users with latest entry and stats
    const results = await DriftLog.aggregate([
      { $addFields: { userKey: { $ifNull: ["$userId", "$user_id"] } } },
      { $match: { userKey: { $type: "string", $ne: "" } } },
      { $sort: { created_at: -1 } },
      {
        $group: {
          _id: "$userKey",
          latest: { $first: "$$ROOT" },
          totalEntries: { $sum: 1 },
          completedEntries: { $sum: { $cond: ["$final_payload", 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          latest_mood: "$latest.creation.mood_label",
          constellation: "$latest.celestium_mapping.constellation",
          last_activity: "$latest.created_at",
          status: "$latest.law_portion.status",
          total_entries: "$totalEntries",
          journey_completion: {
            $cond: [
              { $gt: ["$totalEntries", 0] },
              {
                $multiply: [
                  { $divide: ["$completedEntries", "$totalEntries"] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { userId: 1 } },
      {
        $facet: {
          results: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]).allowDiskUse(true);

    const users = results?.[0]?.results || [];
    const total = results?.[0]?.totalCount?.[0]?.count || 0;
    return Response.json({
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error("/api/users error:", err);
    const message = err?.message || "Unknown server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
