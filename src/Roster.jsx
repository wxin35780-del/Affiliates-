/* ====== หน้าทำเนียบ ====== */
import React, { useState } from 'react';
import { STATUS, TIERS } from './data';
import { Portrait, StatusBadge, SectGlyph, TierPips, Btn, DualHead } from './ui';

function HudCorner({ pos }) {
  const m = { tl:{top:6,left:6}, tr:{top:6,right:6}, bl:{bottom:6,left:6}, br:{bottom:6,right:6} }[pos];
  const rot = { tl:'0deg', tr:'90deg', br:'180deg', bl:'270deg' }[pos];
  return <span style={{ position:'absolute', ...m, width:12, height:12, borderTop:'2px solid var(--gold)',
    borderLeft:'2px solid var(--gold)', transform:`rotate(${rot})`, opacity:.85 }}></span>;
}

function PickCard({ a, active, onPick, onOpen }) {
  const st = STATUS[a.status];
  const [hover, setHover] = useState(false);
  return (
    <div onClick={()=>onPick(a.id)} onDoubleClick={()=>onOpen(a.id)}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      className="jh-frame" style={{ position:'relative', cursor:'pointer', borderRadius:5, padding:8,
        background: active?'linear-gradient(160deg,#2a2013,#160f08)':'var(--ink-1)',
        border:`1px solid ${active?'var(--gold)':'var(--ink-line)'}`,
        boxShadow: active?'0 0 0 1px var(--gold), 0 8px 24px rgba(200,162,74,.18)'
                 : hover?'0 6px 18px rgba(0,0,0,.35)':'none',
        transform: hover&&!active?'translateY(-2px)':'none', transition:'all .16s' }}>
      {active && <><HudCorner pos="tl"/><HudCorner pos="tr"/><HudCorner pos="bl"/><HudCorner pos="br"/></>}
      {a.custom && <div style={{ position:'absolute', top:-1, left:-1, fontSize:9, fontFamily:'var(--font-mono)',
        letterSpacing:'.1em', color:'#241a08', background:'var(--gold)', padding:'2px 7px', borderRadius:'4px 0 6px 0', zIndex:2 }}>ใหม่</div>}
      <div style={{ position:'relative' }}>
        <Portrait glyph={a.glyph} accent={a.accent} label="" slotId={`slot-${a.id}`} style={{ height:100 }} />
        <div style={{ position:'absolute', top:7, right:7, display:'flex', alignItems:'center', gap:5,
          padding:'2px 8px', borderRadius:99, background:'rgba(8,6,3,.6)', border:`1px solid ${st.color}66` }}>
          <span style={{ width:6, height:6, borderRadius:9, background:st.color }}></span>
          <span style={{ fontSize:10, color:st.color }}>{st.th}</span>
        </div>
        <div style={{ position:'absolute', left:7, bottom:7 }}><SectGlyph char={a.glyph} accent={a.accent} size={34} /></div>
      </div>
      <div style={{ padding:'10px 6px 4px' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8 }}>
          <h3 className="jh-disp" style={{ fontSize:16, fontWeight:600, color: active?'var(--gold-hi)':'var(--tx)',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.alias}</h3>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gold)', flex:'0 0 auto' }}>Lv{a.level}</span>
        </div>
        <p style={{ fontSize:11, color:'var(--tx-faint)', marginTop:2 }}>{a.sect} · {a.real}</p>
        <div style={{ height:1, background:'var(--ink-line)', margin:'9px 0 8px' }}></div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <TierPips tier={a.tier} />
          <span className="jh-tag">{a.power.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

const STATUS_CHIPS = [
  { key:'all', label:'ทั้งหมด' },
  { key:'active', label:'ออกศึก', color:'var(--st-active)' },
  { key:'queued', label:'รอคำสั่ง', color:'var(--st-queued)' },
  { key:'idle',   label:'พักฌาน',  color:'var(--st-idle)'   },
  { key:'rest',   label:'พักฟื้น', color:'var(--st-rest)'   },
];
const SORT_OPTS = [
  { v:'power', label:'พลัง ↓' },
  { v:'level', label:'เลเวล ↓' },
  { v:'name',  label:'ชื่อ A-Z' },
  { v:'status',label:'สถานะ' },
];

export function RosterView({ agents, selId, setSelId, onOpen, onAdd, onNewCampaign, isMobile }) {
  const a = agents.find(x=>x.id===selId) || agents[0];
  const sects = ['ทั้งหมด', ...Array.from(new Set(agents.map(x=>x.sect)))].slice(0,7);
  const [sectFilter, setSectFilter] = useState('ทั้งหมด');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('power');
  const [search, setSearch] = useState('');
  const totalPower = agents.reduce((n,x)=>n+x.power,0);
  const activeN = agents.filter(x=>x.status==='active').length;
  const q = search.toLowerCase();
  const shown = [...agents.filter(x=>{
    const sectMatch = sectFilter==='ทั้งหมด' || x.sect===sectFilter;
    const statusMatch = statusFilter==='all' || x.status===statusFilter;
    const searchMatch = !q || x.alias.toLowerCase().includes(q) || x.sect.toLowerCase().includes(q) || x.role.toLowerCase().includes(q) || (x.expertise||[]).some(e=>e.toLowerCase().includes(q));
    return sectMatch && statusMatch && searchMatch;
  })].sort((a,b)=>{
    if(sort==='power') return b.power-a.power;
    if(sort==='level') return b.level-a.level;
    if(sort==='name')  return a.alias.localeCompare(b.alias,'th');
    if(sort==='status'){ const o={active:0,queued:1,idle:2,rest:3}; return (o[a.status]??3)-(o[b.status]??3); }
    return 0;
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100%' }}>
      {/* หัว */}
      <div style={{ padding: isMobile?'14px 16px 12px':'22px 32px 16px', borderBottom:'1px solid var(--ink-line)', flex:'0 0 auto' }}>
        {!isMobile && (
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:20, flexWrap:'wrap', marginBottom:0 }}>
          <div style={{ minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:14, flexWrap:'wrap' }}>
              <h1 className="jh-disp" style={{ fontSize:30, fontWeight:700, whiteSpace:'nowrap' }}>ทำเนียบยุทธจักร</h1>
              <span className="jh-cjk" style={{ fontSize:24, color:'var(--gold)', opacity:.75 }}>群俠錄</span>
            </div>
            <p style={{ color:'var(--tx-dim)', fontSize:13, marginTop:4 }}>กองทัพ Agent {agents.length} ตัว · ออกศึก {activeN} · ดับเบิลคลิกการ์ดเพื่อเปิดสำนวน</p>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center', flex:'0 0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 13px', borderRadius:6,
              border:`1px solid ${search?'var(--gold-deep)':'var(--ink-line)'}`, background:'var(--ink-1)', width:200 }}>
              <span style={{ opacity:.6, color:'var(--tx-faint)' }}>⌕</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาจอมยุทธ…"
                style={{ background:'transparent', border:'none', outline:'none', color:'var(--tx)',
                  fontFamily:'var(--font-body)', fontSize:13, width:'100%' }} />
              {search && <span onClick={()=>setSearch('')} style={{ cursor:'pointer', color:'var(--tx-faint)', fontSize:16, lineHeight:1 }}>×</span>}
            </div>
            <Btn kind="gold" sm onClick={onAdd}>+ เรียกจอมยุทธ</Btn>
          </div>
        </div>
        )}
        {isMobile && (
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:6,
            border:`1px solid ${search?'var(--gold-deep)':'var(--ink-line)'}`, background:'var(--ink-1)' }}>
            <span style={{ opacity:.6, color:'var(--tx-faint)' }}>⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาจอมยุทธ…"
              style={{ background:'transparent', border:'none', outline:'none', color:'var(--tx)',
                fontFamily:'var(--font-body)', fontSize:13, width:'100%' }} />
            {search && <span onClick={()=>setSearch('')} style={{ cursor:'pointer', color:'var(--tx-faint)', fontSize:16, lineHeight:1 }}>×</span>}
          </div>
          <Btn kind="gold" sm onClick={onAdd}>+</Btn>
        </div>
        )}
        <div style={{ display:'flex', gap:6, marginTop:12, overflowX:'auto', paddingBottom:2, alignItems:'center', flexWrap: isMobile?'nowrap':'wrap' }} className="jh-scroll">
          {STATUS_CHIPS.map(chip=>{
            const sel = statusFilter===chip.key;
            return (
              <span key={chip.key} onClick={()=>setStatusFilter(chip.key)} style={{
                fontSize:12, padding:'4px 12px', borderRadius:99, whiteSpace:'nowrap',
                border:`1px solid ${sel?(chip.color||'var(--gold)'):'var(--ink-line)'}`,
                background:sel?`${chip.color||'var(--gold)'}18`:'transparent',
                color:sel?(chip.color||'var(--gold-hi)'):'var(--tx-dim)', cursor:'pointer',
                display:'flex', alignItems:'center', gap:5,
              }}>
                {chip.color && <span style={{ width:5, height:5, borderRadius:9, background:chip.color, opacity: sel?1:.6 }}></span>}
                {chip.label}
              </span>
            );
          })}
          <span style={{ width:1, height:16, background:'var(--ink-line)', margin:'0 4px', flex:'0 0 auto' }}></span>
          {sects.map(s=>(
            <span key={s} onClick={()=>setSectFilter(s)} style={{ fontSize:12, padding:'4px 12px', borderRadius:99, whiteSpace:'nowrap',
              border:`1px solid ${s===sectFilter?'var(--gold-deep)':'var(--ink-line)'}`,
              background:s===sectFilter?'rgba(200,162,74,.08)':'transparent',
              color:s===sectFilter?'var(--gold-hi)':'var(--tx-faint)', cursor:'pointer' }}>{s}</span>
          ))}
          <div style={{ marginLeft:'auto', flex:'0 0 auto' }}>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{
              background:'var(--ink-2)', border:'1px solid var(--ink-line)', borderRadius:6,
              color:'var(--tx-dim)', fontFamily:'var(--font-body)', fontSize:12, padding:'4px 10px',
              cursor:'pointer', outline:'none',
            }}>
              {SORT_OPTS.map(o=><option key={o.v} value={o.v}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ตัว */}
      <div style={{ flex:1, display:'flex', minHeight:0, flexWrap:'wrap' }}>
        {/* ฮีโร่ซ้าย — hidden on mobile */}
        {a && !isMobile && (
        <div style={{ flex:'1 1 372px', minWidth:340, padding:'24px 28px',
          background:'linear-gradient(180deg,#1f1810,#100c07)', borderRight:'1px solid var(--ink-line)' }}>
          <div className="jh-tag" style={{ color:'var(--cinnabar-hi)' }}>จอมยุทธที่เลือก · 選將</div>
          <div className="jh-frame" style={{ position:'relative', marginTop:14, borderRadius:5,
            border:'1px solid var(--gold-deep)', padding:7, cursor:'pointer' }} onClick={()=>onOpen(a.id)}>
            <Portrait glyph={a.glyph} accent={a.accent} label="ภาพจอมยุทธเต็มตัว" slotId={`slot-${a.id}`} style={{ height:262, borderRadius:3 }} />
            <div style={{ position:'absolute', top:15, left:15 }}><StatusBadge status={a.status} size="sm" /></div>
            <div style={{ position:'absolute', bottom:15, right:15 }}>
              <div style={{ width:48, height:48, flex:'0 0 auto', display:'grid', placeItems:'center',
                color:'#f3e7d6', fontFamily:'var(--font-brush)', fontSize:22, lineHeight:1,
                background:'linear-gradient(150deg,#c0432f,#9a2f24)', border:'1.5px solid rgba(255,225,200,.45)',
                borderRadius:8, boxShadow:'inset 0 0 0 2px rgba(120,30,20,.55)',
                textShadow:'0 1px 1px rgba(80,15,10,.6)' }}>{a.glyph}</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:16 }}>
            <SectGlyph char={a.glyph} accent={a.accent} size={30} ring={false} />
            <span className="jh-tag" style={{ color:a.accent }}>{a.sect} · {a.sectCjk}</span>
          </div>
          <h2 className="jh-disp" style={{ fontSize:29, fontWeight:700, color:'var(--gold-hi)', marginTop:7 }}>{a.alias}</h2>
          <p style={{ fontSize:13, color:'var(--tx-dim)', marginTop:3 }}>{a.real} · {a.role}</p>
          <p style={{ fontSize:13, color:'var(--tx-faint)', marginTop:12, lineHeight:1.55 }}>{a.persona}</p>
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            {[['เลเวล', a.level, 'var(--gold)'],['ระดับชั้น', TIERS[a.tier], 'var(--gold-hi)'],['พลัง', a.power.toLocaleString(), 'var(--st-active)']].map(([l,v,c],i)=>(
              <div key={i} style={{ flex:1, background:'var(--ink-1)', border:'1px solid var(--ink-line)', borderRadius:6, padding:'10px 12px' }}>
                <div className="jh-tag">{l}</div>
                <div style={{ fontFamily: i===1?'var(--font-body)':'var(--font-mono)', fontSize:i===1?13:18, fontWeight:i===1?600:400, color:c, marginTop:5 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:14 }}>
            {(a.expertise||[]).map(e=>(
              <span key={e} style={{ fontSize:11.5, padding:'4px 10px', borderRadius:5,
                background:'var(--ink-3)', border:'1px solid var(--ink-line)', color:'var(--tx-dim)' }}>{e}</span>
            ))}
          </div>
          <div style={{ display:'flex', gap:10, marginTop:18 }}>
            <Btn kind="gold" style={{ flex:1 }} onClick={()=>onOpen(a.id)}>เปิดสำนวนประจำตัว</Btn>
          </div>
        </div>
        )}

        {/* กริดเลือกขวา */}
        <div style={{ flex:'3 1 460px', display:'flex', flexDirection:'column', padding: isMobile?'14px 16px':'22px 28px', minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <DualHead th="กองกำลังในสังกัด" cjk="陣容" />
            <span className="jh-tag">{shown.length}/{agents.length} ตัว{sectFilter!=='ทั้งหมด'?` · ${sectFilter}`:''}{statusFilter!=='all'?` · ${STATUS_CHIPS.find(c=>c.key===statusFilter)?.label}`:''}{search?` · "${search}"`:''}</span>
          </div>
          {shown.length===0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--tx-faint)' }}>
              <div className="jh-cjk" style={{ fontSize:36, color:'var(--gold-deep)' }}>尋</div>
              <p style={{ marginTop:12, fontSize:13.5 }}>ไม่พบจอมยุทธที่ตรงกับเงื่อนไขนี้</p>
              <button onClick={()=>{ setSearch(''); setSectFilter('ทั้งหมด'); setStatusFilter('all'); }} style={{ marginTop:14, fontSize:12.5,
                color:'var(--gold-hi)', background:'transparent', border:'1px solid var(--gold-deep)',
                borderRadius:6, padding:'7px 16px', cursor:'pointer', fontFamily:'var(--font-body)' }}>ล้างตัวกรอง</button>
            </div>
          ) : (
          <div style={{ display:'grid', gridTemplateColumns: isMobile?'repeat(auto-fill,minmax(160px,1fr))':'repeat(auto-fill,minmax(208px,1fr))', gap: isMobile?10:14, alignContent:'start' }}>
            {shown.map(x=> <PickCard key={x.id} a={x} active={x.id===selId} onPick={setSelId} onOpen={onOpen} />)}
            <div onClick={onAdd} style={{ cursor:'pointer', minHeight:208, borderRadius:5, border:'1px dashed var(--gold-deep)',
              background:'rgba(200,162,74,.04)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, color:'var(--gold-deep)' }}>
              <span className="jh-cjk" style={{ fontSize:34 }}>召</span>
              <span style={{ fontSize:13, color:'var(--gold-hi)' }}>+ เรียกจอมยุทธใหม่</span>
            </div>
          </div>
          )}
          <div style={{ marginTop:24 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'14px 20px', borderRadius:7, border:'1px solid var(--gold-deep)',
              background:'linear-gradient(110deg,#221a10,#15100a)' }}>
              <div style={{ display:'flex', gap:28 }}>
                <div><div className="jh-tag">พลังทัพรวม</div><div style={{ fontFamily:'var(--font-mono)', fontSize:21, color:'var(--gold)', marginTop:3 }}>{totalPower.toLocaleString()}</div></div>
                <div style={{ alignSelf:'stretch', width:1, background:'var(--ink-line)' }}></div>
                <div><div className="jh-tag">กำลังออกศึก</div><div style={{ fontFamily:'var(--font-mono)', fontSize:21, color:'var(--st-active)', marginTop:3 }}>{activeN}</div></div>
                <div><div className="jh-tag">จอมยุทธทั้งหมด</div><div style={{ fontFamily:'var(--font-mono)', fontSize:21, color:'var(--tx)', marginTop:3 }}>{agents.length}</div></div>
              </div>
              <Btn kind="gold" onClick={onNewCampaign}>จัดทัพออกศึก →</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
