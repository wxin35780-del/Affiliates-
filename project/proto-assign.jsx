/* ====== Prototype · Modal มอบหมายภารกิจ + เปลี่ยนสถานะ ====== */
const { useState: useStateA } = React;

function AssignTaskModal({ agent:a, onClose, onAssign }) {
  const [task, setTask] = useStateA(a.task==='—'?'':a.task);
  const [status, setStatus] = useStateA(a.status);
  const valid = task.trim().length > 0;

  const st = STATUS[status];
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:100,
      background:'rgba(8,6,3,.72)', backdropFilter:'blur(3px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div className="jh" onClick={e=>e.stopPropagation()} style={{ width:560,
        borderRadius:8, border:'1px solid var(--gold-deep)',
        background:'linear-gradient(180deg,#1d1710,#14100a)', boxShadow:'0 24px 70px rgba(0,0,0,.6)' }}>

        {/* หัว */}
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

        {/* เนื้อหา */}
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

        {/* ท้าย */}
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

Object.assign(window, { AssignTaskModal });
