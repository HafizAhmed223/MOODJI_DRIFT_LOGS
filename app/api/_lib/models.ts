import { Schema, models, model, type Model } from "mongoose";
import { getCollectionName } from "./db";

// Drift Log Schema (strictly matching requested structure)
const FieldSchema = new Schema(
  {
    name: { type: String, required: true },
    hz: { type: Number, required: true },
  },
  { _id: false },
);

const EquationSchema = new Schema(
  {
    formula: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const CreationSchema = new Schema(
  {
    input_desire: { type: String, required: true },
    mood_label: { type: String, required: true },
    conflict_intensity: { type: Number, required: true },
    field: { type: FieldSchema, required: true },
    bloom_phase: { type: Number, required: true },
    bloom_petal: { type: String, required: true },
    equation: { type: EquationSchema, required: true },
  },
  { _id: false },
);

const LawPortionSchema = new Schema(
  {
    status: { type: String, required: true },
    rules_applied: { type: [String], required: true },
    contract_scan: { type: String, required: true },
  },
  { _id: false },
);

const BloomRenderSchema = new Schema(
  {
    petal: { type: String, required: true },
    animation: { type: String, required: true },
  },
  { _id: false },
);

const CelestiumMappingSchema = new Schema(
  {
    constellation: { type: String, required: true },
  },
  { _id: false },
);

const MirrorDnaSchema = new Schema(
  {
    dna_string: { type: String, required: true },
  },
  { _id: false },
);

const DriftLogSchema = new Schema(
  {
    id: { type: String, required: true, index: true },
    userId: { type: String, required: false, index: true, alias: "user_id" },
    user_id: { type: String, required: false, index: true },
    created_at: { type: Schema.Types.Mixed, required: true, index: true },
    final_payload: { type: Boolean, required: true },
    creation: { type: CreationSchema, required: true },
    law_portion: { type: LawPortionSchema, required: true },
    bloom_render: { type: BloomRenderSchema, required: true },
    celestium_mapping: { type: CelestiumMappingSchema, required: true },
    mirror_dna: { type: MirrorDnaSchema, required: true },
  },
  {
    versionKey: false,
    collection: getCollectionName(),
    strict: false,
  },
);

export const DriftLog: Model<any> =
  (models.DriftLog as Model<any>) ||
  model<any>("DriftLog", DriftLogSchema, getCollectionName());
