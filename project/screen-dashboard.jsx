/* ====== Dashboard · ศาลบัญชาการทัพ ====== */

function StatTile({ label, cjk, value, sub, color='var(--gold)' }) {
  return (
    <div className="jh-frame" style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)',
      borderRadius:5, padding:'15px 17px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span className="jh-tag">{label}</span>
        <span className="jh-cjk" style={{ fontSize:15, color, opacity:.55 }}>{cjk}</span>
      </div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:30, color, marginTop:8, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--tx-faint)', marginTop:7 }}>{sub}</div>
    </div>
  );
}

function LiveRow({ a }) {
  const st = STATUS[a.status];
  const prog = { marshal:0.4, scout:0.78, scribe:0.55, smith:0.62, voice:0, herald:0, abacus:0 }[a.id] || 0;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'40px 1fr 116px 150px 70px', gap:14, alignItems:'center',
      padding:'11px 4px', borderBottom:'1px solid var(--ink-line)' }}>
      <SectGlyph char={a.glyph} accent={a.accent} size={40} />
      <div style={{ minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <span className="jh-disp" style={{ fontSize:15, fontWeight:600, color:'var(--tx)' }}>{a.alias}</span>
          <span style={{ fontSize:11, color:'var(--tx-faint)' }}>{a.sect}</span>
        </div>
        <div style={{ fontSize:12, color:'var(--tx-dim)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.task}</div>
      </div>
      <StatusBadge status={a.status} size="sm" />
      <div>
        <Meter value={prog || 0.02} color={st.color} />
        <div style={{ fontFamily:'var(--font-mono)', fontSize:10.5, color:'var(--tx-faint)', marginTop:4 }}>
          {prog>0 ? Math.round(prog*100)+'%' : '—'}
        </div>
      </div>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--gold)', textAlign:'right' }}>{a.power.toLocaleString()}</span>
    </div>
  );
}

function Dashboard() {
  const counts = AGENTS.reduce((m,a)=>{ m[a.status]=(m[a.status]||0)+1; return m; }, {});
  const feed = [
    { t:'10:31', who:'จิตรกรเงามายา', txt:'เริ่มเรนเดอร์คลิป 9:16 เวอร์ชัน A', c:'var(--st-active)' },
    { t:'10:30', who:'พู่กันสะท้านใจ', txt:'ส่งบท v2 ให้หอภาพมายา', c:'var(--gold)' },
    { t:'10:18', who:'เซียนลูกคิดเหล็ก', txt:'เข้าสู่สถานะพักฟื้น — โหลดประมวลผลสูง', c:'var(--cinnabar-hi)' },
    { t:'09:48', who:'ตาเหยี่ยวพันลี้', txt:'พบ 3 มุมขายเด่นหมวดความงาม', c:'var(--st-active)' },
    { t:'09:12', who:'พญาอินทรีบัญชาทัพ', txt:'เปิดศึก “เซรั่มหยกขาว” มอบหมาย 6 สำนัก', c:'var(--cinnabar-hi)' },
  ];
  return (
    <div className="jh jh-ink" style={{ width:1280, minHeight:860 }}>
      {/* หัว */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between',
        padding:'22px 30px 18px', borderBottom:'1px solid var(--ink-line)' }}>
        <div>
          <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
            <h1 className="jh-disp" style={{ fontSize:30, fontWeight:700 }}>ศาลบัญชาการทัพ</h1>
            <span className="jh-cjk" style={{ fontSize:23, color:'var(--gold)', opacity:.75 }}>帥府</span>
          </div>
          <p style={{ color:'var(--tx-dim)', fontSize:13, marginTop:4 }}>ภาพรวมสถานะกองทัพ Agent แบบเรียลไทม์ · อัปเดต 10:31</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Btn kind="ink" sm>รายงานศึก</Btn>
          <Btn kind="gold" sm>+ เปิดศึกใหม่</Btn>
        </div>
      </div>

      <div style={{ padding:'20px 30px 30px' }}>
        {/* การ์ดสรุป */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          <StatTile label="จอมยุทธทั้งหมด" cjk="眾" value={AGENTS.length} sub={`พลังทัพรวม 46,110`} />
          <StatTile label="กำลังออกศึก" cjk="戰" value={counts.active||0} sub="ปฏิบัติภารกิจอยู่" color="var(--st-active)" />
          <StatTile label="ภารกิจที่เปิด" cjk="令" value="3" sub="1 ใกล้เสร็จ · 2 รอคิว" color="var(--gold-hi)" />
          <StatTile label="ต้องดูแล" cjk="療" value={counts.rest||0} sub="พักฟื้น/โหลดสูง" color="var(--cinnabar-hi)" />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:22, marginTop:24 }}>
          {/* ตารางสถานะสด */}
          <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <DualHead th="สถานะกองทัพสด" cjk="陣況" />
              <span className="jh-tag">เรียงตามพลัง</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'40px 1fr 116px 150px 70px', gap:14,
              padding:'8px 4px', borderBottom:'1px solid var(--ink-line)' }}>
              {['สำนัก','จอมยุทธ / ภารกิจ','สถานะ','ความคืบหน้า','พลัง'].map((h,i)=>(
                <span key={i} className="jh-tag" style={{ textAlign:i===4?'right':'left' }}>{h}</span>
              ))}
            </div>
            {AGENTS.map(a=> <LiveRow key={a.id} a={a} />)}
          </div>

          {/* ฟีดบันทึกศึก */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div style={{ background:'linear-gradient(160deg,#221a10,#16110a)', border:'1px solid var(--gold-deep)',
              borderRadius:6, padding:'16px 18px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <DualHead th="ศึกที่กำลังดำเนิน" cjk="進行戰役" />
              </div>
              <div style={{ marginTop:14 }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                  <span className="jh-disp" style={{ fontSize:18, color:'var(--gold-hi)', fontWeight:600 }}>{QUEST.title}</span>
                </div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--tx-faint)', marginTop:3 }}>{QUEST.code} · เริ่ม {QUEST.started} · คาดเสร็จ {QUEST.eta}</div>
                <div style={{ marginTop:12 }}><Meter value={0.42} color="var(--gold)" h={7} /></div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:7, fontSize:11.5, color:'var(--tx-dim)' }}>
                  <span>คืบหน้า 42% · 2/6 ด่าน</span><span style={{ color:'var(--st-active)' }}>ช่วงตัดต่อ</span>
                </div>
              </div>
            </div>

            <div style={{ background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'16px 18px', flex:1 }}>
              <DualHead th="บันทึกศึก" cjk="戰報" />
              <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:13 }}>
                {feed.map((f,i)=>(
                  <div key={i} style={{ display:'flex', gap:11 }}>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--tx-faint)', width:38, flex:'0 0 auto', paddingTop:1 }}>{f.t}</span>
                    <span style={{ width:7, height:7, borderRadius:9, background:f.c, marginTop:5, flex:'0 0 auto' }}></span>
                    <span style={{ fontSize:12.5, color:'var(--tx-dim)', lineHeight:1.45 }}>
                      <b style={{ color:'var(--tx)' }}>{f.who}</b> {f.txt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
