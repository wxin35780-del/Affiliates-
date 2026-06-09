/* ====== Frontend API client — streams agent output via SSE ====== */

export async function checkServerHealth() {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return { ok: false, hasKey: false };
  }
}

/**
 * Run an agent step and stream the output.
 * @param {object} opts
 * @param {string} opts.agentId - e.g. 'scout', 'scribe', 'smith'
 * @param {string} opts.stepLabel
 * @param {string} opts.campaignTitle
 * @param {string} opts.product
 * @param {Array}  opts.previousOutputs - [{ stepLabel, output }]
 * @param {function} opts.onChunk  - called with each text chunk
 * @param {function} opts.onDone   - called when stream completes
 * @param {function} opts.onError  - called with error message string
 */
export async function runStep({ agentId, stepLabel, campaignTitle, product, previousOutputs, onChunk, onDone, onError }) {
  let res;
  try {
    res = await fetch('/api/run-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, stepLabel, campaignTitle, product, previousOutputs }),
    });
  } catch {
    onError('ไม่สามารถเชื่อมต่อ server ได้ — ตรวจสอบว่า server กำลังรันอยู่ (npm run dev)');
    return;
  }

  if (!res.ok) {
    try {
      const { error } = await res.json();
      onError(error || `Server error ${res.status}`);
    } catch {
      onError(`Server error ${res.status}`);
    }
    return;
  }

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const payload = JSON.parse(line.slice(6));
        if (payload.text)  onChunk(payload.text);
        if (payload.done)  onDone();
        if (payload.error) onError(payload.error);
      } catch { /* ignore malformed */ }
    }
  }
}
