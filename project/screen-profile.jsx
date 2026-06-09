/* ====== โปรไฟล์ Agent · สำนวนประจำตัว ====== */

function Attr({ label, value, color='var(--gold)' }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5, marginBottom:5 }}>
        <span style={{ color:'var(--tx-dim)' }}>{label}</span>
        <span style={{ fontFamily:'var(--font-mono)', color }}>{Math.round(value*100)}</span>
      </div>
      <Meter value={value} color={color} />
    </div>
  );
}

function ProfTab({ label, cjk, active }) {
  return (
    <div style={{ padding:'10px 18px', cursor:'pointer', position:'relative',
      color:active?'var(--gold-hi)':'var(--tx-dim)', fontWeight:active?600:400, fontSize:14 }}>
      {label} <span className="jh-cjk" style={{ fontSize:12, opacity:.6 }}>{cjk}</span>
      {active && <span style={{ position:'absolute', left:14, right:14, bottom:0, height:2, background:'var(--gold)' }}></span>}
    </div>
  );
}

function Profile() {
  const a = AGENTS[3]; // จิตรกรเงามายา
  const missions = [
    { name:'คลิปรีวิว “เซรั่มหยกขาว”', when:'กำลังทำ', res:'9:16 · 62%', state:'active' },
    { name:'ชุดโฆษณากันแดด 3 เวอร์ชัน', when:'เมื่อวาน', res:'CTR +18%', state:'done' },
    { name:'คลิปเปิดตัวลิปสติก', when:'2 วันก่อน', res:'ยอดดู 1.2M', state:'done' },
    { name:'รีลรวมรีวิวลูกค้า', when:'4 วันก่อน', res:'เซฟ 8.4K', state:'done' },
  ];
  return (
    <div className="jh jh-ink" style={{ width:1280, minHeight:900 }}>
      {/* แบนเนอร์ */}
      <div style={{ position:'relative', padding:'26px 32px', borderBottom:'1px solid var(--ink-line)',
        background:'linear-gradient(120deg,#221a10 0%,#15100a 60%)' }}>
        <div style={{ display:'flex', gap:22 }}>
          <div style={{ position:'relative' }}>
            <Portrait glyph={a.glyph} accent={a.accent} label="ภาพจอมยุทธเต็มตัว"
              style={{ width:150, height:186, borderRadius:4, border:'1px solid var(--gold-deep)' }} />
            <div style={{ position:'absolute', bottom:-10, right:-10 }}><Seal text={a.glyph} size={44} /></div>
          </div>
          <div style={{ flex:1, paddingTop:6 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span className="jh-tag" style={{ color:a.accent }}>{a.sect} · {a.sectCjk}</span>
              <StatusBadge status={a.status} size="sm" />
            </div>
            <h1 className="jh-disp" style={{ fontSize:34, fontWeight:700, color:'var(--gold-hi)', marginTop:8 }}>{a.alias}</h1>
            <p style={{ fontSize:14, color:'var(--tx-dim)', marginTop:3 }}>{a.real} · {a.role}</p>
            <p style={{ fontSize:13.5, color:'var(--tx-faint)', marginTop:12, maxWidth:620, lineHeight:1.55 }}>{a.persona}</p>
            <div style={{ display:'flex', gap:24, marginTop:16, alignItems:'center' }}>
              <span style={{ fontSize:13, color:'var(--tx-dim)' }}>เลเวล <b style={{ color:'var(--gold)', fontSize:20, fontFamily:'var(--font-mono)' }}>{a.level}</b></span>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <span className="jh-tag">ระดับชั้น</span>
                <span style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--gold-hi)' }}>{TIERS[a.tier]} <TierPips tier={a.tier} /></span>
              </div>
              <span style={{ fontSize:13, color:'var(--tx-dim)' }}>พลังภายใน <b style={{ color:'var(--gold)', fontSize:16, fontFamily:'var(--font-mono)' }}>{a.power.toLocaleString()}</b></span>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, alignSelf:'flex-start' }}>
            <Btn kind="gold">มอบหมายภารกิจ</Btn>
            <Btn kind="ghost" sm>ปรับจูนบุคลิก</Btn>
            <Btn kind="ink" sm>ให้พักฌาน</Btn>
          </div>
        </div>
        {/* แท็บ */}
        <div style={{ display:'flex', gap:4, marginTop:18, marginBottom:-26, borderBottom:'1px solid transparent' }}>
          <ProfTab label="สำนวน" cjk="總覽" active />
          <ProfTab label="วิชา" cjk="武學" />
          <ProfTab label="คลังคัมภีร์" cjk="記憶" />
          <ProfTab label="ภารกิจ" cjk="任務" />
        </div>
      </div>

      <div style={{ padding:'26px 32px 34px', display:'grid', gridTemplateColumns:'330px 1fr', gap:24 }}>
        {/* ซ้าย — คุณสมบัติ + ความเชี่ยวชาญ */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'18px 20px' }}>
            <DualHead th="คุณสมบัติ" cjk="屬性" />
            <div style={{ display:'flex', flexDirection:'column', gap:14, marginTop:16 }}>
              <Attr label="ความเร็ว" value={0.7} />
              <Attr label="ความเนี้ยบ" value={0.92} color="var(--gold-hi)" />
              <Attr label="ความคิดสร้างสรรค์" value={0.84} color="#9a7fc2" />
              <Attr label="ความแม่นยำ" value={0.78} />
              <Attr label="พลังภายใน (compute)" value={0.66} color="var(--st-active)" />
            </div>
          </div>
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'18px 20px' }}>
            <DualHead th="ความเชี่ยวชาญ" cjk="專精" />
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:14 }}>
              {a.expertise.concat(['ลิปซิงก์','สต็อกฟุตเทจ','ทรานสิชัน']).map(e=>(
                <span key={e} style={{ fontSize:12, padding:'5px 11px', borderRadius:5,
                  background:'var(--ink-3)', border:'1px solid var(--ink-line)', color:'var(--tx-dim)' }}>{e}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ขวา — สถิติ + วิชาเด่น + ภารกิจ */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
            {[['ภารกิจสำเร็จ','成',184],['คลิปที่ผลิต','片','1,420'],['ชม.เรนเดอร์','時',356],['อัตราผ่าน','率','97%']].map(([l,c,v])=>(
              <div key={l} style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'13px 15px' }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span className="jh-tag">{l}</span><span className="jh-cjk" style={{ color:'var(--gold)', opacity:.5, fontSize:13 }}>{c}</span></div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:23, color:'var(--gold)', marginTop:6 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <DualHead th="วิชาที่ติดตัว" cjk="武學" />
              <span style={{ fontSize:12, color:'var(--gold-hi)', cursor:'pointer' }}>ดูตำราทั้งหมด →</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14 }}>
              {SKILLS.slice(0,4).map(s=>(
                <div key={s.name} style={{ display:'flex', gap:12, padding:'11px 13px', borderRadius:6,
                  background:'var(--ink-2)', border:'1px solid var(--ink-line)' }}>
                  <SectGlyph char={s.cjk[0]} accent="var(--gold)" size={38} ring={false} />
                  <div style={{ minWidth:0, flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                      <span style={{ fontSize:13.5, fontWeight:600, color:'var(--tx)' }}>{s.name}</span>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gold)' }}>Lv{s.lvl}</span>
                    </div>
                    <div style={{ marginTop:7 }}><Meter value={s.lvl/s.max} h={4} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'18px 20px' }}>
            <DualHead th="ภารกิจล่าสุด" cjk="近期任務" />
            <div style={{ marginTop:12 }}>
              {missions.map((m,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'11px 2px', borderBottom: i<missions.length-1?'1px solid var(--ink-line)':'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                    <span style={{ width:8, height:8, borderRadius:9, background: m.state==='active'?'var(--st-active)':'var(--tx-faint)' }}></span>
                    <span style={{ fontSize:13.5, color:'var(--tx)' }}>{m.name}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:18 }}>
                    <span style={{ fontSize:12, color: m.state==='active'?'var(--st-active)':'var(--gold-hi)', fontFamily:'var(--font-mono)' }}>{m.res}</span>
                    <span style={{ fontSize:11.5, color:'var(--tx-faint)', width:70, textAlign:'right' }}>{m.when}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Profile });
