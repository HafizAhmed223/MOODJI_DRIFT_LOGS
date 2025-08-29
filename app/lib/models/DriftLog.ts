import { Schema, model, models } from "mongoose";

export interface DriftLogDoc {
  id: string;
  userId: string;
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
  law_portion: {
    status: string;
    rules_applied: string[];
    contract_scan: string;
  };
  bloom_render: {
    petal: string;
    animation: string;
  };
  celestium_mapping: {
    constellation: string;
  };
  mirror_dna: {
    dna_string: string;
  };
}

const DriftLogSchema = new Schema<DriftLogDoc>(
  {
    id: { type: String, required: true, index: true, unique: true },
    userId: { type: String, required: true, index: true },
    created_at: { type: Date, required: true, index: true },
    final_payload: { type: Boolean, required: true },
    creation: {
      input_desire: { type: String, required: true },
      mood_label: { type: String, required: true },
      conflict_intensity: { type: Number, required: true },
      field: {
        name: { type: String, required: true },
        hz: { type: Number, required: true },
      },
      bloom_phase: { type: Number, required: true },
      bloom_petal: { type: String, required: true },
      equation: {
        formula: { type: String, required: true },
        description: { type: String, required: true },
      },
    },
    law_portion: {
      status: { type: String, required: true },
      rules_applied: { type: [String], required: true },
      contract_scan: { type: String, required: true },
    },
    bloom_render: {
      petal: { type: String, required: true },
      animation: { type: String, required: true },
    },
    celestium_mapping: {
      constellation: { type: String, required: true },
    },
    mirror_dna: {
      dna_string: { type: String, required: true },
    },
  },
  { timestamps: false, versionKey: false, collection: "resonance_drift_log" },
);

export const DriftLogModel =
  models.DriftLog || model<DriftLogDoc>("DriftLog", DriftLogSchema);
