/* ====== Prototype data layer · localStorage + factory + generators ====== */

const SECT_OPTIONS = [
  { sect:'ตำหนักใหญ่', sectCjk:'總壇', glyph:'帥', accent:'var(--gold)' },
  { sect:'หอสอดแนม',   sectCjk:'探玄閣', glyph:'探', accent:'var(--st-active)' },
  { sect:'เรือนอักษร', sectCjk:'翰墨齋', glyph:'文', accent:'var(--gold-hi)' },
  { sect:'หอภาพมายา',  sectCjk:'幻影樓', glyph:'影', accent:'#9a7fc2' },
  { sect:'ตำหนักวจี',  sectCjk:'梵音殿', glyph:'聲', accent:'#5fa3a8' },
  { sect:'สายพเนจร',   sectCjk:'江湖行', glyph:'行', accent:'#c98a4a' },
  { sect:'เรือนคำนวณ', sectCjk:'鐵算盤', glyph:'算', accent:'var(--cinnabar-hi)' },
  { sect:'สำนักอิสระ', sectCjk:'散修',  glyph:'俠', accent:'var(--gold)' },
];

const CJK_POOL = ['玄','靈','風','雷','影','光','心','劍','訣','章','法','道','術','神','妙','通','破','御','華','機','算','韻','色','聲','字','勢','謀','勘','探','虛'];

function seed(str){ let h=0; for(let i=0;i<str.length;i++){ h=(h*31+str.charCodeAt(i))>>>0; } return h; }
function rng(s){ let x=s||1; return ()=>{ x=(x*1103515245+12345)&0x7fffffff; return x/0x7fffffff; }; }
function pick(arr,r){ return arr[Math.floor(r()*arr.length)%arr.length]; }
function cjk2(r){ const a=CJK_POOL[Math.floor(r()*CJK_POOL.length)]||'玄'; const b=CJK_POOL[Math.floor(r()*CJK_POOL.length)]||'訣'; return a+b; }

/* ---- วิชา/Skill ต่อ Agent ---- */
const SKILL_KINDS = ['อาวุธเอก','วิชาภายใน','วิชาเสริม','วิชาขั้นต้น'];
function skillsFor(a){
  if(a.id==='smith') return SKILLS; // ใช้ชุดที่ออกแบบไว้
  const r = rng(seed(a.id+'sk'));
  const base = (a.expertise||[]).slice(0,3);
  while(base.length<3) base.push(['สมาธิภายใน','ลมปราณ','สำเหนียก'][base.length]);
  const extras = ['ลมปราณประสาน','สมาธิเพชร'];
  const all = base.concat(extras).slice(0,5);
  return all.map((e,i)=>{
    const lvl = Math.max(3, Math.min(9, Math.round(a.level/8) + (i===0?2:-i) + Math.floor(r()*2)));
    return {
      name:(i===0?'วิชา':(i<3?'เพลง':'กระบวนท่า'))+e, cjk:cjk2(r),
      lvl, max:9, kind:SKILL_KINDS[Math.min(i,3)], xp:Math.round(r()*90)/100,
      desc:`สำแดงพลังด้าน “${e}” ระดับ${TIERS[Math.min(4,Math.floor(lvl/2))]} หลอมจากการฝึกนับร้อยภารกิจ`,
      uses: 120 + Math.floor(r()*1800),
    };
  });
}

/* ---- คุณสมบัติ/Attributes ต่อ Agent ---- */
function attrsFor(a){
  const r = rng(seed(a.id+'at'));
  const names = ['ความเร็ว','ความเนี้ยบ','ความคิดสร้างสรรค์','ความแม่นยำ','พลังภายใน'];
  const colors = ['var(--gold)','var(--gold-hi)','#9a7fc2','var(--st-active)','#5fa3a8'];
  return names.map((n,i)=>({ label:n, value: Math.round((0.5 + r()*0.48 + a.level/400)*100)/100, color:colors[i] }));
}

/* ---- คลังคัมภีร์/Memory ต่อ Agent ---- */
function memoryFor(a){
  if(a.id==='smith') return MEMORY;
  const r = rng(seed(a.id+'me'));
  const longTerm = [
    { title:`คัมภีร์ประจำ${a.sect}`, tag:'brand', age:`${2+Math.floor(r()*20)} วัน`,
      note:`หลักวิชาและแนวทางของ${a.sect} — ${a.persona}`, strength:0.8+r()*0.18 },
    { title:'ตำราผู้ชม & ตลาด', tag:'audience', age:`${1+Math.floor(r()*8)} วัน`,
      note:'รูปแบบกลุ่มเป้าหมายและช่วงเวลาที่ตอบสนองดีที่สุด สรุปจากศึกที่ผ่านมา', strength:0.7+r()*0.2 },
    { title:'ม้วนสไตล์ที่เวิร์ก', tag:'pattern', age:`${1+Math.floor(r()*5)} วัน`,
      note:`สูตรการทำงานที่ให้ผลดีของ${a.alias}`, strength:0.66+r()*0.2 },
  ];
  const shortTerm = a.status==='active' ? [
    { t:'00:02', txt:'รับคำสั่งจากแม่ทัพ' },
    { t:'00:06', txt:`เรียกใช้ความเชี่ยวชาญ: ${(a.expertise||[])[0]||'วิชาประจำตัว'}` },
    { t:'now',   txt: a.task && a.task!=='—' ? a.task : 'กำลังปฏิบัติภารกิจ' },
  ] : [
    { t:'—', txt:'ยังไม่มีภารกิจเฉพาะกิจ' },
    { t:'now', txt: STATUS[a.status].desc },
  ];
  return { longTerm, shortTerm };
}

/* ---- factory: สร้าง/แก้ไข Agent ---- */
function makeAgent(form, base){
  const so = SECT_OPTIONS.find(s=>s.sect===form.sect) || SECT_OPTIONS[SECT_OPTIONS.length-1];
  const lvl = Math.max(1, Math.min(99, parseInt(form.level)||30));
  const exp = (form.expertise||'').split(',').map(s=>s.trim()).filter(Boolean).slice(0,4);
  const power = base ? (2000 + lvl*120 + (base.power%600)) : (2000 + lvl*120 + Math.floor(Math.random()*600));
  return {
    id: base ? base.id : 'a'+Date.now().toString(36),
    alias: form.alias?.trim() || 'จอมยุทธนิรนาม',
    real: form.real?.trim() || '—',
    sect: so.sect, sectCjk: so.sectCjk, glyph: so.glyph, accent: so.accent,
    role: form.role?.trim() || 'จอมยุทธสังกัด '+so.sect,
    level: lvl, tier: Math.max(0, Math.min(4, parseInt(form.tier)??1)),
    status: form.status || 'queued',
    power,
    persona: form.persona?.trim() || 'จอมยุทธหน้าใหม่ผู้รอพิสูจน์ฝีมือในยุทธจักร',
    expertise: exp.length?exp:['วิชาประจำตัว'],
    task: form.status==='active' ? (form.task?.trim()||'เริ่มภารกิจแรก') : '—',
    custom: base ? base.custom : true,
  };
}

/* แปลง agent → ค่าเริ่มต้นของฟอร์ม (ใช้ตอนแก้ไข) */
function agentToForm(a){
  return {
    alias:a.alias, real:a.real==='—'?'':a.real, sect:a.sect, role:a.role, persona:a.persona,
    expertise:(a.expertise||[]).join(', '), level:a.level, tier:a.tier, status:a.status,
    task:a.task==='—'?'':a.task,
  };
}

/* ---- localStorage ---- */
const LS_KEY = 'jianghu_agents_v1';
function loadAgents(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw){ const arr = JSON.parse(raw); if(Array.isArray(arr) && arr.length) return arr; }
  }catch(e){}
  return AGENTS.slice();
}
function saveAgents(arr){
  try{ localStorage.setItem(LS_KEY, JSON.stringify(arr)); }catch(e){}
}
function resetAgents(){ try{ localStorage.removeItem(LS_KEY); }catch(e){} return AGENTS.slice(); }

Object.assign(window, {
  SECT_OPTIONS, skillsFor, attrsFor, memoryFor, makeAgent, agentToForm,
  loadAgents, saveAgents, resetAgents,
});
