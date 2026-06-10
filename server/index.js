import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import mongoose from 'mongoose';
import Campaign from './models/campaign.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PORT = process.env.PORT || 3001;
const distDir = path.join(ROOT, 'dist');

/* ---- MongoDB connection ---- */
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('   MongoDB: ✓ เชื่อมต่อแล้ว'))
    .catch(e => console.error('   MongoDB: ✗', e.message));
} else {
  console.log('   MongoDB: ✗ ยังไม่ได้ตั้งค่า MONGODB_URI');
}

const app = express();
app.use(cors());
app.use(express.json());

/* ---- Load agent system prompts from .claude/agents/*.md ---- */
function loadPrompt(agentId) {
  const file = path.join(ROOT, '.claude', 'agents', `${agentId}.md`);
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    const parts = raw.split(/^---\s*$/m);
    return (parts.length >= 3 ? parts.slice(2).join('---') : raw).trim();
  } catch {
    return `You are a specialist AI agent for affiliate marketing. Your specialty is ${agentId}.`;
  }
}

/* ---- Build task message from campaign context ---- */
function buildUserMessage({ stepLabel, campaignTitle, product, previousOutputs }) {
  let msg = `## แคมเปญ\nชื่อ: ${campaignTitle}\nสินค้า: ${product || '(ไม่ระบุ)'}`;
  if (previousOutputs?.length > 0) {
    msg += '\n\n## ผลลัพธ์จากด่านก่อนหน้า\n';
    for (const { stepLabel: sl, output } of previousOutputs) {
      msg += `\n### ${sl}\n${output}\n`;
    }
  }
  msg += `\n\n## ภารกิจของคุณในด่านนี้\n${stepLabel}\n\nดำเนินการและส่งผลลัพธ์ตามรูปแบบที่กำหนดในระบบ`;
  return msg;
}

/* ---- Health check ---- */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: !!process.env.ANTHROPIC_API_KEY, hasDb: !!process.env.MONGODB_URI });
});

/* ---- Campaigns CRUD ---- */
app.get('/api/campaigns', async (_req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean();
    res.json(campaigns);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.json(campaign);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { id: req.params.id }, req.body, { new: true, lean: true }
    );
    res.json(campaign);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    await Campaign.findOneAndDelete({ id: req.params.id });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---- Run a campaign step (SSE stream) ---- */
app.post('/api/run-step', async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(400).json({ error: 'ANTHROPIC_API_KEY ยังไม่ได้ตั้งค่า' });
    return;
  }

  const { agentId, stepLabel, campaignTitle, product, previousOutputs } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const send = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    if (typeof res.flush === 'function') res.flush();
  };

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const systemPrompt = loadPrompt(agentId);
    const userMessage = buildUserMessage({ stepLabel, campaignTitle, product, previousOutputs });

    const model = agentId === 'marshal' ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001';
    const stream = client.messages.stream({
      model,
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    stream.on('text', (text) => send({ text }));
    await stream.finalMessage();
    send({ done: true });
  } catch (err) {
    send({ error: err.message || String(err) });
  }

  res.end();
});

// Serve built React frontend
app.use(express.static(distDir));
app.use((_req, res) => res.sendFile(path.join(distDir, 'index.html')));

app.listen(PORT, () => {
  const keyStatus = process.env.ANTHROPIC_API_KEY ? '✓ พร้อมใช้งาน' : '✗ ยังไม่ได้ตั้งค่า';
  console.log(`\n🏮 ยุทธจักร OS · Agent Server`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   API Key: ${keyStatus}\n`);
});
