/* ====== Prototype · Modal เรียกจอมยุทธ ====== */
const { useState: useStateM } = React;

const fieldLabel = { display:'block', fontSize:12, color:'var(--tx-dim)', marginBottom:6, letterSpacing:'.01em' };
const fieldBox = {
  width:'100%', background:'var(--ink-2)', border:'1px solid var(--ink-line)', borderRadius:6,
  color:'var(--tx)', fontFamily:'var(--font-body)', fontSize:13.5, padding:'9px 12px', outline:'none',
};

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={fieldLabel}>{label}{hint && <span style={{ color:'var(--tx-faint)', marginLeft:6 }}>{hint}</span>}</label>
      {children}
    </div>
  );
}

function AddAgentModal({ onClose, onCreate, initial, onSave, onDelete }) {
  const editMode = !!initial;
  const [f, setF] = useStateM(()=> initial ? agentToForm(initial) : {
    alias:'', real:'', sect:'หอภาพมายา', role:'', persona:'', expertise:'',
    level:30, tier:1, status:'queued', task:'',
  });
  const [confirmDel, setConfirmDel] = useStateM(false);
  const set = (k,v)=> setF(s=>({ ...s, [k]:v }));
  const so = SECT_OPTIONS.find(s=>s.sect===f.sect) || SECT_OPTIONS[0];
  const valid = f.alias.trim().length>0;

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:100,
      background:'rgba(8,6,3,.72)', backdropFilter:'blur(3px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div className="jh" onClick={e=>e.stopPropagation()} style={{ width:760, maxHeight:'92vh', overflow:'auto',
        borderRadius:8, border:'1px solid var(--gold-deep)',
        background:'linear-gradient(180deg,#1d1710,#14100a)', boxShadow:'0 24px 70px rgba(0,0,0,.6)' }}>
        {/* หัว modal */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 26px', borderBottom:'1px solid var(--ink-line)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <Seal text={editMode?'更':'召'} size={44} />
            <div>
              <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
                <h2 className="jh-disp" style={{ fontSize:23, fontWeight:700, color:'var(--gold-hi)', whiteSpace:'nowrap' }}>{editMode?'แก้ไขประวัติจอมยุทธ':'เรียกจอมยุทธเข้าสังกัด'}</h2>
                <span className="jh-cjk" style={{ fontSize:17, color:'var(--gold)', opacity:.7 }}>{editMode?'修譜':'召將入壇'}</span>
              </div>
              <p style={{ fontSize:12.5, color:'var(--tx-dim)', marginTop:2 }}>{editMode?'ปรับแก้ข้อมูลจอมยุทธ — บันทึกทับของเดิมทันที':'กรอกประวัติจอมยุทธ — เพิ่มเข้าทำเนียบได้ทันที (บันทึกไว้อัตโนมัติ)'}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:6, border:'1px solid var(--ink-line)',
            background:'var(--ink-2)', color:'var(--tx-dim)', cursor:'pointer', fontSize:16 }}>✕</button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'232px 1fr', gap:24, padding:'24px 26px' }}>
          {/* พรีวิวสด */}
          <div>
            <div className="jh-tag" style={{ marginBottom:10 }}>ตัวอย่าง · 預覽</div>
            <div className="jh-frame" style={{ borderRadius:5, border:'1px solid var(--gold-deep)', padding:7 }}>
              <div style={{ position:'relative' }}>
                <Portrait glyph={so.glyph} accent={so.accent} label="ภาพจอมยุทธ" style={{ height:150, borderRadius:3 }} />
                <div style={{ position:'absolute', bottom:9, right:9 }}><Seal text={so.glyph} size={34} /></div>
              </div>
            </div>
            <h3 className="jh-disp" style={{ fontSize:18, fontWeight:600, color:'var(--gold-hi)', marginTop:12 }}>{f.alias||'ฉายาจอมยุทธ'}</h3>
            <p style={{ fontSize:12, color:'var(--tx-dim)', marginTop:3 }}>{f.real||'นามจริง'} · {f.sect} <span className="jh-cjk">{so.sectCjk}</span></p>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10 }}>
              <span style={{ fontSize:12, color:'var(--tx-dim)' }}>Lv <b style={{ color:'var(--gold)', fontFamily:'var(--font-mono)' }}>{f.level}</b></span>
              <TierPips tier={parseInt(f.tier)} />
            </div>
            <div style={{ marginTop:10 }}><StatusBadge status={f.status} size="sm" /></div>
          </div>

          {/* ฟอร์ม */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <Field label="ฉายา" hint="ชื่อในยุทธภพ">
                <input style={fieldBox} value={f.alias} onChange={e=>set('alias',e.target.value)} placeholder="เช่น มังกรเมฆาพันลี้" />
              </Field>
              <Field label="นามจริง">
                <input style={fieldBox} value={f.real} onChange={e=>set('real',e.target.value)} placeholder="เช่น หลี่ เฟิง" />
              </Field>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <Field label="สำนัก (สายงาน)">
                <select style={fieldBox} value={f.sect} onChange={e=>set('sect',e.target.value)}>
                  {SECT_OPTIONS.map(s=> <option key={s.sect} value={s.sect}>{s.sect} ({s.sectCjk})</option>)}
                </select>
              </Field>
              <Field label="หน้าที่ / บทบาท">
                <input style={fieldBox} value={f.role} onChange={e=>set('role',e.target.value)} placeholder="เช่น ตัดต่อวิดีโอสั้น" />
              </Field>
            </div>
            <Field label="บุคลิก">
              <textarea style={{ ...fieldBox, resize:'vertical', minHeight:58 }} value={f.persona} onChange={e=>set('persona',e.target.value)} placeholder="เช่น พิถีพิถัน รักความสมบูรณ์แบบ ทำงานไว" />
            </Field>
            <Field label="ความเชี่ยวชาญ" hint="คั่นด้วยจุลภาค , (สูงสุด 4)">
              <input style={fieldBox} value={f.expertise} onChange={e=>set('expertise',e.target.value)} placeholder="ตัดต่อ, เอฟเฟกต์, คุมจังหวะ" />
            </Field>
            <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', gap:16, alignItems:'end' }}>
              <Field label={`เลเวล · ${f.level}`}>
                <input type="range" min="1" max="99" value={f.level} onChange={e=>set('level',e.target.value)}
                  style={{ width:'100%', accentColor:'var(--gold)' }} />
              </Field>
              <Field label="ระดับชั้น">
                <select style={fieldBox} value={f.tier} onChange={e=>set('tier',e.target.value)}>
                  {TIERS.map((t,i)=> <option key={t} value={i}>{t}</option>)}
                </select>
              </Field>
              <Field label="สถานะเริ่มต้น">
                <select style={fieldBox} value={f.status} onChange={e=>set('status',e.target.value)}>
                  {Object.values(STATUS).map(s=> <option key={s.key} value={s.key}>{s.th}</option>)}
                </select>
              </Field>
            </div>
            {f.status==='active' && (
              <Field label="ภารกิจปัจจุบัน">
                <input style={fieldBox} value={f.task} onChange={e=>set('task',e.target.value)} placeholder="เช่น ตัดต่อคลิปเปิดตัวสินค้า" />
              </Field>
            )}
          </div>
        </div>

        {/* ท้าย modal */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'16px 26px', borderTop:'1px solid var(--ink-line)' }}>
          {editMode ? (
            confirmDel ? (
              <span style={{ fontSize:12.5, color:'var(--cinnabar-hi)' }}>ปลด “{initial.alias}” ออกจากสังกัดถาวร?</span>
            ) : (
              <button onClick={()=>setConfirmDel(true)} style={{ fontSize:12.5, color:'var(--cinnabar-hi)', background:'transparent',
                border:'1px solid var(--cinnabar)', borderRadius:6, padding:'7px 13px', cursor:'pointer', fontFamily:'var(--font-body)' }}>
                ✕ ปลดจากสังกัด
              </button>
            )
          ) : (
            <span style={{ fontSize:12, color:'var(--tx-faint)' }}>{valid ? 'พร้อมเรียกเข้าสังกัด' : 'กรุณากรอกฉายาก่อน'}</span>
          )}
          <div style={{ display:'flex', gap:10 }}>
            {editMode && confirmDel ? (
              <>
                <Btn kind="ink" sm onClick={()=>setConfirmDel(false)}>ไม่ปลด</Btn>
                <Btn kind="gold" sm onClick={()=>onDelete(initial.id)}
                  style={{ background:'linear-gradient(180deg,#c0432f,#9a2f24)', border:'1px solid #d05544', color:'#f3e7d6' }}>ยืนยันปลด</Btn>
              </>
            ) : editMode ? (
              <>
                <Btn kind="ink" sm onClick={onClose}>ยกเลิก</Btn>
                <Btn kind="gold" onClick={()=> valid && onSave(makeAgent(f, initial))}
                  style={{ opacity: valid?1:.45, pointerEvents: valid?'auto':'none' }}>✓ บันทึกการแก้ไข</Btn>
              </>
            ) : (
              <>
                <Btn kind="ink" sm onClick={onClose}>ยกเลิก</Btn>
                <Btn kind="gold" onClick={()=> valid && onCreate(makeAgent(f))}
                  style={{ opacity: valid?1:.45, pointerEvents: valid?'auto':'none' }}>⚔ เรียกเข้าสังกัด</Btn>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AddAgentModal });
