/* ====== Prototype data layer · localStorage + factory + generators ====== */
import { STATUS, TIERS, AGENTS, SKILLS, MEMORY } from './data';

export const SECT_OPTIONS = [
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
function cjk2(r){ const a=CJK_POOL[Math.floor(r()*CJK_POOL.length)]||'玄'; const b=CJK_POOL[Math.floor(r()*CJK_POOL.length)]||'訣'; return a+b; }

/* ---- วิชา/Skill ต่อ Agent ---- */
const SKILL_KINDS = ['อาวุธเอก','วิชาภายใน','วิชาเสริม','วิชาขั้นต้น'];
export function skillsFor(a){
  if(a.id==='smith') return SKILLS;
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
      desc:`สำแดงพลังด้าน "${e}" ระดับ${TIERS[Math.min(4,Math.floor(lvl/2))]} หลอมจากการฝึกนับร้อยภารกิจ`,
      uses: 120 + Math.floor(r()*1800),
    };
  });
}

/* ---- คุณสมบัติ/Attributes ต่อ Agent ---- */
export function attrsFor(a){
  const r = rng(seed(a.id+'at'));
  const names = ['ความเร็ว','ความเนี้ยบ','ความคิดสร้างสรรค์','ความแม่นยำ','พลังภายใน'];
  const colors = ['var(--gold)','var(--gold-hi)','#9a7fc2','var(--st-active)','#5fa3a8'];
  return names.map((n,i)=>({ label:n, value: Math.round((0.5 + r()*0.48 + a.level/400)*100)/100, color:colors[i] }));
}

/* ---- คลังคัมภีร์/Memory ต่อ Agent ---- */
export function memoryFor(a){
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
export function makeAgent(form, base){
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

export function agentToForm(a){
  return {
    alias:a.alias, real:a.real==='—'?'':a.real, sect:a.sect, role:a.role, persona:a.persona,
    expertise:(a.expertise||[]).join(', '), level:a.level, tier:a.tier, status:a.status,
    task:a.task==='—'?'':a.task,
  };
}

/* ---- localStorage · Agents ---- */
const LS_KEY = 'jianghu_agents_v1';
export function loadAgents(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw){ const arr = JSON.parse(raw); if(Array.isArray(arr) && arr.length) return arr; }
  }catch(e){}
  return AGENTS.slice();
}
export function saveAgents(arr){
  try{ localStorage.setItem(LS_KEY, JSON.stringify(arr)); }catch(e){}
}
export function resetAgents(){ try{ localStorage.removeItem(LS_KEY); }catch(e){} return AGENTS.slice(); }

/* ---- localStorage · Campaigns ---- */
const CAMP_KEY = 'jianghu_campaigns_v1';
export const PIPELINE_ORDER = ['marshal','scout','scribe','smith','voice','herald','abacus'];

function defaultCampaigns(){
  return [{
    id:'cmp-2048', title:'ศึกเปิดตัว "เซรั่มหยกขาว"', cjk:'白玉戰役',
    code:'CMP-2048', product:'เซรั่มหยกขาว', started:'วันนี้ 09:12', eta:'13:40', status:'active',
    steps:[
      { agent:'scout',  label:'ล่าเทรนด์ & คัดมุมขาย', state:'done',   t:'09:12–09:48', out:'3 มุมขายเด่น' },
      { agent:'scribe', label:'ร่างบท 6 ท่อน',          state:'done',   t:'09:48–10:30', out:'สคริปต์ v2'  },
      { agent:'smith',  label:'ตัดต่อ & เรนเดอร์',       state:'active', t:'10:30–…',     out:'9:16 · 62%'  },
      { agent:'voice',  label:'พากย์เสียง & ดนตรี',      state:'queued', t:'รอ',           out:'—'           },
      { agent:'herald', label:'เผยแพร่ 4 แพลตฟอร์ม',     state:'queued', t:'รอ',           out:'—'           },
      { agent:'abacus', label:'วัดผล & สรุป ROI',         state:'queued', t:'รอ',           out:'—'           },
    ],
  }];
}

export function loadCampaigns(){
  try{
    const raw = localStorage.getItem(CAMP_KEY);
    if(raw){ const arr = JSON.parse(raw); if(Array.isArray(arr) && arr.length) return arr; }
  }catch(e){}
  return defaultCampaigns();
}
export function saveCampaigns(arr){ try{ localStorage.setItem(CAMP_KEY, JSON.stringify(arr)); }catch(e){} }
export function resetCampaigns(){ try{ localStorage.removeItem(CAMP_KEY); }catch(e){} return defaultCampaigns(); }

export function makeCampaign({ title, product, agentIds }, agents){
  const now = new Date();
  const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const code = 'CMP-' + (Math.floor(Math.random()*9000)+1000);
  const sorted = [
    ...PIPELINE_ORDER.filter(id => agentIds.includes(id)),
    ...agentIds.filter(id => !PIPELINE_ORDER.includes(id)),
  ];
  const steps = sorted.map((id, i) => {
    const a = agents.find(ag => ag.id === id);
    return {
      agent: id,
      label: a ? (a.role?.split('·')[0]?.trim() || a.alias) : id,
      state: i === 0 ? 'active' : 'queued',
      t: i === 0 ? `วันนี้ ${t}–…` : 'รอ',
      out: '—',
    };
  });
  return {
    id: code.toLowerCase(), title: title.trim(), cjk: '新戰役',
    code, product: product.trim(), started: `วันนี้ ${t}`, eta: '—',
    status: 'active', steps,
  };
}
