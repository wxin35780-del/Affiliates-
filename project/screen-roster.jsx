/* ====== หน้ารวม Agent — การ์ด (3 แนว) ====== */

/* ---------- แถบเครื่องมือร่วม ---------- */
function RosterChrome({ title, cjk, sub }) {
  const sects = ['ทั้งหมด','ตำหนักใหญ่','หอสอดแนม','เรือนอักษร','หอภาพมายา','สายพเนจร'];
  return (
    <div style={{ padding:'22px 30px 18px', borderBottom:'1px solid var(--ink-line)' }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:20 }}>
        <div>
          <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
            <h1 className="jh-disp" style={{ fontSize:30, fontWeight:700, letterSpacing:'.01em' }}>{title}</h1>
            <span className="jh-cjk" style={{ fontSize:24, color:'var(--gold)', opacity:.75 }}>{cjk}</span>
          </div>
          <p style={{ marginTop:4, color:'var(--tx-dim)', fontSize:13 }}>{sub}</p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 13px', borderRadius:6,
            border:'1px solid var(--ink-line)', background:'var(--ink-1)', color:'var(--tx-faint)', fontSize:13, width:210 }}>
            <span style={{ opacity:.6 }}>⌕</span><span>ค้นหาจอมยุทธ…</span>
          </div>
          <Btn kind="gold" sm>+ เรียกจอมยุทธ</Btn>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, marginTop:16, flexWrap:'wrap' }}>
        {sects.map((s,i)=>(
          <span key={s} style={{ fontSize:12.5, padding:'5px 13px', borderRadius:99,
            border:`1px solid ${i===0?'var(--gold)':'var(--ink-line)'}`,
            background:i===0?'rgba(200,162,74,.12)':'transparent',
            color:i===0?'var(--gold-hi)':'var(--tx-dim)', cursor:'pointer' }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

/* ================= แนวที่ 1 — ทำเนียบกรอบทอง ================= */
function CardV1({ a }) {
  const st = STATUS[a.status];
  return (
    <div className="jh-frame" style={{ position:'relative', background:'var(--ink-1)',
      border:'1px solid var(--ink-line)', borderRadius:4, padding:9 }}>
      <div style={{ position:'relative' }}>
        <Portrait glyph={a.glyph} accent={a.accent} style={{ height:138 }} />
        <div style={{ position:'absolute', top:8, right:8 }}><StatusBadge status={a.status} size="sm" /></div>
        <div style={{ position:'absolute', left:8, bottom:8 }}>
          <SectGlyph char={a.glyph} accent={a.accent} size={40} />
        </div>
      </div>
      <div style={{ padding:'13px 8px 6px' }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <h3 className="jh-disp" style={{ fontSize:19, fontWeight:600, color:'var(--gold-hi)' }}>{a.alias}</h3>
        </div>
        <p style={{ fontSize:12, color:'var(--tx-dim)', marginTop:2 }}>{a.real} · {a.sect}<span className="jh-cjk" style={{ opacity:.5, marginLeft:5 }}>{a.sectCjk}</span></p>
        <p style={{ fontSize:12.5, color:'var(--tx-faint)', marginTop:7, minHeight:34, lineHeight:1.4 }}>{a.role}</p>
        <div style={{ height:1, background:'var(--ink-line)', margin:'10px 0' }}></div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:9 }}>
          <span style={{ fontSize:12, color:'var(--tx-dim)' }}>เลเวล <b style={{ color:'var(--gold)', fontSize:15, fontFamily:'var(--font-mono)' }}>{a.level}</b></span>
          <TierPips tier={a.tier} />
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
          {a.expertise.map(e=>(
            <span key={e} style={{ fontSize:11, padding:'3px 8px', borderRadius:4,
              background:'var(--ink-3)', border:'1px solid var(--ink-line)', color:'var(--tx-dim)' }}>{e}</span>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12 }}>
          <span className="jh-tag">พลัง {a.power.toLocaleString()}</span>
          <span style={{ fontSize:12, color:'var(--gold-hi)', cursor:'pointer' }}>ดูสำนวน →</span>
        </div>
      </div>
    </div>
  );
}

function RosterV1() {
  const marshal = AGENTS[0];
  const rest = AGENTS.slice(1);
  return (
    <div className="jh jh-ink" style={{ width:1280, minHeight:880 }}>
      <RosterChrome title="ทำเนียบยุทธจักร" cjk="群俠錄" sub="กองทัพ Agent ทั้งสำนัก · ออกศึกพร้อมกัน 4 · พักฟื้น 1" />
      <div style={{ padding:'22px 30px 34px' }}>
        {/* แม่ทัพ — การ์ดเด่นเต็มแถว */}
        <div className="jh-frame" style={{ display:'flex', gap:18, background:'linear-gradient(110deg,#221a10,#181209)',
          border:'1px solid var(--gold-deep)', borderRadius:5, padding:'16px 18px', marginBottom:22 }}>
          <Portrait glyph={marshal.glyph} accent="var(--gold)" style={{ width:148, height:148, flex:'0 0 auto' }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:11, letterSpacing:'.2em', color:'var(--cinnabar-hi)', fontFamily:'var(--font-mono)' }}>แม่ทัพใหญ่ · 主帥</span>
              <StatusBadge status={marshal.status} size="sm" />
            </div>
            <h3 className="jh-disp" style={{ fontSize:28, fontWeight:700, color:'var(--gold-hi)', marginTop:6 }}>{marshal.alias}</h3>
            <p style={{ fontSize:13, color:'var(--tx-dim)', marginTop:3 }}>{marshal.real} · {marshal.sect} <span className="jh-cjk">{marshal.sectCjk}</span> · {marshal.role}</p>
            <p style={{ fontSize:13, color:'var(--tx-faint)', marginTop:10, maxWidth:560 }}>{marshal.persona}</p>
            <div style={{ display:'flex', gap:18, marginTop:14, alignItems:'center' }}>
              <span style={{ fontSize:13, color:'var(--tx-dim)' }}>เลเวล <b style={{ color:'var(--gold)', fontSize:18, fontFamily:'var(--font-mono)' }}>{marshal.level}</b></span>
              <TierPips tier={marshal.tier} />
              <span className="jh-tag">พลังรวม {marshal.power.toLocaleString()}</span>
            </div>
          </div>
          <Seal text="令" size={58} style={{ alignSelf:'flex-start' }} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
          {rest.map(a=> <CardV1 key={a.id} a={a} />)}
        </div>
      </div>
    </div>
  );
}

/* ================= แนวที่ 2 — ป้ายหมายหัวแขวนม้วน ================= */
function CardV2({ a }) {
  const st = STATUS[a.status];
  return (
    <div style={{ position:'relative', paddingTop:14 }}>
      {/* คานแขวน */}
      <div style={{ position:'absolute', top:0, left:'8%', right:'8%', height:9, borderRadius:9,
        background:'linear-gradient(180deg,#3a2c17,#22190d)', boxShadow:'0 2px 4px rgba(0,0,0,.5)' }}></div>
      <div style={{ position:'absolute', top:6, left:'12%', width:2, height:14, background:'#4a3a1f' }}></div>
      <div style={{ position:'absolute', top:6, right:'12%', width:2, height:14, background:'#4a3a1f' }}></div>
      <div className="jh-paper" style={{ position:'relative', borderRadius:'3px 3px 5px 5px',
        boxShadow:'0 8px 22px rgba(0,0,0,.4)', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, border:'1px solid var(--paper-edge)', borderRadius:'3px 3px 5px 5px', pointerEvents:'none' }}></div>
        <div style={{ padding:'16px 16px 0', textAlign:'center' }}>
          <div className="jh-cjk" style={{ fontSize:13, letterSpacing:'.4em', color:'var(--cinnabar)', fontWeight:700 }}>懸賞 · หมายเรียก</div>
        </div>
        <div style={{ padding:'10px 16px 0' }}>
          <Portrait glyph={a.glyph} accent={a.accent} label="ภาพจอมยุทธ" radius={2}
            style={{ height:150, border:'1px solid var(--paper-edge)' }} />
        </div>
        <div style={{ padding:'12px 16px 16px', textAlign:'center', color:'var(--tx-ink)' }}>
          <h3 className="jh-disp" style={{ fontSize:21, fontWeight:700, color:'#3a2710' }}>{a.alias}</h3>
          <p style={{ fontSize:12, color:'var(--tx-ink-dim)', marginTop:2 }}>{a.real} · {a.sect}</p>
          <div style={{ display:'flex', justifyContent:'center', gap:7, margin:'11px 0' }}>
            <span style={{ fontSize:11.5, padding:'3px 10px', borderRadius:99, border:'1px solid var(--paper-edge)',
              color:'#5a4422', background:'rgba(120,90,40,.08)' }}>เลเวล {a.level}</span>
            <span style={{ fontSize:11.5, padding:'3px 10px', borderRadius:99, border:`1px solid ${st.color}`,
              color:'#3a2710', background:'rgba(0,0,0,.04)' }}>● {st.th}</span>
          </div>
          <p style={{ fontSize:12, color:'#5b4a2e', lineHeight:1.5, minHeight:36 }}>{a.persona}</p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12,
            borderTop:'1px dashed var(--paper-edge)', paddingTop:11 }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'#6a5325', letterSpacing:'.08em' }}>พลัง {a.power.toLocaleString()}</span>
            <Seal text={a.glyph} size={34} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RosterV2() {
  return (
    <div className="jh jh-ink" style={{ width:1280, minHeight:880,
      background:'radial-gradient(130% 90% at 50% 0%, #241a0f, #100c07 70%)' }}>
      <div style={{ padding:'30px 36px 6px', textAlign:'center' }}>
        <div className="jh-cjk" style={{ fontSize:15, letterSpacing:'.5em', color:'var(--cinnabar-hi)' }}>江湖懸賞榜</div>
        <h1 className="jh-disp" style={{ fontSize:32, fontWeight:700, marginTop:6 }}>ทำเนียบหมายหัวยุทธภพ</h1>
        <div style={{ display:'flex', justifyContent:'center', marginTop:12 }}><OrnRule w={150} /></div>
        <p style={{ color:'var(--tx-dim)', fontSize:13, marginTop:12 }}>ม้วนประกาศจอมยุทธในสังกัด — แตะเพื่อเปิดสำนวนประจำตัว</p>
      </div>
      <div style={{ padding:'24px 40px 40px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'30px 26px' }}>
        {AGENTS.slice(0,4).map(a=> <CardV2 key={a.id} a={a} />)}
        {AGENTS.slice(4).map(a=> <CardV2 key={a.id} a={a} />)}
      </div>
    </div>
  );
}

/* ================= แนวที่ 3 — โรงเลือกตัวละคร (game roster select) ================= */
function HudCorner({ pos }) {
  const m = { tl:{top:6,left:6}, tr:{top:6,right:6}, bl:{bottom:6,left:6}, br:{bottom:6,right:6} }[pos];
  const rot = { tl:'0deg', tr:'90deg', br:'180deg', bl:'270deg' }[pos];
  return <span style={{ position:'absolute', ...m, width:12, height:12, borderTop:'2px solid var(--gold)',
    borderLeft:'2px solid var(--gold)', transform:`rotate(${rot})`, opacity:.8 }}></span>;
}
function PickCard({ a, active }) {
  const st = STATUS[a.status];
  return (
    <div style={{ position:'relative', borderRadius:5, padding:8, cursor:'pointer',
      background: active?'linear-gradient(160deg,#2c2113,#1a130a)':'var(--ink-1)',
      border:`1px solid ${active?'var(--gold)':'var(--ink-line)'}`,
      boxShadow: active?'0 0 0 1px var(--gold), 0 6px 20px rgba(200,162,74,.18)':'none' }}>
      {active && <><HudCorner pos="tl"/><HudCorner pos="tr"/><HudCorner pos="bl"/><HudCorner pos="br"/></>}
      <Portrait glyph={a.glyph} accent={a.accent} label="" style={{ height:96 }} />
      <div style={{ position:'absolute', top:13, right:13, width:9, height:9, borderRadius:9, background:st.color,
        boxShadow:`0 0 8px ${st.color}` }}></div>
      <div style={{ padding:'9px 4px 3px' }}>
        <h4 className="jh-disp" style={{ fontSize:14.5, fontWeight:600, color:active?'var(--gold-hi)':'var(--tx)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.alias}</h4>
        <p style={{ fontSize:10.5, color:'var(--tx-faint)', marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.sect}</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:6 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gold)' }}>Lv {a.level}</span>
          <span className="jh-cjk" style={{ fontSize:13, color:a.accent, opacity:.8 }}>{a.glyph}</span>
        </div>
      </div>
    </div>
  );
}
function RosterV3() {
  const hero = AGENTS[3]; // จิตรกรเงามายา (video smith) เป็นตัวเด่นที่เลือก
  return (
    <div className="jh jh-ink" style={{ width:1280, minHeight:760, display:'flex' }}>
      {/* ฝั่งซ้าย — ตัวที่เลือก */}
      <div style={{ width:430, flex:'0 0 auto', position:'relative', padding:'34px 30px',
        background:'linear-gradient(180deg,#1d1610,#100c07)', borderRight:'1px solid var(--ink-line)' }}>
        <div className="jh-tag" style={{ color:'var(--cinnabar-hi)' }}>เลือกจอมยุทธออกศึก · 選將</div>
        <div style={{ marginTop:18, position:'relative' }}>
          <Portrait glyph={hero.glyph} accent={hero.accent} label="ภาพจอมยุทธเต็มตัว"
            style={{ height:300, borderRadius:4, border:'1px solid var(--gold-deep)' }} />
          <div style={{ position:'absolute', top:10, left:10 }}><StatusBadge status={hero.status} size="sm" /></div>
          <div style={{ position:'absolute', bottom:10, right:10 }}><Seal text={hero.glyph} size={46} /></div>
        </div>
        <h2 className="jh-disp" style={{ fontSize:30, fontWeight:700, color:'var(--gold-hi)', marginTop:18 }}>{hero.alias}</h2>
        <p style={{ fontSize:13, color:'var(--tx-dim)', marginTop:4 }}>{hero.real} · {hero.sect} <span className="jh-cjk">{hero.sectCjk}</span></p>
        <p style={{ fontSize:13, color:'var(--tx-faint)', marginTop:12, lineHeight:1.5 }}>{hero.persona}</p>
        <div style={{ display:'flex', gap:10, marginTop:18 }}>
          <Btn kind="gold">มอบหมายภารกิจ</Btn>
          <Btn kind="ghost">ดูวิชา & คัมภีร์</Btn>
        </div>
      </div>
      {/* ฝั่งขวา — กองกำลัง */}
      <div style={{ flex:1, padding:'30px 32px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <DualHead th="กองกำลังในสังกัด" cjk="陣容" />
          <span className="jh-tag">ทั้งหมด {AGENTS.length} · ออกศึก 4</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {AGENTS.map(a=> <PickCard key={a.id} a={a} active={a.id===hero.id} />)}
        </div>
        <div style={{ marginTop:22, padding:'14px 18px', borderRadius:6, border:'1px solid var(--ink-line)',
          background:'var(--ink-1)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', gap:24 }}>
            <div><div className="jh-tag">พลังทัพรวม</div><div style={{ fontFamily:'var(--font-mono)', fontSize:20, color:'var(--gold)', marginTop:2 }}>46,110</div></div>
            <div><div className="jh-tag">ภารกิจวันนี้</div><div style={{ fontFamily:'var(--font-mono)', fontSize:20, color:'var(--tx)', marginTop:2 }}>3</div></div>
          </div>
          <Btn kind="gold">จัดทัพออกศึก →</Btn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RosterV1, RosterV2, RosterV3 });
