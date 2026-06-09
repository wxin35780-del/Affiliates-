/* ====== หน้า Task · เส้นเวลาการประสานทัพ ====== */

function byId(id){ return AGENTS.find(a=>a.id===id); }

function stepState(s){
  return {
    done:   { c:'var(--st-idle)',   ring:'var(--gold-deep)', th:'สำเร็จ',   cjk:'畢' },
    active: { c:'var(--st-active)',  ring:'var(--st-active)', th:'กำลังทำ',  cjk:'戰' },
    queued: { c:'var(--tx-faint)',   ring:'var(--ink-line)',  th:'รอคิว',    cjk:'候' },
  }[s];
}

function QuestStep({ step, idx, last }) {
  const a = byId(step.agent);
  const ss = stepState(step.state);
  const active = step.state==='active';
  return (
    <div style={{ display:'flex', gap:16 }}>
      {/* เส้น + หมุด */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:'0 0 auto' }}>
        <div style={{ width:44, height:44, borderRadius:10, display:'grid', placeItems:'center', position:'relative',
          background:'radial-gradient(120% 120% at 30% 25%,#2c2417,#15100a)', border:`1.5px solid ${ss.ring}`,
          boxShadow: active?'0 0 0 3px rgba(111,155,106,.18)':'none' }}>
          <span className="jh-cjk" style={{ fontSize:20, color:a.accent }}>{a.glyph}</span>
          {step.state==='done' && <span style={{ position:'absolute', bottom:-3, right:-3, width:16, height:16, borderRadius:9,
            background:'var(--ink)', border:'1px solid var(--gold-deep)', color:'var(--gold)', fontSize:10, display:'grid', placeItems:'center' }}>✓</span>}
        </div>
        {!last && <span style={{ width:2, flex:1, background:'var(--ink-line)', marginTop:4, minHeight:30 }}></span>}
      </div>
      {/* เนื้อหา */}
      <div style={{ flex:1, paddingBottom: last?0:22 }}>
        <div className="jh-frame" style={{ background: active?'linear-gradient(120deg,#1c2417,#13160f)':'var(--ink-1)',
          border:`1px solid ${active?'var(--st-active)':'var(--ink-line)'}`, borderRadius:6, padding:'14px 17px' }}>
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
              <span style={{ fontSize:11.5, padding:'3px 11px', borderRadius:99, color:ss.c, border:`1px solid ${ss.c}55` }}>
                ● {step.th || ss.th} <span className="jh-cjk">{ss.cjk}</span>
              </span>
            </div>
          </div>
          {active && (
            <div style={{ marginTop:13, paddingTop:13, borderTop:'1px solid var(--ink-line)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:7 }}>
                <span style={{ color:'var(--tx-dim)' }}>กำลังเรนเดอร์เวอร์ชัน 9:16</span>
                <span style={{ fontFamily:'var(--font-mono)', color:'var(--st-active)' }}>{step.out}</span>
              </div>
              <Meter value={0.62} color="var(--st-active)" h={6} />
            </div>
          )}
          {step.state!=='active' && step.out!=='—' && (
            <div style={{ marginTop:10, fontSize:12, color:'var(--tx-faint)' }}>ผลลัพธ์: <span style={{ color:'var(--gold-hi)', fontFamily:'var(--font-mono)' }}>{step.out}</span></div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskPage() {
  const done = QUEST.steps.filter(s=>s.state==='done').length;
  const pct = Math.round(done/QUEST.steps.length*100);
  const log = [
    { t:'10:30:02', c:'var(--gold)',      x:'[ตำหนักใหญ่] มอบด่านตัดต่อให้ หอภาพมายา' },
    { t:'10:30:05', c:'var(--st-active)', x:'[หอภาพมายา] โหลดบท v2 + ฟุตเทจ 14 คลิป' },
    { t:'10:30:48', c:'var(--st-active)', x:'[หอภาพมายา] ใช้วิชา “ตัดต่อพันมือ” เรียงไทม์ไลน์' },
    { t:'10:31:10', c:'var(--st-active)', x:'[หอภาพมายา] ใช้ “เรนเดอร์สี่ทิศ” → 9:16 กำลังประมวลผล' },
    { t:'10:31:24', c:'var(--tx-faint)',  x:'…เรนเดอร์ 62% · เหลือ ~3 นาที' },
  ];
  return (
    <div className="jh jh-ink" style={{ width:1280, minHeight:820 }}>
      {/* หัวศึก */}
      <div style={{ padding:'22px 32px 20px', borderBottom:'1px solid var(--ink-line)',
        background:'linear-gradient(120deg,#221a10,#14100a 65%)' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:20 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span className="jh-tag" style={{ color:'var(--cinnabar-hi)' }}>ศึกที่กำลังดำเนิน · {QUEST.code}</span>
              <StatusBadge status="active" size="sm" />
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:13, marginTop:8 }}>
              <h1 className="jh-disp" style={{ fontSize:30, fontWeight:700, color:'var(--gold-hi)' }}>{QUEST.title}</h1>
              <span className="jh-cjk" style={{ fontSize:22, color:'var(--gold)', opacity:.7 }}>{QUEST.cjk}</span>
            </div>
            <p style={{ fontSize:13, color:'var(--tx-dim)', marginTop:5 }}>แม่ทัพประสาน 6 สำนักทำงานต่อเนื่องเป็นทอด ๆ · เริ่ม {QUEST.started} · คาดเสร็จ {QUEST.eta}</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Btn kind="ink" sm>หยุดชั่วคราว</Btn>
            <Btn kind="ghost" sm>แทรกคำสั่ง</Btn>
          </div>
        </div>
        {/* แถบรวม */}
        <div style={{ display:'flex', alignItems:'center', gap:18, marginTop:18 }}>
          <div style={{ flex:1 }}><Meter value={done/QUEST.steps.length} color="var(--gold)" h={8} /></div>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--gold)' }}>{pct}% · {done}/{QUEST.steps.length} ด่าน</span>
        </div>
      </div>

      <div style={{ padding:'26px 32px 34px', display:'grid', gridTemplateColumns:'1fr 372px', gap:26 }}>
        {/* เส้นเวลา */}
        <div>
          <DualHead th="เส้นเวลาการประสานทัพ" cjk="戰役時序" />
          <div style={{ marginTop:18 }}>
            {QUEST.steps.map((s,i)=> <QuestStep key={i} step={s} idx={i} last={i===QUEST.steps.length-1} />)}
          </div>
        </div>

        {/* บันทึกสด (terminal) */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div style={{ background:'var(--ink-haze)', border:'1px solid var(--ink-line)', borderRadius:6, overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 15px',
              borderBottom:'1px solid var(--ink-line)', background:'var(--ink-1)' }}>
              <span className="jh-tag">บันทึกสด · 戰報實況</span>
              <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--st-active)' }}>
                <span className="jh-pulse" style={{ position:'static', display:'inline-block', width:7, height:7, borderRadius:9, background:'var(--st-active)' }}></span> LIVE
              </span>
            </div>
            <div style={{ padding:'14px 15px', display:'flex', flexDirection:'column', gap:9 }}>
              {log.map((l,i)=>(
                <div key={i} style={{ display:'flex', gap:10, fontFamily:'var(--font-mono)', fontSize:11.5, lineHeight:1.5 }}>
                  <span style={{ color:'var(--tx-faint)', flex:'0 0 auto' }}>{l.t}</span>
                  <span style={{ color:l.c }}>{l.x}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px' }}>
            <DualHead th="ทัพที่ร่วมศึก" cjk="參戰" />
            <div style={{ display:'flex', flexDirection:'column', gap:11, marginTop:14 }}>
              {QUEST.steps.map((s,i)=>{
                const a = byId(s.agent); const ss = stepState(s.state);
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:11 }}>
                    <SectGlyph char={a.glyph} accent={a.accent} size={34} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, color:'var(--tx)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.alias}</div>
                      <div style={{ fontSize:11, color:'var(--tx-faint)' }}>{a.sect}</div>
                    </div>
                    <span style={{ fontSize:11, color:ss.c }}>● {s.th || ss.th}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TaskPage });
