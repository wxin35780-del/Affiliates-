/* ====== Prototype · โปรไฟล์ Agent + แท็บ ====== */
const { useState: useStateP } = React;

function pKind(k){ return { 'อาวุธเอก':'var(--cinnabar-hi)', 'วิชาภายใน':'var(--gold-hi)', 'วิชาเสริม':'#9a7fc2', 'วิชาขั้นต้น':'var(--st-active)' }[k] || 'var(--gold)'; }
function pTag(t){ return {
  brand:{th:'คัมภีร์แบรนด์',cjk:'牌',c:'var(--gold-hi)'}, audience:{th:'ตำราผู้ชม',cjk:'眾',c:'var(--st-active)'},
  pattern:{th:'ม้วนสไตล์',cjk:'式',c:'#9a7fc2'}, policy:{th:'บันทึกข้อห้าม',cjk:'戒',c:'var(--cinnabar-hi)'},
}[t] || {th:t,cjk:'記',c:'var(--gold)'}; }

function Panel({ children, style }) {
  return <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'18px 20px', ...style }}>{children}</div>;
}

/* ----- แท็บ: สำนวน ----- */
function TabOverview({ a }) {
  const attrs = attrsFor(a);
  const skills = skillsFor(a);
  const missions = [
    { name: a.task && a.task!=='—' ? a.task : 'รอรับภารกิจแรก', when: a.status==='active'?'กำลังทำ':'—', res: a.status==='active'?'กำลังดำเนิน':'—', state:a.status },
    { name:'ภารกิจร่วมศึกครั้งก่อน', when:'เมื่อวาน', res:'สำเร็จ', state:'done' },
    { name:'ภารกิจฝึกปรือวิชา', when:'3 วันก่อน', res:'ผ่าน', state:'done' },
  ];
  const stats = [['ภารกิจสำเร็จ','成', 40+ (a.level*3)],['อัตราผ่าน','率', (90+a.level%9)+'%'],['ชม.ปฏิบัติ','時', a.level*6],['ความเชี่ยวชาญ','專', (a.expertise||[]).length]];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'330px 1fr', gap:24 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <Panel>
          <DualHead th="คุณสมบัติ" cjk="屬性" />
          <div style={{ display:'flex', flexDirection:'column', gap:14, marginTop:16 }}>
            {attrs.map(at=>(
              <div key={at.label}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5, marginBottom:5 }}>
                  <span style={{ color:'var(--tx-dim)' }}>{at.label}</span>
                  <span style={{ fontFamily:'var(--font-mono)', color:at.color }}>{Math.round(at.value*100)}</span>
                </div>
                <Meter value={at.value} color={at.color} />
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <DualHead th="ความเชี่ยวชาญ" cjk="專精" />
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:14 }}>
            {(a.expertise||[]).map(e=>(
              <span key={e} style={{ fontSize:12, padding:'5px 11px', borderRadius:5, background:'var(--ink-3)', border:'1px solid var(--ink-line)', color:'var(--tx-dim)' }}>{e}</span>
            ))}
          </div>
        </Panel>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {stats.map(([l,c,v])=>(
            <Panel key={l} style={{ padding:'13px 15px' }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span className="jh-tag">{l}</span><span className="jh-cjk" style={{ color:'var(--gold)', opacity:.5, fontSize:13 }}>{c}</span></div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:22, color:'var(--gold)', marginTop:6 }}>{v}</div>
            </Panel>
          ))}
        </div>
        <Panel>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <DualHead th="วิชาที่ติดตัว" cjk="武學" />
            <span className="jh-tag">{skills.length} วิชา</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14 }}>
            {skills.slice(0,4).map(s=>(
              <div key={s.name} style={{ display:'flex', gap:12, padding:'11px 13px', borderRadius:6, background:'var(--ink-2)', border:'1px solid var(--ink-line)' }}>
                <SectGlyph char={s.cjk[0]} accent={pKind(s.kind)} size={38} ring={false} />
                <div style={{ minWidth:0, flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                    <span style={{ fontSize:13, fontWeight:600, color:'var(--tx)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.name}</span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gold)', flex:'0 0 auto' }}>Lv{s.lvl}</span>
                  </div>
                  <div style={{ marginTop:7 }}><Meter value={s.lvl/s.max} h={4} color={pKind(s.kind)} /></div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <DualHead th="ภารกิจล่าสุด" cjk="近期任務" />
          <div style={{ marginTop:12 }}>
            {missions.map((m,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 2px', borderBottom:i<missions.length-1?'1px solid var(--ink-line)':'none' }}>
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
        </Panel>
      </div>
    </div>
  );
}

/* ----- แท็บ: วิชา ----- */
function TabSkills({ a }) {
  const skills = skillsFor(a);
  const totalLvl = skills.reduce((n,s)=>n+s.lvl,0);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:24 }}>
      <Panel style={{ background:'linear-gradient(160deg,#221a10,#15100a)', border:'1px solid var(--gold-deep)', textAlign:'center', alignSelf:'start' }}>
        <div className="jh-tag">พลังวิชารวม</div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:40, color:'var(--gold)', lineHeight:1, margin:'8px 0' }}>{totalLvl}</div>
        <div style={{ display:'flex', justifyContent:'center' }}><OrnRule w={60} /></div>
        <p style={{ fontSize:12, color:'var(--tx-dim)', marginTop:10 }}>{skills.length} วิชาที่ฝึกสำเร็จ</p>
      </Panel>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {skills.map((s,i)=>{
          const c = pKind(s.kind); const featured = i===0;
          return (
            <div key={s.name} className="jh-frame" style={{ display:'flex', gap:16,
              background: featured?'linear-gradient(120deg,#241a0f,#160f08)':'var(--ink-1)',
              border:`1px solid ${featured?'var(--gold-deep)':'var(--ink-line)'}`, borderRadius:6, padding: featured?'18px 20px':'15px 18px' }}>
              <div style={{ width:featured?64:54, height:featured?64:54, flex:'0 0 auto', borderRadius:8, display:'grid', placeItems:'center',
                background:'radial-gradient(120% 120% at 30% 25%,#2c2417,#15100a)', border:`1px solid ${c}55` }}>
                <span className="jh-cjk" style={{ fontSize:featured?28:22, color:c }}>{s.cjk[0]}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:10, minWidth:0 }}>
                    <h3 className="jh-disp" style={{ fontSize:featured?20:16.5, fontWeight:600, color:'var(--tx)' }}>{s.name}</h3>
                    <span className="jh-cjk" style={{ fontSize:featured?14:12.5, color:c, opacity:.8 }}>{s.cjk}</span>
                  </div>
                  <span style={{ fontSize:11, padding:'3px 10px', borderRadius:99, color:c, border:`1px solid ${c}`, whiteSpace:'nowrap' }}>{s.kind}</span>
                </div>
                <p style={{ fontSize:12.5, color:'var(--tx-dim)', marginTop:6, lineHeight:1.5 }}>{s.desc}</p>
                <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:5 }}>
                      <span style={{ color:'var(--tx-faint)', fontFamily:'var(--font-mono)' }}>ขั้น {s.lvl}/{s.max}</span>
                    </div>
                    <span style={{ display:'flex', gap:4 }}>
                      {Array.from({length:s.max}).map((_,j)=>(<span key={j} style={{ flex:1, height:6, borderRadius:3, background: j<s.lvl?c:'var(--ink-3)', opacity:j<s.lvl?1:.6 }}></span>))}
                    </span>
                  </div>
                  <div style={{ textAlign:'right' }}><div className="jh-tag">ใช้ไปแล้ว</div><div style={{ fontFamily:'var(--font-mono)', fontSize:14, color:'var(--gold)' }}>{s.uses.toLocaleString()}</div></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----- แท็บ: คลังคัมภีร์ ----- */
function TabMemory({ a }) {
  const mem = memoryFor(a);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24 }}>
      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <DualHead th="ความทรงจำระยะยาว" cjk="長記" />
          <span className="jh-tag">{mem.longTerm.length} ม้วนคัมภีร์</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {mem.longTerm.map((m,i)=>{
            const ti = pTag(m.tag);
            return (
              <div key={i} className="jh-frame" style={{ position:'relative', background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px' }}>
                <div style={{ position:'absolute', top:14, right:14 }}>
                  <span style={{ fontSize:11, padding:'3px 10px', borderRadius:99, color:ti.c, border:`1px solid ${ti.c}55` }}>{ti.th} <span className="jh-cjk">{ti.cjk}</span></span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:9, paddingRight:130 }}>
                  <span className="jh-cjk" style={{ fontSize:23, color:ti.c, opacity:.85 }}>{ti.cjk}</span>
                  <h3 className="jh-disp" style={{ fontSize:16.5, fontWeight:600, color:'var(--tx)' }}>{m.title}</h3>
                </div>
                <p style={{ fontSize:12.5, color:'var(--tx-dim)', lineHeight:1.55 }}>{m.note}</p>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:13 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:5 }}><span className="jh-tag">ความแม่นของความทรงจำ</span><span style={{ fontFamily:'var(--font-mono)', color:ti.c }}>{Math.round(m.strength*100)}%</span></div>
                    <Meter value={m.strength} color={ti.c} />
                  </div>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--tx-faint)' }}>จำเมื่อ {m.age}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <DualHead th="เฉพาะกิจ" cjk="短記" />
          <StatusBadge status={a.status} size="sm" />
        </div>
        <Panel>
          <div style={{ fontSize:12.5, color:'var(--tx-dim)', marginBottom:16 }}>บริบทของภารกิจปัจจุบัน — ล้างเมื่อจบศึก</div>
          <div style={{ position:'relative', paddingLeft:18 }}>
            <span style={{ position:'absolute', left:4, top:4, bottom:4, width:1, background:'var(--ink-line)' }}></span>
            {mem.shortTerm.map((m,i)=>{
              const live = m.t==='now';
              return (
                <div key={i} style={{ position:'relative', paddingBottom:i<mem.shortTerm.length-1?18:0 }}>
                  <span style={{ position:'absolute', left:-18, top:3, width:9, height:9, borderRadius:9, background:live?'var(--st-active)':'var(--gold-deep)', boxShadow:live?'0 0 8px var(--st-active)':'none' }}></span>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:10.5, color:live?'var(--st-active)':'var(--tx-faint)', letterSpacing:'.08em' }}>{String(m.t).toUpperCase()}</div>
                  <div style={{ fontSize:13, color:live?'var(--tx)':'var(--tx-dim)', marginTop:3, lineHeight:1.45 }}>{m.txt}</div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ----- แท็บ: ภารกิจ ----- */
function TabTask({ a }) {
  const active = a.status==='active';
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24 }}>
      <Panel style={{ background: active?'linear-gradient(120deg,#1c2417,#13160f)':'var(--ink-1)', border:`1px solid ${active?'var(--st-active)':'var(--ink-line)'}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <DualHead th="ภารกิจปัจจุบัน" cjk="當前任務" />
          <StatusBadge status={a.status} size="sm" />
        </div>
        {active ? (
          <div style={{ marginTop:16 }}>
            <h3 className="jh-disp" style={{ fontSize:19, color:'var(--gold-hi)', fontWeight:600 }}>{a.task}</h3>
            <p style={{ fontSize:13, color:'var(--tx-dim)', marginTop:6 }}>มอบหมายโดยแม่ทัพ · เริ่มวันนี้</p>
            <div style={{ marginTop:16 }}><Meter value={0.58} color="var(--st-active)" h={7} /></div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:7, fontSize:12, color:'var(--tx-dim)' }}><span>คืบหน้า 58%</span><span style={{ color:'var(--st-active)' }}>กำลังดำเนิน</span></div>
          </div>
        ) : (
          <div style={{ marginTop:18, textAlign:'center', padding:'24px 0' }}>
            <div className="jh-cjk" style={{ fontSize:30, color:'var(--gold-deep)' }}>{STATUS[a.status].cjk}</div>
            <p style={{ fontSize:13.5, color:'var(--tx-dim)', marginTop:10 }}>{STATUS[a.status].desc} — ยังไม่มีภารกิจที่กำลังทำ</p>
            <Btn kind="gold" sm style={{ marginTop:14 }}>มอบหมายภารกิจ</Btn>
          </div>
        )}
      </Panel>
      <Panel>
        <DualHead th="บันทึกการปฏิบัติ" cjk="任務日誌" />
        <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:12 }}>
          {(active ? [
            { t:'10:31', x:`เรียกใช้วิชา “${(skillsFor(a)[0]||{}).name||'ประจำตัว'}”`, c:'var(--st-active)' },
            { t:'10:18', x:'รับบริบทจากคลังคัมภีร์', c:'var(--gold)' },
            { t:'10:05', x:'รับคำสั่งจากแม่ทัพ', c:'var(--cinnabar-hi)' },
          ] : [
            { t:'—', x:'ยังไม่มีบันทึกภารกิจล่าสุด', c:'var(--tx-faint)' },
          ]).map((l,i)=>(
            <div key={i} style={{ display:'flex', gap:11 }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--tx-faint)', width:38, flex:'0 0 auto', paddingTop:1 }}>{l.t}</span>
              <span style={{ width:7, height:7, borderRadius:9, background:l.c, marginTop:5, flex:'0 0 auto' }}></span>
              <span style={{ fontSize:12.5, color:'var(--tx-dim)', lineHeight:1.45 }}>{l.x}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ProfTabBtn({ label, cjk, active, onClick }) {
  return (
    <div onClick={onClick} style={{ padding:'11px 20px', cursor:'pointer', position:'relative',
      color:active?'var(--gold-hi)':'var(--tx-dim)', fontWeight:active?600:400, fontSize:14.5 }}>
      {label} <span className="jh-cjk" style={{ fontSize:12, opacity:.6 }}>{cjk}</span>
      {active && <span style={{ position:'absolute', left:14, right:14, bottom:0, height:2, background:'var(--gold)' }}></span>}
    </div>
  );
}

function ProfileView({ agent:a, tab, setTab, onBack, onEdit, onAssign }) {
  return (
    <div>
      {/* แบนเนอร์ */}
      <div style={{ position:'relative', padding:'18px 32px 0', borderBottom:'1px solid var(--ink-line)',
        background:'linear-gradient(120deg,#221a10 0%,#15100a 60%)' }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:7, background:'transparent', border:'none',
          color:'var(--tx-dim)', cursor:'pointer', fontSize:13, fontFamily:'var(--font-body)', padding:0, marginBottom:14 }}>
          ← กลับทำเนียบ
        </button>
        <div style={{ display:'flex', gap:22 }}>
          <div style={{ position:'relative' }}>
            <Portrait glyph={a.glyph} accent={a.accent} label="ภาพจอมยุทธเต็มตัว" slotId={`slot-${a.id}`} style={{ width:148, height:182, borderRadius:4, border:'1px solid var(--gold-deep)' }} />
            <div style={{ position:'absolute', bottom:-10, right:-10 }}><Seal text={a.glyph} size={42} /></div>
          </div>
          <div style={{ flex:1, paddingTop:4 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span className="jh-tag" style={{ color:a.accent }}>{a.sect} · {a.sectCjk}</span>
              <StatusBadge status={a.status} size="sm" />
              {a.custom && <span style={{ fontSize:10.5, fontFamily:'var(--font-mono)', color:'#241a08', background:'var(--gold)', padding:'2px 8px', borderRadius:4 }}>เพิ่มเอง</span>}
            </div>
            <h1 className="jh-disp" style={{ fontSize:33, fontWeight:700, color:'var(--gold-hi)', marginTop:8 }}>{a.alias}</h1>
            <p style={{ fontSize:14, color:'var(--tx-dim)', marginTop:3 }}>{a.real} · {a.role}</p>
            <p style={{ fontSize:13, color:'var(--tx-faint)', marginTop:11, maxWidth:620, lineHeight:1.55 }}>{a.persona}</p>
            <div style={{ display:'flex', gap:24, marginTop:14, alignItems:'center' }}>
              <span style={{ fontSize:13, color:'var(--tx-dim)' }}>เลเวล <b style={{ color:'var(--gold)', fontSize:20, fontFamily:'var(--font-mono)' }}>{a.level}</b></span>
              <span style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--gold-hi)' }}>{TIERS[a.tier]} <TierPips tier={a.tier} /></span>
              <span style={{ fontSize:13, color:'var(--tx-dim)' }}>พลัง <b style={{ color:'var(--gold)', fontSize:16, fontFamily:'var(--font-mono)' }}>{a.power.toLocaleString()}</b></span>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, alignSelf:'flex-start' }}>
            <Btn kind="gold" onClick={()=>onAssign&&onAssign(a)}>มอบหมายภารกิจ</Btn>
            <Btn kind="ghost" sm onClick={()=>onEdit&&onEdit(a)}>แก้ไขประวัติ</Btn>
          </div>
        </div>
        <div style={{ display:'flex', gap:4, marginTop:16 }}>
          <ProfTabBtn label="สำนวน" cjk="總覽" active={tab==='overview'} onClick={()=>setTab('overview')} />
          <ProfTabBtn label="วิชา" cjk="武學" active={tab==='skills'} onClick={()=>setTab('skills')} />
          <ProfTabBtn label="คลังคัมภีร์" cjk="記憶" active={tab==='memory'} onClick={()=>setTab('memory')} />
          <ProfTabBtn label="ภารกิจ" cjk="任務" active={tab==='task'} onClick={()=>setTab('task')} />
        </div>
      </div>
      <div style={{ padding:'26px 32px 40px' }}>
        {tab==='overview' && <TabOverview a={a} />}
        {tab==='skills' && <TabSkills a={a} />}
        {tab==='memory' && <TabMemory a={a} />}
        {tab==='task' && <TabTask a={a} />}
      </div>
    </div>
  );
}

Object.assign(window, { ProfileView });
