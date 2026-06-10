/* ====== ส่วนประกอบ UI ร่วม (ยุทธภพ) ====== */
import React from 'react';
import { STATUS, TIERS } from './data';

/* ตราประทับชาด — seal stamp */
export function Seal({ text='印', size=46, style }) {
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

/* placeholder ภาพจอมยุทธ */
export function Portrait({ glyph='俠', accent='var(--gold)', label='ภาพจอมยุทธ', radius=2, slotId, src, style }) {
  const [imgSrc, setImgSrc] = React.useState(() => {
    if (slotId) {
      try { const d = localStorage.getItem('img_slot_'+slotId); return d || src || null; } catch(e) { return src || null; }
    }
    return src || null;
  });
  const [dragging, setDragging] = React.useState(false);
  const fileRef = React.useRef();

  const saveImage = (url) => {
    setImgSrc(url);
    if (slotId) try { localStorage.setItem('img_slot_'+slotId, url); } catch(e) {}
  };

  const handleFiles = (files) => {
    const file = files && files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 400;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        saveImage(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  if (imgSrc) {
    return (
      <div style={{ position:'relative', overflow:'hidden', borderRadius:radius, ...style }}
        onDragOver={e=>{ e.preventDefault(); setDragging(true); }}
        onDragLeave={()=>setDragging(false)}
        onDrop={handleDrop}>
        <img src={imgSrc} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        <div style={{ position:'absolute', inset:0, opacity:dragging?1:0, transition:'opacity .15s',
          display:'flex', alignItems:'center', justifyContent:'center',
          background:'rgba(0,0,0,.55)', color:'var(--gold)', fontSize:12 }}>
          วางรูปใหม่
        </div>
        <div style={{ position:'absolute', top:6, right:6, display:'flex', gap:4, opacity:0 }}
          className="portrait-ctl">
          <button onClick={()=>fileRef.current?.click()} style={{ fontSize:11, padding:'3px 7px', borderRadius:4,
            background:'rgba(0,0,0,.65)', color:'#fff', border:'none', cursor:'pointer' }}>แทนที่</button>
          <button onClick={()=>saveImage(null)} style={{ fontSize:11, padding:'3px 7px', borderRadius:4,
            background:'rgba(0,0,0,.65)', color:'#fff', border:'none', cursor:'pointer' }}>ลบ</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={e=>handleFiles(e.target.files)} />
        <style>{`.portrait-ctl { opacity: 0; transition: opacity .15s; } div:hover > .portrait-ctl { opacity: 1; }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      position:'relative', overflow:'hidden', borderRadius:radius, cursor:'pointer',
      background:
        'repeating-linear-gradient(135deg, rgba(200,162,74,.07) 0 9px, rgba(200,162,74,.02) 9px 18px), '+
        'radial-gradient(120% 90% at 50% 18%, #2a2114 0%, #19130c 70%)',
      outline:dragging?'2px solid var(--gold)':'none',
      ...style,
    }}
      onClick={()=>fileRef.current?.click()}
      onDragOver={e=>{ e.preventDefault(); setDragging(true); }}
      onDragLeave={()=>setDragging(false)}
      onDrop={handleDrop}
    >
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
        <span style={{ width:5, height:5, borderRadius:9, background:accent, opacity:.8 }}></span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'.12em',
          color:'rgba(236,226,201,.55)' }}>{label}</span>
      </div>
      {dragging && (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
          background:'rgba(200,162,74,.12)', color:'var(--gold)', fontSize:12 }}>
          วางรูปที่นี่
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={e=>handleFiles(e.target.files)} />
    </div>
  );
}

/* ป้ายสถานะ — status badge */
export function StatusBadge({ status, size='md' }) {
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
export function SectGlyph({ char, accent='var(--gold)', size=54, ring=true }) {
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
export function TierPips({ tier }) {
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
export function Meter({ value=0.6, color='var(--gold)', h=5, track='var(--ink-3)' }) {
  return (
    <span style={{ display:'block', height:h, borderRadius:9, background:track, overflow:'hidden' }}>
      <span style={{ display:'block', height:'100%', width:`${Math.round(value*100)}%`,
        background:color, borderRadius:9 }}></span>
    </span>
  );
}

/* ปุ่มทอง / ปุ่มหมึก */
export function Btn({ children, kind='gold', sm, style, onClick }) {
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
export function OrnRule({ w=120, color='var(--gold-deep)' }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:8, color }}>
      <span style={{ width:w, height:1, background:`linear-gradient(90deg,transparent,${color})` }}></span>
      <span style={{ transform:'rotate(45deg)', width:6, height:6, border:`1px solid ${color}`, background:color }}></span>
      <span style={{ width:w, height:1, background:`linear-gradient(90deg,${color},transparent)` }}></span>
    </span>
  );
}

/* หัวเรื่องคู่ ไทย+จีน */
export function DualHead({ th, cjk, accent='var(--gold)' }) {
  return (
    <div style={{ display:'flex', alignItems:'baseline', gap:12 }}>
      <h2 className="jh-disp" style={{ fontSize:26, fontWeight:600, color:'var(--tx)', letterSpacing:'.01em' }}>{th}</h2>
      <span className="jh-cjk" style={{ fontSize:18, color:accent, opacity:.7, letterSpacing:'.1em' }}>{cjk}</span>
    </div>
  );
}
