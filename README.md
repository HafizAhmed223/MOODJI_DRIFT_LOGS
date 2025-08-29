# Moodji Dashboard (Next.js + MongoDB)

This project extends the existing Moodji Dashboard by adding a backend using Next.js API Routes with MongoDB (Mongoose). The frontend UI/UX remains unchanged and now fetches live data from the backend APIs.

## Tech Stack

- Next.js (App Router) for frontend and API routes
- MongoDB with Mongoose
- TailwindCSS and shadcn/ui components

## Getting Started

1. Copy `.env.example` to `.env` and fill in values:

```
MONGODB_URI=your-mongodb-connection-string
MONGODB_DBNAME=test
MONGODB_COLLECTION=resonance_drift_log
```

2. Install dependencies and run the dev server:

```
pnpm install
pnpm dev
```

3. Open http://localhost:3000 to view the app.

## API Endpoints

- GET `/api/users` (query: `page`, `limit`)
  - Returns a paginated list of users with latest mood, constellation, last activity, progress metrics, and status.
  - Example: `/api/users?page=1&limit=20`

- GET `/api/users/:userId/drift-logs`
  - Returns all drift logs for `userId` ordered by `created_at` (oldest → newest).

## Schema (MongoDB)

Each document in the collection matches this structure:

```
{
  "id": "string",
  "userId": "string",
  "created_at": "datetime",
  "final_payload": "boolean",
  "creation": {
    "input_desire": "string",
    "mood_label": "string",
    "conflict_intensity": "float",
    "field": { "name": "string", "hz": "float" },
    "bloom_phase": "integer",
    "bloom_petal": "string",
    "equation": { "formula": "string", "description": "string" }
  },
  "law_portion": {
    "status": "string",
    "rules_applied": "array",
    "contract_scan": "string"
  },
  "bloom_render": {
    "petal": "string",
    "animation": "string"
  },
  "celestium_mapping": {
    "constellation": "string"
  },
  "mirror_dna": {
    "dna_string": "string"
  }
}
```

## Notes

- The collection name defaults to `resonance_drift_log`. Override via `MONGODB_COLLECTION` if different.
- The database name defaults to `test`. Override via `MONGODB_DBNAME` if needed.
- Environment variables are required for the backend endpoints to work.
