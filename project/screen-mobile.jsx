/* ====== เวอร์ชันมือถือ ====== */

function StatusBar() {
  return (
    <div style={{ height:38, display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 20px', flex:'0 0 auto' }}>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--tx)', fontWeight:500 }}>9:41</span>
      <span style={{ fontSize:11, color:'var(--tx-dim)', letterSpacing:'.1em' }}>江湖 · OS</span>
      <span style={{ display:'flex', gap:5, alignItems:'center', color:'var(--tx-dim)', fontSize:11 }}>▮▮▮ 􀙇</span>
    </div>
  );
}

function MobileTabBar({ active='roster' }) {
  const tabs = [['roster','รวม','群'],['dash','แดชบอร์ด','帥'],['task','ภารกิจ','令'],['me','โปรไฟล์','俠']];
  return (
    <div style={{ flex:'0 0 auto', display:'flex', borderTop:'1px solid var(--ink-line)',
      background:'var(--ink-haze)', padding:'9px 8px 14px' }}>
      {tabs.map(([k,l,c])=>{
        const on = k===active;
        return (
          <div key={k} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <span className="jh-cjk" style={{ fontSize:18, color:on?'var(--gold)':'var(--tx-faint)' }}>{c}</span>
            <span style={{ fontSize:10.5, color:on?'var(--gold-hi)':'var(--tx-faint)', fontWeight:on?600:400 }}>{l}</span>
          </div>
        );
      })}
    </div>
  );
}

function MobileShell({ children, tab }) {
  return (
    <div className="jh jh-ink" style={{ width:390, height:844, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <StatusBar />
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>{children}</div>
      <MobileTabBar active={tab} />
    </div>
  );
}

function MRosterCard({ a }) {
  const st = STATUS[a.status];
  return (
    <div className="jh-frame" style={{ display:'flex', gap:13, background:'var(--ink-1)',
      border:'1px solid var(--ink-line)', borderRadius:6, padding:10 }}>
      <Portrait glyph={a.glyph} accent={a.accent} label="" style={{ width:74, height:88, flex:'0 0 auto' }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h3 className="jh-disp" style={{ fontSize:16, fontWeight:600, color:'var(--gold-hi)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.alias}</h3>
          <span style={{ width:8, height:8, borderRadius:9, background:st.color, flex:'0 0 auto', marginLeft:8 }}></span>
        </div>
        <p style={{ fontSize:11.5, color:'var(--tx-dim)', marginTop:2 }}>{a.sect} · {a.real}</p>
        <p style={{ fontSize:11.5, color:'var(--tx-faint)', marginTop:6, lineHeight:1.4, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{a.role}</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
          <span style={{ fontSize:11, color:'var(--tx-dim)' }}>Lv <b style={{ color:'var(--gold)', fontFamily:'var(--font-mono)' }}>{a.level}</b></span>
          <span style={{ fontSize:11, color:st.color }}>● {st.th}</span>
        </div>
      </div>
    </div>
  );
}

function MobileRoster() {
  return (
    <MobileShell tab="roster">
      <div style={{ padding:'10px 18px 14px', flex:'0 0 auto' }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
          <h1 className="jh-disp" style={{ fontSize:24, fontWeight:700 }}>ทำเนียบยุทธจักร</h1>
          <span className="jh-cjk" style={{ fontSize:18, color:'var(--gold)', opacity:.7 }}>群俠</span>
        </div>
        <div style={{ display:'flex', gap:7, marginTop:12, overflow:'hidden' }}>
          {['ทั้งหมด','ออกศึก','สอดแนม','อักษร','ภาพมายา'].map((s,i)=>(
            <span key={s} style={{ fontSize:11.5, padding:'5px 11px', borderRadius:99, whiteSpace:'nowrap',
              border:`1px solid ${i===0?'var(--gold)':'var(--ink-line)'}`,
              color:i===0?'var(--gold-hi)':'var(--tx-dim)', background:i===0?'rgba(200,162,74,.12)':'transparent' }}>{s}</span>
          ))}
        </div>
      </div>
      <div className="jh-scroll" style={{ flex:1, overflow:'hidden', padding:'0 18px 14px',
        display:'flex', flexDirection:'column', gap:11, WebkitMaskImage:'linear-gradient(180deg,#000 92%,transparent)' }}>
        {AGENTS.slice(0,5).map(a=> <MRosterCard key={a.id} a={a} />)}
      </div>
    </MobileShell>
  );
}

function MobileMeter({ label, value, color='var(--gold)' }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11.5, marginBottom:4 }}>
        <span style={{ color:'var(--tx-dim)' }}>{label}</span>
        <span style={{ fontFamily:'var(--font-mono)', color }}>{Math.round(value*100)}</span>
      </div>
      <Meter value={value} color={color} h={4} />
    </div>
  );
}

function MobileProfile() {
  const a = AGENTS[3];
  return (
    <MobileShell tab="me">
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {/* แบนเนอร์ */}
        <div style={{ position:'relative', padding:'14px 18px 18px', flex:'0 0 auto',
          background:'linear-gradient(150deg,#221a10,#14100a)', borderBottom:'1px solid var(--ink-line)' }}>
          <div style={{ display:'flex', gap:14 }}>
            <div style={{ position:'relative' }}>
              <Portrait glyph={a.glyph} accent={a.accent} label="ภาพ" style={{ width:96, height:118, borderRadius:4, border:'1px solid var(--gold-deep)' }} />
              <div style={{ position:'absolute', bottom:-8, right:-8 }}><Seal text={a.glyph} size={32} /></div>
            </div>
            <div style={{ flex:1, minWidth:0, paddingTop:4 }}>
              <span className="jh-tag" style={{ color:a.accent }}>{a.sect}</span>
              <h1 className="jh-disp" style={{ fontSize:21, fontWeight:700, color:'var(--gold-hi)', marginTop:5, lineHeight:1.15 }}>{a.alias}</h1>
              <p style={{ fontSize:11.5, color:'var(--tx-dim)', marginTop:3 }}>{a.real}</p>
              <div style={{ marginTop:8 }}><StatusBadge status={a.status} size="sm" /></div>
            </div>
          </div>
          <div style={{ display:'flex', gap:18, marginTop:14, alignItems:'center' }}>
            <span style={{ fontSize:12, color:'var(--tx-dim)' }}>Lv <b style={{ color:'var(--gold)', fontSize:17, fontFamily:'var(--font-mono)' }}>{a.level}</b></span>
            <TierPips tier={a.tier} />
            <span style={{ fontSize:11.5, color:'var(--tx-dim)', marginLeft:'auto' }}>พลัง <b style={{ color:'var(--gold)', fontFamily:'var(--font-mono)' }}>{a.power.toLocaleString()}</b></span>
          </div>
        </div>
        {/* แท็บย่อ */}
        <div style={{ display:'flex', gap:5, padding:'12px 18px 0', flex:'0 0 auto' }}>
          {[['สำนวน',1],['วิชา',0],['คัมภีร์',0],['ภารกิจ',0]].map(([t,on],i)=>(
            <span key={i} style={{ fontSize:12.5, padding:'6px 13px', borderRadius:99, fontWeight:on?600:400,
              color:on?'var(--gold-hi)':'var(--tx-dim)', background:on?'rgba(200,162,74,.12)':'transparent',
              border:`1px solid ${on?'var(--gold-deep)':'var(--ink-line)'}` }}>{t}</span>
          ))}
        </div>
        <div className="jh-scroll" style={{ flex:1, overflow:'hidden', padding:'14px 18px',
          display:'flex', flexDirection:'column', gap:14, WebkitMaskImage:'linear-gradient(180deg,#000 94%,transparent)' }}>
          <p style={{ fontSize:12.5, color:'var(--tx-faint)', lineHeight:1.55 }}>{a.persona}</p>
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'14px 16px' }}>
            <div className="jh-tag" style={{ marginBottom:12 }}>คุณสมบัติ · 屬性</div>
            <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
              <MobileMeter label="ความเนี้ยบ" value={0.92} color="var(--gold-hi)" />
              <MobileMeter label="ความคิดสร้างสรรค์" value={0.84} color="#9a7fc2" />
              <MobileMeter label="ความแม่นยำ" value={0.78} />
              <MobileMeter label="พลังภายใน" value={0.66} color="var(--st-active)" />
            </div>
          </div>
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'14px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <span className="jh-tag">วิชาเด่น · 武學</span>
              <span style={{ fontSize:11.5, color:'var(--gold-hi)' }}>ดูทั้งหมด →</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {SKILLS.slice(0,3).map(s=>(
                <div key={s.name} style={{ display:'flex', alignItems:'center', gap:11 }}>
                  <span className="jh-cjk" style={{ fontSize:17, color:'var(--gold)', width:22, flex:'0 0 auto' }}>{s.cjk[0]}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontSize:12.5, color:'var(--tx)' }}>{s.name}</span>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:10.5, color:'var(--gold)' }}>Lv{s.lvl}</span>
                    </div>
                    <div style={{ marginTop:5 }}><Meter value={s.lvl/s.max} h={3} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

Object.assign(window, { MobileRoster, MobileProfile });
