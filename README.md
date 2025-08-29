# Moodji Dashboard – Next.js + MongoDB

This project adds a MongoDB-backed API to the existing Next.js Moodji Dashboard while preserving the original UI/UX.

## Requirements
- Node.js 18+
- MongoDB URI (Atlas or self-hosted)

## Environment Variables
Create a `.env.local` in the project root with:

```
MONGODB_URI=your_mongodb_connection_string_here
```

(If you need an example file, create `.env.example` with the same line.)

## Install & Run
```
pnpm install
pnpm dev
```

## API Endpoints
- GET `/api/users?page=1&limit=20`
  - Returns paginated user summaries with the latest entry:
  - Response:
    ```json
    {
      "users": [
        {
          "user_id": "user_123",
          "latest_entry": { /* Drift log document, with user_id and ISO date */ },
          "total_entries": 8,
          "journey_completion": 50,
          "latest_mood": "Curious",
          "last_activity": "2024-01-01T12:00:00.000Z",
          "constellation": "Orion",
          "status": "progressing"
        }
      ],
      "page": 1,
      "limit": 20,
      "total": 100
    }
    ```

- GET `/api/users/:userId/drift-logs`
  - Returns all drift logs for the given user, sorted by `created_at` ascending.
  - Response:
    ```json
    { "entries": [ { /* DriftLog */ } ] }
    ```

## Data Model
Mongoose model: `app/lib/models/DriftLog.ts`
Collection: `resonance_drift_log`

```ts
interface DriftLogDoc {
  id: string;
  userId: string;        // links logs to users
  created_at: Date;
  final_payload: boolean;
  creation: {
    input_desire: string;
    mood_label: string;
    conflict_intensity: number;
    field: { name: string; hz: number };
    bloom_phase: number;
    bloom_petal: string;
    equation: { formula: string; description: string };
  };
  law_portion: { status: string; rules_applied: string[]; contract_scan: string };
  bloom_render: { petal: string; animation: string };
  celestium_mapping: { constellation: string };
  mirror_dna: { dna_string: string };
}
```

## Notes
- Backend lives in `app/api/*` and uses `app/lib/mongoose.ts` for connection.
- Frontend pages now fetch from these APIs and include loading/error states.
- On Vercel, add `MONGODB_URI` in Project Settings → Environment Variables, then redeploy.
