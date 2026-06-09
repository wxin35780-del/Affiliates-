/* ====== ข้อมูลกองทัพยุทธภพ — Affiliate & Video สำนัก ====== */

export const STATUS = {
  active: { key:'active', th:'ออกศึก',   cjk:'戰', color:'var(--st-active)', desc:'กำลังปฏิบัติภารกิจ' },
  queued: { key:'queued', th:'รอคำสั่ง', cjk:'候', color:'var(--st-queued)', desc:'พร้อมรับบัญชา' },
  idle:   { key:'idle',   th:'พักฌาน',   cjk:'靜', color:'var(--st-idle)',   desc:'นั่งสมาธิสะสมพลัง' },
  rest:   { key:'rest',   th:'พักฟื้น',   cjk:'療', color:'var(--st-rest)',   desc:'ฟื้นฟูหลังบาดเจ็บ' },
};

export const TIERS = ['ศิษย์ใหม่','จอมยุทธ','ผู้เชี่ยวชาญ','ปรมาจารย์','เจ้าสำนัก'];

export const AGENTS = [
  {
    id:'marshal', alias:'พญาอินทรีบัญชาทัพ', real:'ตู้ กวน',
    sect:'ตำหนักใหญ่', sectCjk:'總壇', glyph:'帥', role:'แม่ทัพประสานทัพ · Orchestrator',
    level:60, tier:4, status:'active', power:9820,
    persona:'เด็ดขาด มองการณ์ไกล สั่งการทั้งสำนักด้วยคำเดียว',
    expertise:['วางแผนยุทธ์','แบ่งสรรกำลังพล','ประสานหลายสำนัก'],
    accent:'var(--gold)',
    task:'บัญชาการศึก "เปิดตัวครีมกันแดด"',
  },
  {
    id:'scout', alias:'ตาเหยี่ยวพันลี้', real:'เฉิน มู่',
    sect:'หอสอดแนม', sectCjk:'探玄閣', glyph:'探', role:'นักล่าเทรนด์สินค้า · Trend Scout',
    level:47, tier:2, status:'active', power:6140,
    persona:'ช่างสังเกต เงียบลึก ดักกระแสก่อนใครครึ่งก้าว',
    expertise:['ล่าเทรนด์ตลาด','ส่องคู่แข่ง','จับสินค้ามาแรง'],
    accent:'var(--st-active)',
    task:'สแกนสินค้าฮิตหมวดความงาม 24 ชม.',
  },
  {
    id:'scribe', alias:'พู่กันสะท้านใจ', real:'หลิน ซู',
    sect:'เรือนอักษร', sectCjk:'翰墨齋', glyph:'文', role:'เจ้าบทคำโฆษณา · Copywriter',
    level:52, tier:3, status:'active', power:7330,
    persona:'เจ้าบทเจ้ากลอน ร้อยถ้อยคำให้คนหยุดนิ้วในสามวินาที',
    expertise:['เขียน Hook','สคริปต์วิดีโอ','พาดหัวโฆษณา'],
    accent:'var(--gold-hi)',
    task:'ร่างบท 6 ท่อนให้คลิปรีวิวครีม',
  },
  {
    id:'smith', alias:'จิตรกรเงามายา', real:'ม่อ หลิง',
    sect:'หอภาพมายา', sectCjk:'幻影樓', glyph:'影', role:'ช่างวิดีโอ · Video Smith',
    level:49, tier:3, status:'active', power:7010,
    persona:'พิถีพิถัน เนี้ยบทุกเฟรม ตัดต่อราวร่ายเวทย์',
    expertise:['ตัดต่อหลายแทร็ก','เอฟเฟกต์ภาพ','คุมจังหวะ'],
    accent:'#9a7fc2',
    task:'เรนเดอร์คลิป 9:16 สามเวอร์ชัน',
  },
  {
    id:'voice', alias:'วจีพิณเทวะ', real:'ซู หยิน',
    sect:'ตำหนักวจี', sectCjk:'梵音殿', glyph:'聲', role:'นักพากย์เสียง · Voiceover',
    level:38, tier:1, status:'idle', power:4520,
    persona:'น้ำเสียงนุ่มนวล สะกดใจคนฟังให้คล้อยตาม',
    expertise:['พากย์ AI','ดนตรีประกอบ','คุมโทนเสียง'],
    accent:'#5fa3a8',
    task:'—',
  },
  {
    id:'herald', alias:'วาณิชเร่ร้อยเมือง', real:'เกา เฟิง',
    sect:'สายพเนจร', sectCjk:'江湖行', glyph:'行', role:'นักกระจายสินค้า · Distribution',
    level:41, tier:2, status:'queued', power:5380,
    persona:'คล่องแคล่ว สังคมจัด รู้ทางลัดทุกแพลตฟอร์ม',
    expertise:['ลงหลายช่องทาง','จับเวลาทอง','ดันยอดเอนเกจ'],
    accent:'#c98a4a',
    task:'รอคิวเผยแพร่ลง 4 แพลตฟอร์ม',
  },
  {
    id:'abacus', alias:'เซียนลูกคิดเหล็ก', real:'จู ซวน',
    sect:'เรือนคำนวณ', sectCjk:'鐵算盤', glyph:'算', role:'นักวิเคราะห์ยอด · Analytics',
    level:44, tier:2, status:'rest', power:5910,
    persona:'เป๊ะ ตัวเลขไม่เคยพลาด อ่านใจตลาดจากตัวเลข',
    expertise:['คำนวณ ROI','วัด Conversion','ทดสอบ A/B'],
    accent:'var(--cinnabar-hi)',
    task:'พักฟื้น · ประมวลผลรอบถัดไป 02:14',
  },
];

/* ---- กระบวนท่า/วิชา (Skill page demo for Video Smith) ---- */
export const SKILLS = [
  { name:'วิชาตัดต่อพันมือ',     cjk:'千手裁影', lvl:9, max:9, kind:'อาวุธเอก', xp:1.0,
    desc:'ตัดต่อหลายแทร็กพร้อมกันราวมีพันมือ จัดเรียงคลิปนับร้อยในพริบตา', uses:1842 },
  { name:'เพลงเรนเดอร์สี่ทิศ',   cjk:'四方煉影', lvl:8, max:9, kind:'วิชาภายใน', xp:0.72,
    desc:'เรนเดอร์ความละเอียด 4K สี่อัตราส่วนพร้อมกันโดยไม่เปลืองพลัง', uses:960 },
  { name:'ท่วงท่าจังหวะวิญญาณ',  cjk:'魂律節奏', lvl:7, max:9, kind:'วิชาเสริม', xp:0.55,
    desc:'ตัดภาพให้ลงล็อกจังหวะดนตรีอัตโนมัติ เร้าอารมณ์คนดู', uses:1310 },
  { name:'คาถาสีมายา',          cjk:'幻色秘訣', lvl:6, max:9, kind:'วิชาเสริม', xp:0.40,
    desc:'ปรับโทนสี/LUT ให้ภาพมีมนต์ขลัง คุมอารมณ์ทั้งคลิปด้วยสีเดียว', uses:705 },
  { name:'คาถาคำบรรยายอัตโนมัติ', cjk:'自動字訣', lvl:5, max:9, kind:'วิชาขั้นต้น', xp:0.30,
    desc:'ถอดเสียงเป็นซับไตเติลพร้อมจัดวางสวยงามทุกภาษา', uses:430 },
];

/* ---- คลังคัมภีร์/Memory (demo) ---- */
export const MEMORY = {
  longTerm:[
    { title:'คัมภีร์แบรนด์ "เซรั่มหยกขาว"', tag:'brand', age:'12 วัน', note:'โทนหรู มินิมอล ห้ามใช้คำเกินจริง เน้นผลลัพธ์ 28 วัน', strength:0.95 },
    { title:'ตำราผู้ชมสายความงาม', tag:'audience', age:'5 วัน', note:'หญิง 24–35 ชอบรีวิวจริง ก่อน-หลัง ดูคลิปจบ 0:15 แรกชี้ขาด', strength:0.88 },
    { title:'ม้วนสไตล์คลิปที่เวิร์ก', tag:'pattern', age:'2 วัน', note:'เปิดด้วยปัญหา 3 วิ → เผยสินค้า → before/after → CTA', strength:0.81 },
    { title:'บันทึกคำต้องห้าม', tag:'policy', age:'20 วัน', note:'เลี่ยงคำการแพทย์ "รักษา/หาย" ใช้ "ดูแล/ฟื้นบำรุง" แทน', strength:0.74 },
  ],
  shortTerm:[
    { t:'00:02', txt:'รับบทจากเรือนอักษร 6 ท่อน' },
    { t:'00:05', txt:'ดึงฟุตเทจสินค้า 14 คลิปจากคลัง' },
    { t:'00:09', txt:'เลือกจังหวะเพลง 128 BPM ให้ตรงคัมภีร์สไตล์' },
    { t:'now',   txt:'กำลังเรนเดอร์เวอร์ชัน 9:16 — 62%' },
  ],
};

/* ---- เส้นเวลาภารกิจ (Task page) ---- */
export const QUEST = {
  title:'ศึกเปิดตัว "เซรั่มหยกขาว"',
  cjk:'白玉戰役', code:'CMP-2048', started:'วันนี้ 09:12', eta:'13:40',
  steps:[
    { agent:'scout',  label:'ล่าเทรนด์ & คัดมุมขาย',  state:'done', t:'09:12–09:48', out:'3 มุมขายเด่น' },
    { agent:'scribe', label:'ร่างบท 6 ท่อน',           state:'done', t:'09:48–10:30', out:'สคริปต์ v2' },
    { agent:'smith',  label:'ตัดต่อ & เรนเดอร์',        state:'active', t:'10:30– …',  out:'9:16 · 62%' },
    { agent:'voice',  label:'พากย์เสียง & ดนตรี',       state:'queued', t:'รอ',         out:'—' },
    { agent:'herald', label:'เผยแพร่ 4 แพลตฟอร์ม',      state:'queued', t:'รอ',         out:'—' },
    { agent:'abacus', label:'วัดผล & สรุป ROI',          state:'queued', t:'รอ',         out:'—' },
  ],
};
