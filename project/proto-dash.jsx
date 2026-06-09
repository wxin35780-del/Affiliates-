/* ====== Prototype · Dashboard + Task ====== */

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

function DashboardView({ agents, onOpen, onAssign }) {
  const counts = agents.reduce((m,a)=>{ m[a.status]=(m[a.status]||0)+1; return m; }, {});
  const totalPower = agents.reduce((n,a)=>n+a.power,0);
  const feed = [
    { t:'10:31', who:'จิตรกรเงามายา', txt:'เริ่มเรนเดอร์คลิป 9:16 เวอร์ชัน A', c:'var(--st-active)' },
    { t:'10:30', who:'พู่กันสะท้านใจ', txt:'ส่งบท v2 ให้หอภาพมายา', c:'var(--gold)' },
    { t:'10:18', who:'เซียนลูกคิดเหล็ก', txt:'เข้าสู่สถานะพักฟื้น — โหลดประมวลผลสูง', c:'var(--cinnabar-hi)' },
    { t:'09:48', who:'ตาเหยี่ยวพันลี้', txt:'พบ 3 มุมขายเด่นหมวดความงาม', c:'var(--st-active)' },
    { t:'09:12', who:'พญาอินทรีบัญชาทัพ', txt:'เปิดศึก “เซรั่มหยกขาว” มอบหมาย 6 สำนัก', c:'var(--cinnabar-hi)' },
  ];
  const prog = { marshal:0.4, scout:0.78, scribe:0.55, smith:0.62 };
  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16, flexWrap:'wrap', padding:'22px 32px 18px', borderBottom:'1px solid var(--ink-line)' }}>
        <div style={{ minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
            <h1 className="jh-disp" style={{ fontSize:30, fontWeight:700, whiteSpace:'nowrap' }}>ศาลบัญชาการทัพ</h1>
            <span className="jh-cjk" style={{ fontSize:23, color:'var(--gold)', opacity:.75 }}>帥府</span>
          </div>
          <p style={{ color:'var(--tx-dim)', fontSize:13, marginTop:4 }}>ภาพรวมสถานะกองทัพ Agent แบบเรียลไทม์ · อัปเดต 10:31</p>
        </div>
        <Btn kind="gold" sm>+ เปิดศึกใหม่</Btn>
      </div>
      <div style={{ padding:'20px 32px 34px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          <DStatTile label="จอมยุทธทั้งหมด" cjk="眾" value={agents.length} sub={`พลังทัพรวม ${totalPower.toLocaleString()}`} />
          <DStatTile label="กำลังออกศึก" cjk="戰" value={counts.active||0} sub="ปฏิบัติภารกิจอยู่" color="var(--st-active)" />
          <DStatTile label="รอคำสั่ง" cjk="候" value={counts.queued||0} sub="พร้อมรับบัญชา" color="var(--gold-hi)" />
          <DStatTile label="ต้องดูแล" cjk="療" value={counts.rest||0} sub="พักฟื้น/โหลดสูง" color="var(--cinnabar-hi)" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:22, marginTop:24 }}>
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <DualHead th="สถานะกองทัพสด" cjk="陣況" />
              <span className="jh-tag">แตะแถวเพื่อดูสำนวน</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'40px 1fr 116px 140px 70px 36px', gap:14, padding:'8px 4px', borderBottom:'1px solid var(--ink-line)' }}>
              {['สำนัก','จอมยุทธ / ภารกิจ','สถานะ','ความคืบหน้า','พลัง',''].map((h,i)=>(<span key={i} className="jh-tag" style={{ textAlign:i===4?'right':'left' }}>{h}</span>))}
            </div>
            {agents.map(a=>{
              const st = STATUS[a.status]; const p = prog[a.id]|| (a.status==='active'?0.5:0);
              return (
                <div key={a.id} style={{ display:'grid', gridTemplateColumns:'40px 1fr 116px 140px 70px 36px', gap:14, alignItems:'center', padding:'11px 4px', borderBottom:'1px solid var(--ink-line)', cursor:'pointer' }}>
                  <div onClick={()=>onOpen(a.id)}><SectGlyph char={a.glyph} accent={a.accent} size={40} /></div>
                  <div onClick={()=>onOpen(a.id)} style={{ minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:8 }}><span className="jh-disp" style={{ fontSize:15, fontWeight:600, color:'var(--tx)' }}>{a.alias}</span><span style={{ fontSize:11, color:'var(--tx-faint)' }}>{a.sect}</span></div>
                    <div style={{ fontSize:12, color:'var(--tx-dim)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.task}</div>
                  </div>
                  <div onClick={()=>onOpen(a.id)}><StatusBadge status={a.status} size="sm" /></div>
                  <div onClick={()=>onOpen(a.id)}><Meter value={p||0.02} color={st.color} /><div style={{ fontFamily:'var(--font-mono)', fontSize:10.5, color:'var(--tx-faint)', marginTop:4 }}>{p>0?Math.round(p*100)+'%':'—'}</div></div>
                  <span onClick={()=>onOpen(a.id)} style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--gold)', textAlign:'right' }}>{a.power.toLocaleString()}</span>
                  <button onClick={()=>onAssign&&onAssign(a)} title="มอบหมายภารกิจ" style={{ width:32, height:32, borderRadius:5, border:'1px solid var(--ink-line)', background:'var(--ink-2)', color:'var(--gold-deep)', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center' }}>⚔</button>
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div style={{ background:'linear-gradient(160deg,#221a10,#16110a)', border:'1px solid var(--gold-deep)', borderRadius:6, padding:'16px 18px' }}>
              <DualHead th="ศึกที่กำลังดำเนิน" cjk="進行戰役" />
              <div style={{ marginTop:14 }}>
                <span className="jh-disp" style={{ fontSize:18, color:'var(--gold-hi)', fontWeight:600 }}>{QUEST.title}</span>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--tx-faint)', marginTop:3 }}>{QUEST.code} · เริ่ม {QUEST.started} · คาดเสร็จ {QUEST.eta}</div>
                <div style={{ marginTop:12 }}><Meter value={0.42} color="var(--gold)" h={7} /></div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:7, fontSize:11.5, color:'var(--tx-dim)' }}><span>คืบหน้า 42% · 2/6 ด่าน</span><span style={{ color:'var(--st-active)' }}>ช่วงตัดต่อ</span></div>
              </div>
            </div>
            <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px', flex:1 }}>
              <DualHead th="บันทึกศึก" cjk="戰報" />
              <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:13 }}>
                {feed.map((f,i)=>(
                  <div key={i} style={{ display:'flex', gap:11 }}>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--tx-faint)', width:38, flex:'0 0 auto', paddingTop:1 }}>{f.t}</span>
                    <span style={{ width:7, height:7, borderRadius:9, background:f.c, marginTop:5, flex:'0 0 auto' }}></span>
                    <span style={{ fontSize:12.5, color:'var(--tx-dim)', lineHeight:1.45 }}><b style={{ color:'var(--tx)' }}>{f.who}</b> {f.txt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Task ---- */
function tState(s){ return { done:{c:'var(--st-idle)',ring:'var(--gold-deep)',th:'สำเร็จ',cjk:'畢'}, active:{c:'var(--st-active)',ring:'var(--st-active)',th:'กำลังทำ',cjk:'戰'}, queued:{c:'var(--tx-faint)',ring:'var(--ink-line)',th:'รอคิว',cjk:'候'} }[s]; }

function TaskView({ agents, onOpen }) {
  const find = id => agents.find(a=>a.id===id) || AGENTS.find(a=>a.id===id);
  const done = QUEST.steps.filter(s=>s.state==='done').length;
  const pct = Math.round(done/QUEST.steps.length*100);
  const log = [
    { t:'10:30:02', c:'var(--gold)', x:'[ตำหนักใหญ่] มอบด่านตัดต่อให้ หอภาพมายา' },
    { t:'10:30:05', c:'var(--st-active)', x:'[หอภาพมายา] โหลดบท v2 + ฟุตเทจ 14 คลิป' },
    { t:'10:30:48', c:'var(--st-active)', x:'[หอภาพมายา] ใช้วิชา “ตัดต่อพันมือ” เรียงไทม์ไลน์' },
    { t:'10:31:10', c:'var(--st-active)', x:'[หอภาพมายา] ใช้ “เรนเดอร์สี่ทิศ” → 9:16 กำลังประมวลผล' },
    { t:'10:31:24', c:'var(--tx-faint)', x:'…เรนเดอร์ 62% · เหลือ ~3 นาที' },
  ];
  return (
    <div>
      <div style={{ padding:'22px 32px 20px', borderBottom:'1px solid var(--ink-line)', background:'linear-gradient(120deg,#221a10,#14100a 65%)' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
          <div style={{ minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              <span className="jh-tag" style={{ color:'var(--cinnabar-hi)' }}>ศึกที่กำลังดำเนิน · {QUEST.code}</span>
              <StatusBadge status="active" size="sm" />
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:13, marginTop:8 }}>
              <h1 className="jh-disp" style={{ fontSize:30, fontWeight:700, color:'var(--gold-hi)', whiteSpace:'nowrap' }}>{QUEST.title}</h1>
              <span className="jh-cjk" style={{ fontSize:22, color:'var(--gold)', opacity:.7 }}>{QUEST.cjk}</span>
            </div>
            <p style={{ fontSize:13, color:'var(--tx-dim)', marginTop:5 }}>แม่ทัพประสาน 6 สำนักทำงานต่อเนื่องเป็นทอด ๆ · เริ่ม {QUEST.started} · คาดเสร็จ {QUEST.eta}</p>
          </div>
          <div style={{ display:'flex', gap:10 }}><Btn kind="ink" sm>หยุดชั่วคราว</Btn><Btn kind="ghost" sm>แทรกคำสั่ง</Btn></div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:18, marginTop:18 }}>
          <div style={{ flex:1 }}><Meter value={done/QUEST.steps.length} color="var(--gold)" h={8} /></div>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--gold)' }}>{pct}% · {done}/{QUEST.steps.length} ด่าน</span>
        </div>
      </div>
      <div style={{ padding:'26px 32px 40px', display:'grid', gridTemplateColumns:'1fr 372px', gap:26 }}>
        <div>
          <DualHead th="เส้นเวลาการประสานทัพ" cjk="戰役時序" />
          <div style={{ marginTop:18 }}>
            {QUEST.steps.map((step,idx)=>{
              const a = find(step.agent); const ss = tState(step.state); const active = step.state==='active'; const last = idx===QUEST.steps.length-1;
              return (
                <div key={idx} style={{ display:'flex', gap:16 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:'0 0 auto' }}>
                    <div style={{ width:44, height:44, borderRadius:10, display:'grid', placeItems:'center', position:'relative', background:'radial-gradient(120% 120% at 30% 25%,#2c2417,#15100a)', border:`1.5px solid ${ss.ring}`, boxShadow:active?'0 0 0 3px rgba(111,155,106,.18)':'none' }}>
                      <span className="jh-cjk" style={{ fontSize:20, color:a.accent }}>{a.glyph}</span>
                      {step.state==='done' && <span style={{ position:'absolute', bottom:-3, right:-3, width:16, height:16, borderRadius:9, background:'var(--ink)', border:'1px solid var(--gold-deep)', color:'var(--gold)', fontSize:10, display:'grid', placeItems:'center' }}>✓</span>}
                    </div>
                    {!last && <span style={{ width:2, flex:1, background:'var(--ink-line)', marginTop:4, minHeight:30 }}></span>}
                  </div>
                  <div style={{ flex:1, paddingBottom:last?0:22 }}>
                    <div onClick={()=>onOpen(a.id)} className="jh-frame" style={{ cursor:'pointer', background:active?'linear-gradient(120deg,#1c2417,#13160f)':'var(--ink-1)', border:`1px solid ${active?'var(--st-active)':'var(--ink-line)'}`, borderRadius:6, padding:'14px 17px' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                        <div style={{ minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'baseline', gap:9 }}><span className="jh-tag">ด่าน {String(idx+1).padStart(2,'0')}</span><span className="jh-disp" style={{ fontSize:16.5, fontWeight:600, color:'var(--tx)' }}>{step.label}</span></div>
                          <div style={{ fontSize:12, color:'var(--tx-dim)', marginTop:3 }}>{a.alias} · {a.sect}</div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:14, flex:'0 0 auto' }}>
                          <span style={{ fontFamily:'var(--font-mono)', fontSize:11.5, color:'var(--tx-faint)' }}>{step.t}</span>
                          <span style={{ fontSize:11.5, padding:'3px 11px', borderRadius:99, color:ss.c, border:`1px solid ${ss.c}55` }}>● {step.th||ss.th} <span className="jh-cjk">{ss.cjk}</span></span>
                        </div>
                      </div>
                      {active && (<div style={{ marginTop:13, paddingTop:13, borderTop:'1px solid var(--ink-line)' }}><div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:7 }}><span style={{ color:'var(--tx-dim)' }}>กำลังเรนเดอร์เวอร์ชัน 9:16</span><span style={{ fontFamily:'var(--font-mono)', color:'var(--st-active)' }}>{step.out}</span></div><Meter value={0.62} color="var(--st-active)" h={6} /></div>)}
                      {step.state!=='active' && step.out!=='—' && (<div style={{ marginTop:10, fontSize:12, color:'var(--tx-faint)' }}>ผลลัพธ์: <span style={{ color:'var(--gold-hi)', fontFamily:'var(--font-mono)' }}>{step.out}</span></div>)}
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
              <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--st-active)' }}><span style={{ display:'inline-block', width:7, height:7, borderRadius:9, background:'var(--st-active)' }}></span> LIVE</span>
            </div>
            <div style={{ padding:'14px 15px', display:'flex', flexDirection:'column', gap:9 }}>
              {log.map((l,i)=>(<div key={i} style={{ display:'flex', gap:10, fontFamily:'var(--font-mono)', fontSize:11.5, lineHeight:1.5 }}><span style={{ color:'var(--tx-faint)', flex:'0 0 auto' }}>{l.t}</span><span style={{ color:l.c }}>{l.x}</span></div>))}
            </div>
          </div>
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px' }}>
            <DualHead th="ทัพที่ร่วมศึก" cjk="參戰" />
            <div style={{ display:'flex', flexDirection:'column', gap:11, marginTop:14 }}>
              {QUEST.steps.map((s,i)=>{ const a=find(s.agent); const ss=tState(s.state); return (
                <div key={i} onClick={()=>onOpen(a.id)} style={{ display:'flex', alignItems:'center', gap:11, cursor:'pointer' }}>
                  <SectGlyph char={a.glyph} accent={a.accent} size={34} />
                  <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13, color:'var(--tx)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.alias}</div><div style={{ fontSize:11, color:'var(--tx-faint)' }}>{a.sect}</div></div>
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

Object.assign(window, { DashboardView, TaskView });
