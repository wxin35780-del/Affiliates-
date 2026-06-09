/* ====== ส่วนประกอบ UI ร่วม (ยุทธภพ) ====== */
const { useState } = React;

/* ตราประทับชาด — seal stamp */
function Seal({ text='印', size=46, style }) {
  return (
    <div style={{
      width:size, height:size, flex:'0 0 auto',
      display:'grid', placeItems:'center',
      color:'#f3e7d6', fontFamily:'var(--font-brush)',
      fontSize:size*0.46, lineHeight:1,
      background:'linear-gradient(150deg,#c0432f,#9a2f24)',
      border:'1.5px solid rgba(255,225,200,.45)',
      borderRadius:Math.max(4,size*0.12),
      boxShadow:'inset 0 0 0 2px rgba(120,30,20,.55), 0 1px 5px rgba(120,30,20,.4)',
      textShadow:'0 1px 1px rgba(80,15,10,.6)',
      ...style,
    }}>{text}</div>
  );
}

/* placeholder ภาพจอมยุทธ — ผู้ใช้จะใส่ภาพจริงทีหลัง */
function Portrait({ glyph='俠', accent='var(--gold)', label='ภาพจอมยุทธ', radius=2, slotId, style }) {
  // โหมดวางรูปจริง (เฉพาะ prototype ที่โหลด image-slot.js) — ลาก/คลิกวางรูปได้
  if (slotId && typeof window!=='undefined' && window.customElements && customElements.get('image-slot')) {
    return React.createElement('image-slot', {
      id: slotId, shape:'rounded', radius:String(radius), placeholder: label||'ภาพจอมยุทธ', fit:'cover',
      style: {
        display:'block', width:'100%', height:'100%',
        background:
          'repeating-linear-gradient(135deg, rgba(200,162,74,.07) 0 9px, rgba(200,162,74,.02) 9px 18px), '+
          'radial-gradient(120% 90% at 50% 18%, #2a2114 0%, #19130c 70%)',
        color:'rgba(236,226,201,.55)', fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'.1em',
        ...style,
      },
    });
  }
  return (
    <div style={{
      position:'relative', overflow:'hidden', borderRadius:radius,
      background:
        'repeating-linear-gradient(135deg, rgba(200,162,74,.07) 0 9px, rgba(200,162,74,.02) 9px 18px), '+
        'radial-gradient(120% 90% at 50% 18%, #2a2114 0%, #19130c 70%)',
      ...style,
    }}>
      <div style={{
        position:'absolute', inset:0, display:'grid', placeItems:'center',
        fontFamily:'var(--font-cjk)', fontWeight:900,
        fontSize:'46%', color:accent, opacity:.16,
        WebkitTextStroke:'1px '+accent,
      }}>{glyph}</div>
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        display:'flex', alignItems:'center', justifyContent:'center', gap:6,
        padding:'5px 8px', background:'linear-gradient(0deg, rgba(10,8,5,.82), transparent)',
      }}>
        <span style={{
          width:5, height:5, borderRadius:9, background:accent, opacity:.8,
        }}></span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'.12em',
          color:'rgba(236,226,201,.55)' }}>{label}</span>
      </div>
    </div>
  );
}

/* ป้ายสถานะ — status badge */
function StatusBadge({ status, size='md' }) {
  const s = STATUS[status] || STATUS.idle;
  const sm = size==='sm';
  const pulse = status==='active';
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:sm?5:7,
      padding: sm?'2px 8px':'4px 11px',
      borderRadius:99, border:`1px solid ${s.color}`,
      background:'rgba(0,0,0,.18)',
      fontSize:sm?11:12.5, fontWeight:500, color:s.color, whiteSpace:'nowrap',
    }}>
      <span style={{ position:'relative', width:sm?6:7, height:sm?6:7 }}>
        <span style={{ position:'absolute', inset:0, borderRadius:9, background:s.color }}></span>
        {pulse && <span className="jh-pulse" style={{ position:'absolute', inset:0, borderRadius:9, background:s.color }}></span>}
      </span>
      {s.th}
      <span className="jh-cjk" style={{ opacity:.6, fontSize:sm?10:11 }}>{s.cjk}</span>
    </span>
  );
}

/* เหรียญตราสำนัก — sect medallion */
function SectGlyph({ char, accent='var(--gold)', size=54, ring=true }) {
  return (
    <div style={{
      width:size, height:size, flex:'0 0 auto', position:'relative',
      display:'grid', placeItems:'center', borderRadius:8,
      background:'radial-gradient(120% 120% at 30% 25%, #2c2417, #16110a)',
      boxShadow: ring? `inset 0 0 0 1px ${accent}55, 0 1px 4px rgba(0,0,0,.4)`:'none',
    }}>
      <span className="jh-cjk" style={{ fontSize:size*0.5, fontWeight:900, color:accent }}>{char}</span>
    </div>
  );
}

/* ดาวระดับชั้น — tier pips */
function TierPips({ tier }) {
  return (
    <span style={{ display:'inline-flex', gap:3, alignItems:'center' }}>
      {TIERS.map((_,i)=>(
        <span key={i} style={{
          width:7, height:7, transform:'rotate(45deg)',
          background: i<=tier ? 'var(--gold)' : 'transparent',
          border:`1px solid ${i<=tier?'var(--gold)':'var(--ink-line)'}`,
        }}></span>
      ))}
    </span>
  );
}

/* แถบพลัง — meter */
function Meter({ value=0.6, color='var(--gold)', h=5, track='var(--ink-3)' }) {
  return (
    <span style={{ display:'block', height:h, borderRadius:9, background:track, overflow:'hidden' }}>
      <span style={{ display:'block', height:'100%', width:`${Math.round(value*100)}%`,
        background:color, borderRadius:9 }}></span>
    </span>
  );
}

/* ปุ่มทอง / ปุ่มหมึก */
function Btn({ children, kind='gold', sm, style, onClick }) {
  const base = {
    fontFamily:'var(--font-body)', fontWeight:600, cursor:'pointer',
    fontSize:sm?12:13.5, padding:sm?'6px 13px':'9px 18px', borderRadius:5,
    letterSpacing:'.01em', transition:'all .15s', whiteSpace:'nowrap', ...style,
  };
  const kinds = {
    gold:{ background:'linear-gradient(180deg,#d9b25b,#b98d36)', color:'#241a08',
      border:'1px solid #e6c878', boxShadow:'0 1px 6px rgba(180,140,50,.25)' },
    ghost:{ background:'transparent', color:'var(--gold-hi)', border:'1px solid var(--gold-deep)' },
    ink:{ background:'var(--ink-3)', color:'var(--tx)', border:'1px solid var(--ink-line)' },
  };
  return <button onClick={onClick} style={{ ...base, ...kinds[kind] }}>{children}</button>;
}

/* ขีดคั่นลวดลาย — ornamental divider */
function OrnRule({ w=120, color='var(--gold-deep)' }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:8, color }}>
      <span style={{ width:w, height:1, background:`linear-gradient(90deg,transparent,${color})` }}></span>
      <span style={{ transform:'rotate(45deg)', width:6, height:6, border:`1px solid ${color}`, background:color }}></span>
      <span style={{ width:w, height:1, background:`linear-gradient(90deg,${color},transparent)` }}></span>
    </span>
  );
}

/* หัวเรื่องคู่ ไทย+จีน */
function DualHead({ th, cjk, accent='var(--gold)' }) {
  return (
    <div style={{ display:'flex', alignItems:'baseline', gap:12 }}>
      <h2 className="jh-disp" style={{ fontSize:26, fontWeight:600, color:'var(--tx)', letterSpacing:'.01em' }}>{th}</h2>
      <span className="jh-cjk" style={{ fontSize:18, color:accent, opacity:.7, letterSpacing:'.1em' }}>{cjk}</span>
    </div>
  );
}

Object.assign(window, { Seal, Portrait, StatusBadge, SectGlyph, TierPips, Meter, Btn, OrnRule, DualHead });
