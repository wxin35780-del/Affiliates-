import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  label: String,
  agent: String,
  state: { type: String, default: 'queued' },
  t: String,
  th: String,
  out: { type: String, default: '—' },
  fullOutput: { type: String, default: null },
}, { _id: false });

const campaignSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  product: String,
  code: String,
  cjk: String,
  started: String,
  eta: String,
  status: { type: String, default: 'active' },
  steps: [stepSchema],
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);
