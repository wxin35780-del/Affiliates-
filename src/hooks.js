import { useState, useEffect, useRef } from 'react';

export function useWindowWidth() {
  const [w, setW] = useState(() => window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
}

const LOG_TEMPLATES = [
  (a) => `[${a.sect}] ส่งรายงานสถานะ — กำลังดำเนินการ`,
  (a) => `[${a.sect}] เรียกใช้ความเชี่ยวชาญ: ${(a.expertise||[])[0]||'วิชาประจำตัว'}`,
  (a) => `[${a.sect}] ตรวจสอบคุณภาพผลลัพธ์ผ่าน`,
  (a) => `[${a.sect}] ส่งข้อมูลให้สำนักถัดไป`,
  (a) => `[${a.sect}] อัปเดตคลังคัมภีร์เฉพาะกิจ`,
  (a) => `[${a.sect}] ประมวลผลรอบที่ ${Math.floor(Math.random()*8+2)}`,
];

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
}

export function useLiveData(agents) {
  const initialProgress = { marshal:0.4, scout:0.78, scribe:0.55, smith:0.62 };
  const [progress, setProgress] = useState(initialProgress);
  const [feed, setFeed] = useState([
    { t:'10:31', who:'จิตรกรเงามายา', txt:'เริ่มเรนเดอร์คลิป 9:16 เวอร์ชัน A', c:'var(--st-active)' },
    { t:'10:30', who:'พู่กันสะท้านใจ', txt:'ส่งบท v2 ให้หอภาพมายา', c:'var(--gold)' },
    { t:'10:18', who:'เซียนลูกคิดเหล็ก', txt:'เข้าสู่สถานะพักฟื้น — โหลดประมวลผลสูง', c:'var(--cinnabar-hi)' },
    { t:'09:48', who:'ตาเหยี่ยวพันลี้', txt:'พบ 3 มุมขายเด่นหมวดความงาม', c:'var(--st-active)' },
    { t:'09:12', who:'พญาอินทรีบัญชาทัพ', txt:'เปิดศึก "เซรั่มหยกขาว" มอบหมาย 6 สำนัก', c:'var(--cinnabar-hi)' },
  ]);
  const tickRef = useRef(0);
  const agentKey = agents.filter(a=>a.status==='active').map(a=>a.id).join(',');

  useEffect(() => {
    const active = agents.filter(a => a.status === 'active');
    if (!active.length) return;

    const interval = setInterval(() => {
      tickRef.current++;

      setProgress(prev => {
        const next = { ...prev };
        active.forEach(a => {
          const cur = next[a.id] !== undefined ? next[a.id] : 0.3;
          const bump = Math.random() * 0.018 + 0.004;
          next[a.id] = Math.min(0.98, cur + bump);
        });
        return next;
      });

      if (tickRef.current % 2 === 0) {
        const a = active[Math.floor(Math.random() * active.length)];
        const tpl = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
        const entry = { t: nowTime(), who: a.alias, txt: tpl(a), c: a.accent };
        setFeed(prev => [entry, ...prev.slice(0, 14)]);
      }
    }, 2800);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentKey]);

  return { progress, feed };
}
