/* ====== Modals: เรียกจอมยุทธ + มอบหมายภารกิจ ====== */
import React, { useState } from 'react';
import { STATUS, TIERS } from './data';
import { Portrait, StatusBadge, TierPips, SectGlyph, Seal, Btn } from './ui';
import { SECT_OPTIONS, makeAgent, agentToForm, PIPELINE_ORDER } from './protoData';

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

export function AddAgentModal({ onClose, onCreate, initial, onSave, onDelete }) {
  const editMode = !!initial;
  const [f, setF] = useState(()=> initial ? agentToForm(initial) : {
    alias:'', real:'', sect:'หอภาพมายา', role:'', persona:'', expertise:'',
    level:30, tier:1, status:'queued', task:'',
  });
  const [confirmDel, setConfirmDel] = useState(false);
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

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'16px 26px', borderTop:'1px solid var(--ink-line)' }}>
          {editMode ? (
            confirmDel ? (
              <span style={{ fontSize:12.5, color:'var(--cinnabar-hi)' }}>ปลด "{initial.alias}" ออกจากสังกัดถาวร?</span>
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

export function NewCampaignModal({ agents, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [product, setProduct] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => agents.filter(a=>a.status!=='rest').map(a=>a.id));
  const toggle = id => setSelectedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  const valid = title.trim().length > 0 && selectedIds.length > 0;
  const orderedPreview = [
    ...PIPELINE_ORDER.filter(id => selectedIds.includes(id)),
    ...selectedIds.filter(id => !PIPELINE_ORDER.includes(id)),
  ];

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:100,
      background:'rgba(8,6,3,.72)', backdropFilter:'blur(3px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div className="jh" onClick={e=>e.stopPropagation()} style={{ width:600, maxHeight:'90vh', overflow:'auto',
        borderRadius:8, border:'1px solid var(--gold-deep)',
        background:'linear-gradient(180deg,#1d1710,#14100a)', boxShadow:'0 24px 70px rgba(0,0,0,.6)' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 26px', borderBottom:'1px solid var(--ink-line)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <Seal text="戰" size={44} />
            <div>
              <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
                <h2 className="jh-disp" style={{ fontSize:23, fontWeight:700, color:'var(--gold-hi)' }}>เปิดศึกใหม่</h2>
                <span className="jh-cjk" style={{ fontSize:17, color:'var(--gold)', opacity:.7 }}>開戰令</span>
              </div>
              <p style={{ fontSize:12.5, color:'var(--tx-dim)', marginTop:2 }}>วางแผนศึกและมอบหมายสำนักที่ร่วมรบ</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:6, border:'1px solid var(--ink-line)',
            background:'var(--ink-2)', color:'var(--tx-dim)', cursor:'pointer', fontSize:16 }}>✕</button>
        </div>

        <div style={{ padding:'22px 26px', display:'flex', flexDirection:'column', gap:18 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Field label="ชื่อศึก" hint="(ชื่อแคมเปญ)">
              <input style={fieldBox} value={title} onChange={e=>setTitle(e.target.value)}
                placeholder="เช่น ศึกเปิดตัวลิปสติกกุหลาบ" autoFocus />
            </Field>
            <Field label="สินค้า / เป้าหมาย">
              <input style={fieldBox} value={product} onChange={e=>setProduct(e.target.value)}
                placeholder="เช่น ลิปสติก No.7 ราคา 390 บ." />
            </Field>
          </div>

          <div>
            <label style={{ ...fieldLabel }}>เลือกสำนักที่ร่วมศึก
              <span style={{ color:'var(--tx-faint)', marginLeft:6 }}>({selectedIds.length} สำนัก)</span>
            </label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:6 }}>
              {agents.map(a => {
                const sel = selectedIds.includes(a.id);
                return (
                  <div key={a.id} onClick={()=>toggle(a.id)} style={{
                    display:'flex', alignItems:'center', gap:11, padding:'10px 13px', borderRadius:7, cursor:'pointer',
                    background: sel ? `${a.accent}14` : 'var(--ink-2)',
                    border: `1px solid ${sel ? a.accent : 'var(--ink-line)'}`,
                    transition:'all .13s',
                  }}>
                    <SectGlyph char={a.glyph} accent={a.accent} size={34} ring={false} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:600, color:sel?'var(--tx)':'var(--tx-dim)',
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.alias}</div>
                      <div style={{ fontSize:11, color:'var(--tx-faint)', marginTop:1 }}>{a.sect}</div>
                    </div>
                    <div style={{ width:17, height:17, borderRadius:4, flex:'0 0 auto',
                      border:`1.5px solid ${sel ? a.accent : 'var(--ink-line)'}`,
                      background: sel ? a.accent : 'transparent',
                      display:'grid', placeItems:'center' }}>
                      {sel && <span style={{ color:'#13100a', fontSize:10, fontWeight:700, lineHeight:1 }}>✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {orderedPreview.length > 0 && (
            <div style={{ padding:'12px 15px', borderRadius:6, background:'var(--ink-1)', border:'1px solid var(--ink-line)' }}>
              <div className="jh-tag" style={{ marginBottom:9 }}>ลำดับ Pipeline · 作戰序</div>
              <div style={{ display:'flex', alignItems:'center', gap:5, flexWrap:'wrap' }}>
                {orderedPreview.map((id, i) => {
                  const a = agents.find(ag => ag.id === id);
                  return (
                    <React.Fragment key={id}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px',
                        borderRadius:5, background:'var(--ink-2)', border:'1px solid var(--ink-line)' }}>
                        <span className="jh-cjk" style={{ fontSize:13, color:a?.accent }}>{a?.glyph}</span>
                        <span style={{ fontSize:12, color:'var(--tx-dim)' }}>{a?.alias}</span>
                      </div>
                      {i < orderedPreview.length - 1 && <span style={{ color:'var(--tx-faint)', fontSize:13 }}>→</span>}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'16px 26px', borderTop:'1px solid var(--ink-line)' }}>
          <span style={{ fontSize:12, color:'var(--tx-faint)' }}>
            {valid ? `พร้อมเปิดศึก · ${selectedIds.length} สำนัก` : 'กรุณากรอกชื่อศึกและเลือกสำนัก'}
          </span>
          <div style={{ display:'flex', gap:10 }}>
            <Btn kind="ink" sm onClick={onClose}>ยกเลิก</Btn>
            <Btn kind="gold" onClick={()=>valid && onCreate({ title, product, agentIds: selectedIds })}
              style={{ opacity:valid?1:.45, pointerEvents:valid?'auto':'none' }}>
              ⚔ เปิดศึก
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssignTaskModal({ agent:a, onClose, onAssign }) {
  const [task, setTask] = useState(a.task==='—'?'':a.task);
  const [status, setStatus] = useState(a.status);
  const valid = task.trim().length > 0;
  const st = STATUS[status];

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:100,
      background:'rgba(8,6,3,.72)', backdropFilter:'blur(3px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div className="jh" onClick={e=>e.stopPropagation()} style={{ width:560,
        borderRadius:8, border:'1px solid var(--gold-deep)',
        background:'linear-gradient(180deg,#1d1710,#14100a)', boxShadow:'0 24px 70px rgba(0,0,0,.6)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 26px', borderBottom:'1px solid var(--ink-line)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <SectGlyph char={a.glyph} accent={a.accent} size={46} />
            <div>
              <div className="jh-tag" style={{ color:a.accent }}>{a.sect} · {a.sectCjk}</div>
              <h2 className="jh-disp" style={{ fontSize:21, fontWeight:700, color:'var(--gold-hi)', marginTop:4 }}>มอบหมายภารกิจ · 授命</h2>
              <p style={{ fontSize:12, color:'var(--tx-dim)', marginTop:2 }}>บัญชาให้ <b style={{ color:'var(--tx)' }}>{a.alias}</b> ปฏิบัติ</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:6, border:'1px solid var(--ink-line)',
            background:'var(--ink-2)', color:'var(--tx-dim)', cursor:'pointer', fontSize:16 }}>✕</button>
        </div>

        <div style={{ padding:'22px 26px', display:'flex', flexDirection:'column', gap:18 }}>
          <div>
            <label style={{ display:'block', fontSize:12, color:'var(--tx-dim)', marginBottom:7 }}>
              คำสั่งภารกิจ <span style={{ color:'var(--tx-faint)' }}>(บรรยายสิ่งที่ต้องทำ)</span>
            </label>
            <textarea value={task} onChange={e=>setTask(e.target.value)} rows={4}
              placeholder={`เช่น ตัดต่อคลิป 9:16 สินค้า "${a.sect}" ความยาว 30 วิ พร้อมซับไตเติล`}
              style={{ width:'100%', background:'var(--ink-2)', border:'1px solid var(--ink-line)', borderRadius:6,
                color:'var(--tx)', fontFamily:'var(--font-body)', fontSize:13.5, padding:'10px 13px',
                outline:'none', resize:'vertical', boxSizing:'border-box',
                borderColor: task.trim()?'var(--gold-deep)':'var(--ink-line)' }} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:12, color:'var(--tx-dim)', marginBottom:10 }}>เปลี่ยนสถานะเป็น</label>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {Object.values(STATUS).map(s=>(
                <div key={s.key} onClick={()=>setStatus(s.key)} style={{ flex:'1 1 auto', padding:'10px 14px', borderRadius:7, cursor:'pointer',
                  background: s.key===status?`${s.color}18`:'var(--ink-2)',
                  border:`1px solid ${s.key===status?s.color:'var(--ink-line)'}`,
                  boxShadow: s.key===status?`0 0 0 1px ${s.color}55`:'none',
                  transition:'all .14s' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:8, height:8, borderRadius:9, background:s.color }}></span>
                    <span style={{ fontSize:13.5, fontWeight: s.key===status?600:400, color: s.key===status?'var(--tx)':'var(--tx-dim)' }}>{s.th}</span>
                    <span className="jh-cjk" style={{ fontSize:12, color:s.color, opacity:.7 }}>{s.cjk}</span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--tx-faint)', marginTop:4 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
          {!valid && status==='active' && (
            <div style={{ padding:'10px 14px', borderRadius:6, border:'1px solid var(--st-queued)',
              background:'rgba(200,162,74,.06)', fontSize:12.5, color:'var(--st-queued)' }}>
              ⚠ ต้องกรอกคำสั่งภารกิจก่อนตั้งสถานะ "ออกศึก"
            </div>
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'16px 26px', borderTop:'1px solid var(--ink-line)' }}>
          <span style={{ fontSize:12, color:'var(--tx-faint)' }}>
            {valid ? `จะตั้งสถานะ "${st.th}" · ${st.cjk}` : 'กรุณากรอกคำสั่งภารกิจ'}
          </span>
          <div style={{ display:'flex', gap:10 }}>
            <Btn kind="ink" sm onClick={onClose}>ยกเลิก</Btn>
            <Btn kind="gold"
              style={{ opacity: (valid || status!=='active')?1:.45, pointerEvents:(valid||status!=='active')?'auto':'none' }}
              onClick={()=>onAssign({ ...a, task: task.trim()||'—', status })}>
              ⚔ ส่งบัญชา
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
