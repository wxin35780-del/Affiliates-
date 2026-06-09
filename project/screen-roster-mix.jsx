/* ====== หน้ารวม Agent · แนวผสม (1 + 3) ====== */
const { useState: useStateMix } = React;

function MixPickCard({ a, active, onPick }) {
  const st = STATUS[a.status];
  const [hover, setHover] = useStateMix(false);
  return (
    <div onClick={()=>onPick(a.id)} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      className="jh-frame" style={{ position:'relative', cursor:'pointer', borderRadius:5, padding:8,
        background: active?'linear-gradient(160deg,#2a2013,#160f08)':'var(--ink-1)',
        border:`1px solid ${active?'var(--gold)':'var(--ink-line)'}`,
        boxShadow: active?'0 0 0 1px var(--gold), 0 8px 24px rgba(200,162,74,.18)'
                 : hover?'0 6px 18px rgba(0,0,0,.35)':'none',
        transform: hover&&!active?'translateY(-2px)':'none', transition:'all .16s' }}>
      {active && <><HudCorner pos="tl"/><HudCorner pos="tr"/><HudCorner pos="bl"/><HudCorner pos="br"/></>}
      <div style={{ position:'relative' }}>
        <Portrait glyph={a.glyph} accent={a.accent} label="" style={{ height:100 }} />
        <div style={{ position:'absolute', top:7, right:7, display:'flex', alignItems:'center', gap:5,
          padding:'2px 8px', borderRadius:99, background:'rgba(8,6,3,.6)', border:`1px solid ${st.color}66` }}>
          <span style={{ width:6, height:6, borderRadius:9, background:st.color }}></span>
          <span style={{ fontSize:10, color:st.color }}>{st.th}</span>
        </div>
        <div style={{ position:'absolute', left:7, bottom:7 }}><SectGlyph char={a.glyph} accent={a.accent} size={34} /></div>
      </div>
      <div style={{ padding:'10px 6px 4px' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8 }}>
          <h3 className="jh-disp" style={{ fontSize:16, fontWeight:600, color: active?'var(--gold-hi)':'var(--tx)',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.alias}</h3>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gold)', flex:'0 0 auto' }}>Lv{a.level}</span>
        </div>
        <p style={{ fontSize:11, color:'var(--tx-faint)', marginTop:2 }}>{a.sect} · {a.real}</p>
        <div style={{ height:1, background:'var(--ink-line)', margin:'9px 0 8px' }}></div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <TierPips tier={a.tier} />
          <span className="jh-tag">{a.power.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function RosterMix() {
  const [sel, setSel] = useStateMix('marshal');
  const a = AGENTS.find(x=>x.id===sel) || AGENTS[0];
  const sects = ['ทั้งหมด','ตำหนักใหญ่','หอสอดแนม','เรือนอักษร','หอภาพมายา','สายพเนจร'];
  const totalPower = AGENTS.reduce((n,x)=>n+x.power,0);
  const activeN = AGENTS.filter(x=>x.status==='active').length;

  return (
    <div className="jh jh-ink" style={{ width:1280, minHeight:1004, display:'flex', flexDirection:'column' }}>
      {/* ===== หัว (จากแนว 1) ===== */}
      <div style={{ padding:'20px 30px 16px', borderBottom:'1px solid var(--ink-line)', flex:'0 0 auto' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:20 }}>
          <div>
            <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
              <h1 className="jh-disp" style={{ fontSize:30, fontWeight:700 }}>ทำเนียบยุทธจักร</h1>
              <span className="jh-cjk" style={{ fontSize:24, color:'var(--gold)', opacity:.75 }}>群俠錄</span>
            </div>
            <p style={{ color:'var(--tx-dim)', fontSize:13, marginTop:4 }}>กองทัพ Agent ทั้งสำนัก · ออกศึก {activeN} · พักฟื้น 1 · แตะการ์ดเพื่อเลือกจอมยุทธ</p>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 13px', borderRadius:6,
              border:'1px solid var(--ink-line)', background:'var(--ink-1)', color:'var(--tx-faint)', fontSize:13, width:200 }}>
              <span style={{ opacity:.6 }}>⌕</span><span>ค้นหาจอมยุทธ…</span>
            </div>
            <Btn kind="gold" sm>+ เรียกจอมยุทธ</Btn>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:14, flexWrap:'wrap' }}>
          {sects.map((s,i)=>(
            <span key={s} style={{ fontSize:12.5, padding:'5px 13px', borderRadius:99,
              border:`1px solid ${i===0?'var(--gold)':'var(--ink-line)'}`,
              background:i===0?'rgba(200,162,74,.12)':'transparent',
              color:i===0?'var(--gold-hi)':'var(--tx-dim)', cursor:'pointer' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ===== ตัว (เลย์เอาต์จากแนว 3) ===== */}
      <div style={{ flex:1, display:'flex', minHeight:0 }}>
        {/* ฮีโร่ซ้าย — รายละเอียดตัวที่เลือก (ความรวยจากแนว 1) */}
        <div style={{ width:432, flex:'0 0 auto', padding:'24px 28px',
          background:'linear-gradient(180deg,#1f1810,#100c07)', borderRight:'1px solid var(--ink-line)' }}>
          <div className="jh-tag" style={{ color:'var(--cinnabar-hi)' }}>จอมยุทธที่เลือก · 選將</div>
          <div className="jh-frame" style={{ position:'relative', marginTop:14, borderRadius:5,
            border:'1px solid var(--gold-deep)', padding:7 }}>
            <Portrait glyph={a.glyph} accent={a.accent} label="ภาพจอมยุทธเต็มตัว" style={{ height:268, borderRadius:3 }} />
            <div style={{ position:'absolute', top:15, left:15 }}><StatusBadge status={a.status} size="sm" /></div>
            <div style={{ position:'absolute', bottom:15, right:15 }}><Seal text={a.glyph} size={48} /></div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:16 }}>
            <SectGlyph char={a.glyph} accent={a.accent} size={30} ring={false} />
            <span className="jh-tag" style={{ color:a.accent }}>{a.sect} · {a.sectCjk}</span>
          </div>
          <h2 className="jh-disp" style={{ fontSize:30, fontWeight:700, color:'var(--gold-hi)', marginTop:7 }}>{a.alias}</h2>
          <p style={{ fontSize:13, color:'var(--tx-dim)', marginTop:3 }}>{a.real} · {a.role}</p>
          <p style={{ fontSize:13, color:'var(--tx-faint)', marginTop:12, lineHeight:1.55 }}>{a.persona}</p>

          {/* แถบสถิติ */}
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            {[['เลเวล', a.level, 'var(--gold)'],['ระดับชั้น', TIERS[a.tier], 'var(--gold-hi)'],['พลัง', a.power.toLocaleString(), 'var(--st-active)']].map(([l,v,c],i)=>(
              <div key={i} style={{ flex:1, background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'10px 12px' }}>
                <div className="jh-tag">{l}</div>
                <div style={{ fontFamily: i===1?'var(--font-body)':'var(--font-mono)', fontSize: i===1?13:18, fontWeight:i===1?600:400, color:c, marginTop:5 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:14 }}>
            {a.expertise.map(e=>(
              <span key={e} style={{ fontSize:11.5, padding:'4px 10px', borderRadius:5,
                background:'var(--ink-3)', border:'1px solid var(--ink-line)', color:'var(--tx-dim)' }}>{e}</span>
            ))}
          </div>

          <div style={{ display:'flex', gap:10, marginTop:18 }}>
            <Btn kind="gold" style={{ flex:1 }}>มอบหมายภารกิจ</Btn>
            <Btn kind="ghost">ดูวิชา & คัมภีร์</Btn>
          </div>
        </div>

        {/* กริดเลือกขวา — การ์ดกรอบทอง + ไฮไลต์แบบ HUD (แนว 3) */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'22px 28px', minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <DualHead th="กองกำลังในสังกัด" cjk="陣容" />
            <span className="jh-tag">ทั้งหมด {AGENTS.length} · ออกศึก {activeN}</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, alignContent:'start' }}>
            {AGENTS.map(x=> <MixPickCard key={x.id} a={x} active={x.id===sel} onPick={setSel} />)}
          </div>

          {/* แถบบัญชาการล่าง (แนว 3) */}
          <div style={{ marginTop:'auto', paddingTop:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'14px 20px', borderRadius:7, border:'1px solid var(--gold-deep)',
              background:'linear-gradient(110deg,#221a10,#15100a)' }}>
              <div style={{ display:'flex', gap:28 }}>
                <div><div className="jh-tag">พลังทัพรวม</div><div style={{ fontFamily:'var(--font-mono)', fontSize:21, color:'var(--gold)', marginTop:3 }}>{totalPower.toLocaleString()}</div></div>
                <div style={{ alignSelf:'stretch', width:1, background:'var(--ink-line)' }}></div>
                <div><div className="jh-tag">กำลังออกศึก</div><div style={{ fontFamily:'var(--font-mono)', fontSize:21, color:'var(--st-active)', marginTop:3 }}>{activeN}</div></div>
                <div><div className="jh-tag">ภารกิจวันนี้</div><div style={{ fontFamily:'var(--font-mono)', fontSize:21, color:'var(--tx)', marginTop:3 }}>3</div></div>
              </div>
              <Btn kind="gold">จัดทัพออกศึก →</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RosterMix });
