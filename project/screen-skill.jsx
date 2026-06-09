/* ====== หน้า Skill · ตำราวิทยายุทธ ====== */

function PageHead({ a, th, cjk, sub }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between',
      padding:'22px 32px 18px', borderBottom:'1px solid var(--ink-line)' }}>
      <div>
        <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
          <h1 className="jh-disp" style={{ fontSize:29, fontWeight:700 }}>{th}</h1>
          <span className="jh-cjk" style={{ fontSize:22, color:'var(--gold)', opacity:.75 }}>{cjk}</span>
        </div>
        <p style={{ color:'var(--tx-dim)', fontSize:13, marginTop:4 }}>{sub}</p>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 14px', borderRadius:8,
        border:'1px solid var(--ink-line)', background:'var(--ink-1)' }}>
        <SectGlyph char={a.glyph} accent={a.accent} size={38} />
        <div>
          <div className="jh-disp" style={{ fontSize:15, fontWeight:600, color:'var(--gold-hi)' }}>{a.alias}</div>
          <div style={{ fontSize:11.5, color:'var(--tx-faint)' }}>{a.sect} · เลเวล {a.level}</div>
        </div>
      </div>
    </div>
  );
}

function kindColor(k){
  return { 'อาวุธเอก':'var(--cinnabar-hi)', 'วิชาภายใน':'var(--gold-hi)', 'วิชาเสริม':'#9a7fc2', 'วิชาขั้นต้น':'var(--st-active)' }[k] || 'var(--gold)';
}

function SkillScroll({ s, featured }) {
  const c = kindColor(s.kind);
  return (
    <div className="jh-frame" style={{ position:'relative', display:'flex', gap:16,
      background: featured?'linear-gradient(120deg,#241a0f,#160f08)':'var(--ink-1)',
      border:`1px solid ${featured?'var(--gold-deep)':'var(--ink-line)'}`, borderRadius:6,
      padding: featured?'20px 22px':'16px 18px' }}>
      <div style={{ position:'relative', flex:'0 0 auto' }}>
        <div style={{ width:featured?72:58, height:featured?72:58, borderRadius:8, display:'grid', placeItems:'center',
          background:'radial-gradient(120% 120% at 30% 25%, #2c2417, #15100a)', border:`1px solid ${c}55` }}>
          <span className="jh-cjk" style={{ fontSize:featured?30:24, color:c }}>{s.cjk[0]}</span>
        </div>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:10, minWidth:0 }}>
            <h3 className="jh-disp" style={{ fontSize:featured?21:17, fontWeight:600, color:'var(--tx)' }}>{s.name}</h3>
            <span className="jh-cjk" style={{ fontSize:featured?15:13, color:c, opacity:.8 }}>{s.cjk}</span>
          </div>
          <span style={{ fontSize:11, padding:'3px 10px', borderRadius:99, color:c, border:`1px solid ${c}`,
            background:'rgba(0,0,0,.2)', whiteSpace:'nowrap' }}>{s.kind}</span>
        </div>
        <p style={{ fontSize:13, color:'var(--tx-dim)', marginTop:7, lineHeight:1.5 }}>{s.desc}</p>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:13 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11.5, marginBottom:5 }}>
              <span style={{ color:'var(--tx-faint)', fontFamily:'var(--font-mono)' }}>ขั้น {s.lvl}/{s.max}</span>
              <span style={{ color:'var(--tx-faint)', fontFamily:'var(--font-mono)' }}>{Math.round(s.xp*100)}% สู่ขั้นถัดไป</span>
            </div>
            <span style={{ display:'flex', gap:4 }}>
              {Array.from({length:s.max}).map((_,i)=>(
                <span key={i} style={{ flex:1, height:6, borderRadius:3,
                  background: i<s.lvl ? c : 'var(--ink-3)',
                  opacity: i<s.lvl?1:.6 }}></span>
              ))}
            </span>
          </div>
          <div style={{ textAlign:'right' }}>
            <div className="jh-tag">ใช้ไปแล้ว</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:15, color:'var(--gold)' }}>{s.uses.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillPage() {
  const a = AGENTS[3];
  const totalLvl = SKILLS.reduce((n,s)=>n+s.lvl,0);
  const cats = ['อาวุธเอก','วิชาภายใน','วิชาเสริม','วิชาขั้นต้น'];
  return (
    <div className="jh jh-ink" style={{ width:1280, minHeight:820 }}>
      <PageHead a={a} th="ตำราวิทยายุทธ" cjk="武學秘笈" sub="วิชาและกระบวนท่าที่จอมยุทธผู้นี้ฝึกฝนสำเร็จ" />
      <div style={{ padding:'24px 32px 32px', display:'grid', gridTemplateColumns:'272px 1fr', gap:24 }}>
        {/* ซ้าย — สรุป + หมวด */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div style={{ background:'linear-gradient(160deg,#221a10,#15100a)', border:'1px solid var(--gold-deep)',
            borderRadius:6, padding:'18px 20px', textAlign:'center' }}>
            <div className="jh-tag">พลังวิชารวม</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:40, color:'var(--gold)', lineHeight:1, margin:'8px 0' }}>{totalLvl}</div>
            <div style={{ display:'flex', justifyContent:'center' }}><OrnRule w={70} /></div>
            <p style={{ fontSize:12, color:'var(--tx-dim)', marginTop:10 }}>{SKILLS.length} วิชา · 1 อาวุธเอกถึงขั้นสูงสุด</p>
          </div>
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px' }}>
            <div className="jh-tag" style={{ marginBottom:12 }}>หมวดวิชา · 分類</div>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {cats.map(c=>{
                const n = SKILLS.filter(s=>s.kind===c).length;
                return (
                  <div key={c} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:9, fontSize:13, color:'var(--tx-dim)' }}>
                      <span style={{ width:9, height:9, transform:'rotate(45deg)', background:kindColor(c) }}></span>{c}
                    </span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--tx-faint)' }}>{n}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ background:'var(--ink-1)', border:'1px dashed var(--ink-line)', borderRadius:6, padding:'16px 18px', textAlign:'center' }}>
            <div className="jh-cjk" style={{ fontSize:22, color:'var(--gold-deep)' }}>悟</div>
            <p style={{ fontSize:12.5, color:'var(--tx-dim)', marginTop:8, lineHeight:1.5 }}>ฝึกวิชาใหม่ได้เมื่อสะสม<br/>ประสบการณ์ภารกิจครบ</p>
            <Btn kind="ghost" sm style={{ marginTop:12 }}>เปิดคัมภีร์ใหม่</Btn>
          </div>
        </div>

        {/* ขวา — รายการวิชา */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <SkillScroll s={SKILLS[0]} featured />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {SKILLS.slice(1).map(s=> <SkillScroll key={s.name} s={s} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SkillPage, PageHead });
