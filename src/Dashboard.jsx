/* ====== Dashboard + Task ====== */
import React, { useState, useEffect, useRef } from 'react';
import { STATUS, AGENTS } from './data';
import { SectGlyph, StatusBadge, Meter, Btn, DualHead } from './ui';
import { useLiveData } from './hooks';
import { runStep } from './api.js';

function DStatTile({ label, cjk, value, sub, color='var(--gold)' }) {
  return (
    <div className="jh-frame" style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:5, padding:'15px 17px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span className="jh-tag">{label}</span><span className="jh-cjk" style={{ fontSize:15, color, opacity:.55 }}>{cjk}</span>
      </div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:30, color, marginTop:8, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--tx-faint)', marginTop:7 }}>{sub}</div>
    </div>
  );
}

function LiveFeed({ entries }) {
  const endRef = useRef(null);
  const [prevLen, setPrevLen] = useState(entries.length);

  useEffect(() => {
    if (entries.length !== prevLen) {
      endRef.current?.scrollIntoView({ behavior:'smooth', block:'nearest' });
      setPrevLen(entries.length);
    }
  }, [entries.length, prevLen]);

  return (
    <div style={{ display:'flex', flexDirection:'column-reverse', gap:13, maxHeight:220, overflowY:'auto', paddingRight:2 }}
      className="jh-scroll">
      <div ref={endRef} />
      {entries.map((f,i)=>(
        <div key={i} style={{ display:'flex', gap:11, animation: i===0 ? 'fadeIn .4s ease' : 'none' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:10.5, color:'var(--tx-faint)', width:42, flex:'0 0 auto', paddingTop:1, letterSpacing:'.04em' }}>{f.t}</span>
          <span style={{ width:7, height:7, borderRadius:9, background:f.c, marginTop:5, flex:'0 0 auto' }}></span>
          <span style={{ fontSize:12.5, color:'var(--tx-dim)', lineHeight:1.45 }}><b style={{ color:'var(--tx)' }}>{f.who}</b> {f.txt}</span>
        </div>
      ))}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

export function DashboardView({ agents, onOpen, onAssign, campaigns=[], onNewCampaign, isMobile }) {
  const { progress, feed } = useLiveData(agents);
  const counts = agents.reduce((m,a)=>{ m[a.status]=(m[a.status]||0)+1; return m; }, {});
  const totalPower = agents.reduce((n,a)=>n+a.power,0);
  const activeCampaign = campaigns.find(c=>c.status==='active') || campaigns[0];
  const px = isMobile ? '16px' : '32px';

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16, flexWrap:'wrap',
        padding:`22px ${px} 18px`, borderBottom:'1px solid var(--ink-line)' }}>
        <div style={{ minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
            <h1 className="jh-disp" style={{ fontSize:30, fontWeight:700, whiteSpace:'nowrap' }}>ศาลบัญชาการทัพ</h1>
            <span className="jh-cjk" style={{ fontSize:23, color:'var(--gold)', opacity:.75 }}>帥府</span>
          </div>
          <p style={{ color:'var(--tx-dim)', fontSize:13, marginTop:4 }}>ภาพรวมสถานะกองทัพ Agent แบบเรียลไทม์</p>
        </div>
        <Btn kind="gold" sm onClick={onNewCampaign}>+ เปิดศึกใหม่</Btn>
      </div>
      <div style={{ padding:`20px ${px} 34px` }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:16 }}>
          <DStatTile label="จอมยุทธทั้งหมด" cjk="眾" value={agents.length} sub={`พลังทัพรวม ${totalPower.toLocaleString()}`} />
          <DStatTile label="กำลังออกศึก" cjk="戰" value={counts.active||0} sub="ปฏิบัติภารกิจอยู่" color="var(--st-active)" />
          <DStatTile label="รอคำสั่ง" cjk="候" value={counts.queued||0} sub="พร้อมรับบัญชา" color="var(--gold-hi)" />
          <DStatTile label="ต้องดูแล" cjk="療" value={counts.rest||0} sub="พักฟื้น/โหลดสูง" color="var(--cinnabar-hi)" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr minmax(300px,360px)', gap:22, marginTop:24 }}>
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px', minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <DualHead th="สถานะกองทัพสด" cjk="陣況" />
              <span className="jh-tag">แตะแถวเพื่อดูสำนวน</span>
            </div>
            <div style={{ overflowX:'auto' }}>
              <div style={{ minWidth:520 }}>
                <div style={{ display:'grid', gridTemplateColumns:'40px 1fr 116px 120px 70px 36px', gap:12, padding:'8px 4px', borderBottom:'1px solid var(--ink-line)' }}>
                  {['สำนัก','จอมยุทธ / ภารกิจ','สถานะ','คืบหน้า','พลัง',''].map((h,i)=>(<span key={i} className="jh-tag" style={{ textAlign:i===4?'right':'left' }}>{h}</span>))}
                </div>
                {agents.map(a=>{
                  const st = STATUS[a.status]; const p = progress[a.id]||(a.status==='active'?0.5:0);
                  return (
                    <div key={a.id} style={{ display:'grid', gridTemplateColumns:'40px 1fr 116px 120px 70px 36px', gap:12, alignItems:'center', padding:'11px 4px', borderBottom:'1px solid var(--ink-line)', cursor:'pointer', transition:'background .12s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(200,162,74,.04)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <div onClick={()=>onOpen(a.id)}><SectGlyph char={a.glyph} accent={a.accent} size={40} /></div>
                      <div onClick={()=>onOpen(a.id)} style={{ minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}><span className="jh-disp" style={{ fontSize:15, fontWeight:600, color:'var(--tx)' }}>{a.alias}</span><span style={{ fontSize:11, color:'var(--tx-faint)' }}>{a.sect}</span></div>
                        <div style={{ fontSize:12, color:'var(--tx-dim)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.task}</div>
                      </div>
                      <div onClick={()=>onOpen(a.id)}><StatusBadge status={a.status} size="sm" /></div>
                      <div onClick={()=>onOpen(a.id)}>
                        <Meter value={p||0.02} color={st.color} />
                        <div style={{ fontFamily:'var(--font-mono)', fontSize:10.5, color:'var(--tx-faint)', marginTop:4 }}>{p>0.03?Math.round(p*100)+'%':'—'}</div>
                      </div>
                      <span onClick={()=>onOpen(a.id)} style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--gold)', textAlign:'right' }}>{a.power.toLocaleString()}</span>
                      <button onClick={()=>onAssign&&onAssign(a)} title="มอบหมายภารกิจ" style={{ width:32, height:32, borderRadius:5, border:'1px solid var(--ink-line)', background:'var(--ink-2)', color:'var(--gold-deep)', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center' }}>⚔</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div style={{ background:'linear-gradient(160deg,#221a10,#16110a)', border:'1px solid var(--gold-deep)', borderRadius:6, padding:'16px 18px' }}>
              <DualHead th="ศึกที่กำลังดำเนิน" cjk="進行戰役" />
              {activeCampaign ? (
                <div style={{ marginTop:14 }}>
                  <span className="jh-disp" style={{ fontSize:18, color:'var(--gold-hi)', fontWeight:600 }}>{activeCampaign.title}</span>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--tx-faint)', marginTop:3 }}>
                    {activeCampaign.code} · เริ่ม {activeCampaign.started} · คาดเสร็จ {activeCampaign.eta}
                  </div>
                  {(() => {
                    const done = activeCampaign.steps.filter(s=>s.state==='done').length;
                    const pct = Math.round(done/activeCampaign.steps.length*100);
                    const activeStep = activeCampaign.steps.find(s=>s.state==='active');
                    return (
                      <div style={{ marginTop:12 }}>
                        <Meter value={done/activeCampaign.steps.length} color="var(--gold)" h={7} />
                        <div style={{ display:'flex', justifyContent:'space-between', marginTop:7, fontSize:11.5, color:'var(--tx-dim)' }}>
                          <span>คืบหน้า {pct}% · {done}/{activeCampaign.steps.length} ด่าน</span>
                          <span style={{ color:'var(--st-active)' }}>{activeStep?.label || 'กำลังดำเนิน'}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div style={{ marginTop:16, textAlign:'center', padding:'14px 0' }}>
                  <div className="jh-cjk" style={{ fontSize:26, color:'var(--gold-deep)', opacity:.5 }}>無</div>
                  <p style={{ fontSize:12.5, color:'var(--tx-dim)', marginTop:8 }}>ยังไม่มีศึกที่กำลังดำเนิน</p>
                  <Btn kind="ghost" sm style={{ marginTop:10 }} onClick={onNewCampaign}>+ เปิดศึกใหม่</Btn>
                </div>
              )}
            </div>
            <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px', flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <DualHead th="บันทึกศึก" cjk="戰報" />
                <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--st-active)' }}>
                  <span className="jh-pulse" style={{ display:'inline-block', width:6, height:6, borderRadius:9, background:'var(--st-active)' }}></span> LIVE
                </span>
              </div>
              <LiveFeed entries={feed} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Task / Timeline ---- */
function tState(s){ return {
  done:  { c:'var(--st-idle)',   ring:'var(--gold-deep)', th:'สำเร็จ',   cjk:'畢' },
  active:{ c:'var(--st-active)', ring:'var(--st-active)', th:'กำลังทำ', cjk:'戰' },
  queued:{ c:'var(--tx-faint)',  ring:'var(--ink-line)',  th:'รอคิว',   cjk:'候' },
}[s]; }

function useLiveLog() {
  const INIT = [
    { t:'10:30:02', c:'var(--gold)', x:'[ตำหนักใหญ่] มอบด่านตัดต่อให้ หอภาพมายา' },
    { t:'10:30:05', c:'var(--st-active)', x:'[หอภาพมายา] โหลดบท v2 + ฟุตเทจ 14 คลิป' },
    { t:'10:30:48', c:'var(--st-active)', x:'[หอภาพมายา] ใช้วิชา "ตัดต่อพันมือ" เรียงไทม์ไลน์' },
    { t:'10:31:10', c:'var(--st-active)', x:'[หอภาพมายา] ใช้ "เรนเดอร์สี่ทิศ" → 9:16 กำลังประมวลผล' },
    { t:'10:31:24', c:'var(--tx-faint)', x:'…เรนเดอร์ 62% · เหลือ ~3 นาที' },
  ];
  const LIVE_MSGS = [
    { c:'var(--st-active)', x:'[หอภาพมายา] เฟรม batch ที่ {n} เสร็จแล้ว — เรนเดอร์ต่อ' },
    { c:'var(--gold)', x:'[ตำหนักใหญ่] ตรวจสอบคุณภาพอัตโนมัติ — ผ่าน' },
    { c:'var(--st-active)', x:'[หอภาพมายา] ปรับ LUT โทนสีตามคัมภีร์แบรนด์' },
    { c:'var(--tx-faint)', x:'…เรนเดอร์ {p}% · เหลือ ~{r} นาที' },
    { c:'var(--gold-hi)', x:'[เรือนอักษร] ตรวจสอบบทซับไตเติลรอบสุดท้าย' },
    { c:'var(--st-active)', x:'[หอภาพมายา] สร้าง thumbnail preview เรียบร้อย' },
  ];
  const [log, setLog] = useState(INIT);
  const counterRef = useRef(62);

  useEffect(() => {
    const id = setInterval(() => {
      counterRef.current = Math.min(99, counterRef.current + Math.floor(Math.random()*3+1));
      const p = counterRef.current;
      const r = Math.max(1, Math.round((99-p)/3));
      const n = Math.floor(Math.random()*40+10);
      const now = new Date();
      const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      const tpl = LIVE_MSGS[Math.floor(Math.random()*LIVE_MSGS.length)];
      const x = tpl.x.replace('{p}', p).replace('{r}', r).replace('{n}', n);
      setLog(prev => [...prev, { t, c:tpl.c, x }].slice(-20));
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return log;
}

function TaskLiveLog({ log }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }, [log.length]);
  return (
    <div style={{ padding:'14px 15px', display:'flex', flexDirection:'column', gap:9, maxHeight:260, overflowY:'auto' }} className="jh-scroll">
      {log.map((l,i)=>(<div key={i} style={{ display:'flex', gap:10, fontFamily:'var(--font-mono)', fontSize:11, lineHeight:1.5, animation: i===log.length-1?'fadeIn .35s ease':'none' }}><span style={{ color:'var(--tx-faint)', flex:'0 0 auto' }}>{l.t}</span><span style={{ color:l.c }}>{l.x}</span></div>))}
      <div ref={endRef} />
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

function AgentStreamPanel({ text, done, error }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth', block:'nearest' }); }, [text]);
  const color = error ? 'var(--cinnabar-hi)' : done ? 'var(--gold)' : 'var(--st-active)';
  const label = error ? 'เกิดข้อผิดพลาด' : done ? 'เสร็จสิ้น' : 'กำลังประมวลผล…';
  return (
    <div style={{ marginTop:13 }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:7 }}>
        {!done && !error && <span className="jh-pulse" style={{ display:'inline-block', width:6, height:6, borderRadius:9, background:color }}></span>}
        {(done || error) && <span style={{ fontSize:11 }}>{error ? '✕' : '✓'}</span>}
        <span style={{ fontSize:11, color, fontFamily:'var(--font-mono)' }}>{label}</span>
      </div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:11.5, color:'var(--tx-dim)', lineHeight:1.65,
        maxHeight:260, overflowY:'auto', whiteSpace:'pre-wrap',
        background:'#090704', padding:'12px 14px', borderRadius:5, border:'1px solid var(--ink-line)' }}
        className="jh-scroll">
        {text}
        {!done && !error && <span style={{ display:'inline-block', width:7, height:12, background:'var(--st-active)',
          verticalAlign:'text-bottom', marginLeft:2, animation:'caretBlink .75s steps(1) infinite' }}></span>}
        <div ref={endRef} />
      </div>
      <style>{`@keyframes caretBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = React.useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  };
  return (
    <button onClick={handle} style={{ padding:'5px 12px', borderRadius:5, fontSize:11.5, cursor:'pointer',
      border:'1px solid var(--ink-line)', background: copied ? 'rgba(111,155,106,.18)' : 'var(--ink-2)',
      color: copied ? 'var(--st-active)' : 'var(--tx-dim)', fontFamily:'var(--font-body)', transition:'all .15s' }}>
      {copied ? '✓ คัดลอกแล้ว' : '📋 คัดลอก'}
    </button>
  );
}

function DownloadBtn({ text, filename }) {
  const handle = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={handle} style={{ padding:'5px 12px', borderRadius:5, fontSize:11.5, cursor:'pointer',
      border:'1px solid var(--ink-line)', background:'var(--ink-2)',
      color:'var(--tx-dim)', fontFamily:'var(--font-body)' }}>
      ⬇ ดาวน์โหลด .txt
    </button>
  );
}

function EmptyTaskView({ onNew }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      minHeight:'55vh', gap:20, padding:'40px 24px', textAlign:'center' }}>
      <div className="jh-cjk" style={{ fontSize:64, color:'var(--gold-deep)', opacity:.3, lineHeight:1 }}>無</div>
      <h2 className="jh-disp" style={{ fontSize:22, color:'var(--tx-dim)', fontWeight:600 }}>ยังไม่มีศึกที่กำลังดำเนิน</h2>
      <p style={{ fontSize:13, color:'var(--tx-faint)', maxWidth:320, lineHeight:1.6 }}>เปิดศึกใหม่เพื่อเริ่มประสานงานกองทัพ Agent ตามขั้นตอน Pipeline</p>
      <Btn kind="gold" onClick={onNew}>⚔ เปิดศึกแรก</Btn>
    </div>
  );
}

export function TaskView({ agents, onOpen, campaigns=[], onNewCampaign, onAdvanceStep, onRerunStep, isMobile }) {
  const find = id => agents.find(a=>a.id===id) || AGENTS.find(a=>a.id===id);
  const { progress } = useLiveData(agents);
  const liveLog = useLiveLog();
  const [selectedId, setSelectedId] = useState(() => campaigns[0]?.id || null);
  const campaign = campaigns.find(c=>c.id===selectedId) || campaigns[0];
  const px = isMobile ? '16px' : '32px';

  // Run-step state
  const [runKey, setRunKey] = useState(null);   // "${campaignId}-${stepIdx}" currently streaming
  const [streamText, setStreamText] = useState('');
  const [streamDone, setStreamDone] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const handleRunStep = async (camp, step, stepIdx) => {
    const key = `${camp.id}-${stepIdx}`;
    setRunKey(key);
    setStreamText('');
    setStreamDone(false);
    setStreamError(false);

    const previousOutputs = camp.steps
      .slice(0, stepIdx)
      .filter(s => s.fullOutput)
      .map(s => ({ stepLabel: s.label, output: s.fullOutput }));

    let buf = '';
    await runStep({
      agentId: step.agent,
      stepLabel: step.label,
      campaignTitle: camp.title,
      product: camp.product || '',
      previousOutputs,
      onChunk: (text) => { buf += text; setStreamText(buf); },
      onDone: () => setStreamDone(true),
      onError: (err) => { setStreamText(t => t + `\n\n[⚠ ${err}]`); setStreamError(true); setStreamDone(true); },
    });
  };

  if (!campaign) return <EmptyTaskView onNew={onNewCampaign} />;

  const done = campaign.steps.filter(s=>s.state==='done').length;
  const pct = Math.round(done/campaign.steps.length*100);

  return (
    <div>
      {campaigns.length > 1 && (
        <div style={{ display:'flex', gap:6, padding:`12px ${px} 0`, overflowX:'auto' }} className="jh-scroll">
          {campaigns.map(c=>(
            <button key={c.id} onClick={()=>setSelectedId(c.id)} style={{
              padding:'7px 14px', borderRadius:6, border:`1px solid ${c.id===selectedId?'var(--gold-deep)':'var(--ink-line)'}`,
              background: c.id===selectedId?'rgba(200,162,74,.1)':'var(--ink-2)',
              color: c.id===selectedId?'var(--gold-hi)':'var(--tx-dim)',
              cursor:'pointer', fontSize:12, fontFamily:'var(--font-body)', whiteSpace:'nowrap', transition:'all .14s',
            }}>
              <span style={{ marginRight:5, color:c.status==='active'?'var(--st-active)':'var(--tx-faint)' }}>●</span>
              {c.title}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding:`22px ${px} 20px`, borderBottom:'1px solid var(--ink-line)', background:'linear-gradient(120deg,#221a10,#14100a 65%)' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
          <div style={{ minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              <span className="jh-tag" style={{ color:'var(--cinnabar-hi)' }}>ศึกที่กำลังดำเนิน · {campaign.code}</span>
              <StatusBadge status="active" size="sm" />
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:13, marginTop:8, flexWrap:'wrap' }}>
              <h1 className="jh-disp" style={{ fontSize:isMobile?22:30, fontWeight:700, color:'var(--gold-hi)' }}>{campaign.title}</h1>
              <span className="jh-cjk" style={{ fontSize:22, color:'var(--gold)', opacity:.7 }}>{campaign.cjk}</span>
            </div>
            <p style={{ fontSize:13, color:'var(--tx-dim)', marginTop:5 }}>
              {campaign.product && <span style={{ color:'var(--gold-hi)' }}>{campaign.product} · </span>}
              เริ่ม {campaign.started} · คาดเสร็จ {campaign.eta}
            </p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Btn kind="ink" sm>หยุดชั่วคราว</Btn>
            <Btn kind="ghost" sm onClick={onNewCampaign}>+ ศึกใหม่</Btn>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:18, marginTop:18 }}>
          <div style={{ flex:1 }}><Meter value={done/campaign.steps.length} color="var(--gold)" h={8} /></div>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--gold)' }}>{pct}% · {done}/{campaign.steps.length} ด่าน</span>
        </div>
      </div>

      <div style={{ padding:`26px ${px} 40px`, display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr minmax(300px,372px)', gap:26 }}>
        <div>
          <DualHead th="เส้นเวลาการประสานทัพ" cjk="戰役時序" />
          {done === campaign.steps.length && (
            <div style={{ margin:'14px 0', padding:'14px 18px', borderRadius:7,
              border:'1px solid var(--gold)', background:'rgba(200,162,74,.09)',
              display:'flex', alignItems:'center', gap:14 }}>
              <span className="jh-cjk" style={{ fontSize:28, color:'var(--gold)', lineHeight:1 }}>勝</span>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:'var(--gold-hi)' }}>ศึกสำเร็จแล้ว!</div>
                <div style={{ fontSize:12, color:'var(--tx-dim)', marginTop:2 }}>ทุกด่านเสร็จสิ้น — รอสายรายงานจากเรือนคำนวณ</div>
              </div>
              <Btn kind="ghost" sm style={{ marginLeft:'auto' }} onClick={onNewCampaign}>+ เปิดศึกใหม่</Btn>
            </div>
          )}
          <div style={{ marginTop:18 }}>
            {campaign.steps.map((step,idx)=>{
              const a = find(step.agent); if(!a) return null;
              const ss = tState(step.state); const isActive = step.state==='active'; const last = idx===campaign.steps.length-1;
              const p = isActive ? (progress[a.id]??0.62) : (step.state==='done'?1:0);
              return (
                <div key={idx} style={{ display:'flex', gap:16 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:'0 0 auto' }}>
                    <div style={{ width:44, height:44, borderRadius:10, display:'grid', placeItems:'center', position:'relative',
                      background:'radial-gradient(120% 120% at 30% 25%,#2c2417,#15100a)',
                      border:`1.5px solid ${ss.ring}`, boxShadow:isActive?'0 0 0 3px rgba(111,155,106,.18)':'none' }}>
                      <span className="jh-cjk" style={{ fontSize:20, color:a.accent }}>{a.glyph}</span>
                      {step.state==='done' && <span style={{ position:'absolute', bottom:-3, right:-3, width:16, height:16, borderRadius:9, background:'var(--ink)', border:'1px solid var(--gold-deep)', color:'var(--gold)', fontSize:10, display:'grid', placeItems:'center' }}>✓</span>}
                    </div>
                    {!last && <span style={{ width:2, flex:1, background:'var(--ink-line)', marginTop:4, minHeight:30 }}></span>}
                  </div>
                  <div style={{ flex:1, paddingBottom:last?0:22 }}>
                    <div onClick={()=>onOpen(a.id)} className="jh-frame" style={{ cursor:'pointer',
                      background:isActive?'linear-gradient(120deg,#1c2417,#13160f)':'var(--ink-1)',
                      border:`1px solid ${isActive?'var(--st-active)':'var(--ink-line)'}`,
                      borderRadius:6, padding:'14px 17px', transition:'border-color .2s' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                        <div style={{ minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'baseline', gap:9 }}>
                            <span className="jh-tag">ด่าน {String(idx+1).padStart(2,'0')}</span>
                            <span className="jh-disp" style={{ fontSize:16.5, fontWeight:600, color:'var(--tx)' }}>{step.label}</span>
                          </div>
                          <div style={{ fontSize:12, color:'var(--tx-dim)', marginTop:3 }}>{a.alias} · {a.sect}</div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:14, flex:'0 0 auto' }}>
                          <span style={{ fontFamily:'var(--font-mono)', fontSize:11.5, color:'var(--tx-faint)' }}>{step.t}</span>
                          <span style={{ fontSize:11.5, padding:'3px 11px', borderRadius:99, color:ss.c, border:`1px solid ${ss.c}55` }}>● {step.th||ss.th} <span className="jh-cjk">{ss.cjk}</span></span>
                        </div>
                      </div>
                      {isActive && (() => {
                        const key = `${campaign.id}-${idx}`;
                        const isRunning = runKey === key && !streamDone;
                        const isDone = runKey === key && streamDone;
                        return (
                          <div style={{ marginTop:13, paddingTop:13, borderTop:'1px solid var(--ink-line)' }} onClick={e=>e.stopPropagation()}>
                            {!isRunning && !isDone && (
                              <>
                                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:7 }}>
                                  <span style={{ color:'var(--tx-dim)' }}>{step.label}</span>
                                  <span style={{ fontFamily:'var(--font-mono)', color:'var(--st-active)' }}>{Math.round(p*100)}%</span>
                                </div>
                                <Meter value={p} color="var(--st-active)" h={6} />
                                <div style={{ marginTop:12, display:'flex', justifyContent:'flex-end', gap:8 }}>
                                  <button onClick={()=>handleRunStep(campaign, step, idx)} style={{
                                    padding:'7px 18px', borderRadius:6, fontSize:13, fontWeight:600,
                                    border:'1px solid var(--gold)', background:'rgba(200,162,74,.12)',
                                    color:'var(--gold-hi)', cursor:'pointer', fontFamily:'var(--font-body)',
                                  }}>▶ รัน Agent</button>
                                  {onAdvanceStep && (
                                    <button onClick={()=>onAdvanceStep(campaign.id, null)} style={{
                                      padding:'7px 14px', borderRadius:6, fontSize:12,
                                      border:'1px solid var(--ink-line)', background:'transparent',
                                      color:'var(--tx-faint)', cursor:'pointer', fontFamily:'var(--font-body)',
                                    }}>ข้ามด่าน →</button>
                                  )}
                                </div>
                              </>
                            )}
                            {(isRunning || isDone) && (
                              <AgentStreamPanel text={streamText} done={isDone} error={streamError} />
                            )}
                            {isDone && onAdvanceStep && (
                              <div style={{ marginTop:10, display:'flex', justifyContent:'flex-end' }}>
                                <button onClick={()=>onAdvanceStep(campaign.id, streamText)} style={{
                                  padding:'8px 18px', borderRadius:6, fontSize:13, fontWeight:600,
                                  border:'1px solid var(--st-active)', background:'rgba(111,155,106,.14)',
                                  color:'var(--st-active)', cursor:'pointer', fontFamily:'var(--font-body)',
                                }}>✓ ด่านนี้สำเร็จแล้ว</button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      {step.state==='done' && !step.fullOutput && step.out==='—' && onRerunStep && (
                        <div style={{ marginTop:8 }} onClick={e => e.stopPropagation()}>
                          <button onClick={()=>onRerunStep(campaign.id, idx)} style={{
                            padding:'5px 14px', borderRadius:5, fontSize:12, cursor:'pointer',
                            border:'1px solid var(--cinnabar-hi)', background:'rgba(180,60,40,.1)',
                            color:'var(--cinnabar-hi)', fontFamily:'var(--font-body)',
                          }}>🔄 รันใหม่</button>
                        </div>
                      )}
                      {step.state==='done' && (step.fullOutput || step.out!=='—') && (
                        <div style={{ marginTop:10 }} onClick={e => e.stopPropagation()}>
                          {step.fullOutput ? (
                            <>
                              <details open style={{ cursor:'pointer' }}>
                                <summary style={{ fontSize:12, color:'var(--gold-hi)', fontFamily:'var(--font-mono)', listStyle:'none', userSelect:'none' }}>
                                  ✓ ผลลัพธ์ Agent ▾
                                </summary>
                                <div style={{ marginTop:8, fontFamily:'var(--font-mono)', fontSize:11, color:'var(--tx-dim)',
                                  lineHeight:1.6, whiteSpace:'pre-wrap', maxHeight:180, overflowY:'auto',
                                  background:'#090704', padding:'10px 12px', borderRadius:4, border:'1px solid var(--ink-line)' }}
                                  className="jh-scroll">{step.fullOutput}</div>
                              </details>
                              <div style={{ display:'flex', gap:7, marginTop:8 }}>
                                <CopyBtn text={step.fullOutput} />
                                <DownloadBtn text={step.fullOutput} filename={`${step.label}.txt`} />
                              </div>
                            </>
                          ) : (
                            <div style={{ fontSize:12, color:'var(--tx-faint)' }}>
                              ผลลัพธ์: <span style={{ color:'var(--gold-hi)', fontFamily:'var(--font-mono)' }}>{step.out}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div style={{ background:'var(--ink-haze)', border:'1px solid var(--ink-line)', borderRadius:6, overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 15px', borderBottom:'1px solid var(--ink-line)', background:'var(--ink-1)' }}>
              <span className="jh-tag">บันทึกสด · 戰報實況</span>
              <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--st-active)' }}>
                <span className="jh-pulse" style={{ display:'inline-block', width:7, height:7, borderRadius:9, background:'var(--st-active)' }}></span> LIVE
              </span>
            </div>
            <TaskLiveLog log={liveLog} />
          </div>
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px' }}>
            <DualHead th="ทัพที่ร่วมศึก" cjk="參戰" />
            <div style={{ display:'flex', flexDirection:'column', gap:11, marginTop:14 }}>
              {campaign.steps.map((s,i)=>{ const a=find(s.agent); if(!a) return null; const ss=tState(s.state); return (
                <div key={i} onClick={()=>onOpen(a.id)} style={{ display:'flex', alignItems:'center', gap:11, cursor:'pointer', padding:'4px 0', transition:'opacity .15s' }}
                  onMouseEnter={e=>e.currentTarget.style.opacity='.75'}
                  onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                  <SectGlyph char={a.glyph} accent={a.accent} size={34} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, color:'var(--tx)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.alias}</div>
                    <div style={{ fontSize:11, color:'var(--tx-faint)' }}>{a.sect}</div>
                  </div>
                  <span style={{ fontSize:11, color:ss.c }}>● {s.th||ss.th}</span>
                </div>
              ); })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
