/* ====== หน้า Memory · คลังคัมภีร์ ====== */

function tagInfo(t){
  return {
    brand:    { th:'คัมภีร์แบรนด์', cjk:'牌', c:'var(--gold-hi)' },
    audience: { th:'ตำราผู้ชม',     cjk:'眾', c:'var(--st-active)' },
    pattern:  { th:'ม้วนสไตล์',     cjk:'式', c:'#9a7fc2' },
    policy:   { th:'บันทึกข้อห้าม', cjk:'戒', c:'var(--cinnabar-hi)' },
  }[t] || { th:t, cjk:'記', c:'var(--gold)' };
}

function ScrollCard({ m }) {
  const ti = tagInfo(m.tag);
  return (
    <div className="jh-frame" style={{ position:'relative', background:'var(--ink-1)',
      border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px' }}>
      <div style={{ position:'absolute', top:14, right:14 }}>
        <span style={{ fontSize:11, padding:'3px 10px', borderRadius:99, color:ti.c, border:`1px solid ${ti.c}55`,
          background:'rgba(0,0,0,.2)' }}>{ti.th} <span className="jh-cjk">{ti.cjk}</span></span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:9, paddingRight:120 }}>
        <span className="jh-cjk" style={{ fontSize:24, color:ti.c, opacity:.85 }}>{ti.cjk}</span>
        <h3 className="jh-disp" style={{ fontSize:17, fontWeight:600, color:'var(--tx)' }}>{m.title}</h3>
      </div>
      <p style={{ fontSize:13, color:'var(--tx-dim)', lineHeight:1.55 }}>{m.note}</p>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:14 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:5 }}>
            <span className="jh-tag">ความแม่นของความทรงจำ</span>
            <span style={{ fontFamily:'var(--font-mono)', color:ti.c }}>{Math.round(m.strength*100)}%</span>
          </div>
          <Meter value={m.strength} color={ti.c} />
        </div>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--tx-faint)' }}>จำเมื่อ {m.age}</span>
      </div>
    </div>
  );
}

function MemoryPage() {
  const a = AGENTS[3];
  const used = 0.58;
  return (
    <div className="jh jh-ink" style={{ width:1280, minHeight:820 }}>
      <PageHead a={a} th="คลังคัมภีร์" cjk="記憶閣" sub="ความทรงจำระยะยาวที่สั่งสม และความทรงจำเฉพาะกิจของภารกิจปัจจุบัน" />
      <div style={{ padding:'24px 32px 32px', display:'grid', gridTemplateColumns:'258px 1fr 320px', gap:22 }}>
        {/* ซ้าย — มาตรวัดคลัง */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div style={{ background:'linear-gradient(160deg,#221a10,#15100a)', border:'1px solid var(--gold-deep)',
            borderRadius:6, padding:'18px 20px' }}>
            <div className="jh-tag">ความจุคลังคัมภีร์</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, margin:'10px 0 12px' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:34, color:'var(--gold)' }}>{Math.round(used*100)}%</span>
              <span style={{ fontSize:12, color:'var(--tx-faint)' }}>· 11.6K / 20K โทเค็น</span>
            </div>
            <Meter value={used} color="var(--gold)" h={7} />
            <p style={{ fontSize:12, color:'var(--tx-dim)', marginTop:11 }}>เมื่อใกล้เต็ม สำนักจะหลอมรวมความทรงจำเก่าเป็นคัมภีร์ฉบับย่ออัตโนมัติ</p>
          </div>
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px' }}>
            <div className="jh-tag" style={{ marginBottom:12 }}>แยกตามหมวด</div>
            <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
              {['brand','audience','pattern','policy'].map(t=>{
                const ti = tagInfo(t);
                return (
                  <div key={t} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:9, fontSize:13, color:'var(--tx-dim)' }}>
                      <span className="jh-cjk" style={{ color:ti.c, fontSize:15 }}>{ti.cjk}</span>{ti.th}
                    </span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--tx-faint)' }}>{MEMORY.longTerm.filter(m=>m.tag===t).length}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <Btn kind="ghost" sm>+ เพิ่มคัมภีร์ด้วยตนเอง</Btn>
        </div>

        {/* กลาง — ความทรงจำระยะยาว */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <DualHead th="ความทรงจำระยะยาว" cjk="長記" />
            <span className="jh-tag">{MEMORY.longTerm.length} ม้วนคัมภีร์</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {MEMORY.longTerm.map((m,i)=> <ScrollCard key={i} m={m} />)}
          </div>
        </div>

        {/* ขวา — ความทรงจำเฉพาะกิจ */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <DualHead th="เฉพาะกิจ" cjk="短記" />
            <StatusBadge status="active" size="sm" />
          </div>
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'18px 20px' }}>
            <div style={{ fontSize:12.5, color:'var(--tx-dim)', marginBottom:16 }}>บริบทของภารกิจที่กำลังทำ — จะถูกล้างเมื่อจบศึก</div>
            <div style={{ position:'relative', paddingLeft:18 }}>
              <span style={{ position:'absolute', left:4, top:4, bottom:4, width:1, background:'var(--ink-line)' }}></span>
              {MEMORY.shortTerm.map((m,i)=>{
                const live = m.t==='now';
                return (
                  <div key={i} style={{ position:'relative', paddingBottom: i<MEMORY.shortTerm.length-1?18:0 }}>
                    <span style={{ position:'absolute', left:-18, top:3, width:9, height:9, borderRadius:9,
                      background: live?'var(--st-active)':'var(--gold-deep)',
                      boxShadow: live?'0 0 8px var(--st-active)':'none' }}></span>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:10.5, color: live?'var(--st-active)':'var(--tx-faint)', letterSpacing:'.08em' }}>{m.t.toUpperCase()}</div>
                    <div style={{ fontSize:13, color: live?'var(--tx)':'var(--tx-dim)', marginTop:3, lineHeight:1.45 }}>{m.txt}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop:16, background:'var(--ink-2)', border:'1px dashed var(--ink-line)', borderRadius:6, padding:'14px 16px' }}>
            <div className="jh-tag" style={{ marginBottom:8 }}>กำลังเชื่อมโยงคัมภีร์</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {['คัมภีร์แบรนด์','ม้วนสไตล์','ตำราผู้ชม'].map(x=>(
                <span key={x} style={{ fontSize:11.5, padding:'4px 10px', borderRadius:5, color:'var(--gold-hi)',
                  border:'1px solid var(--gold-deep)', background:'rgba(200,162,74,.08)' }}>{x}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MemoryPage });
