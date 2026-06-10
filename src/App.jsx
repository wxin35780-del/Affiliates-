import React, { useState, useEffect } from 'react';
import { Seal } from './ui';
import { loadAgents, saveAgents, resetAgents, loadCampaigns, saveCampaigns, resetCampaigns, makeCampaign } from './protoData';
import { STATUS } from './data';
import { RosterView } from './Roster';
import { ProfileView } from './Profile';
import { DashboardView, TaskView } from './Dashboard';
import { AddAgentModal, AssignTaskModal, NewCampaignModal } from './Modals';
import { useWindowWidth } from './hooks';

/* ====== Desktop sidebar nav item ====== */
function NavItem({ icon, label, cjk, active, onClick }) {
  return (
    <div className="nav-item" onClick={onClick} style={{ display:'flex', alignItems:'center', gap:13, padding:'12px 16px',
      borderRadius:8, cursor:'pointer', position:'relative',
      background: active?'linear-gradient(100deg,rgba(200,162,74,.16),transparent)':'transparent',
      color: active?'var(--gold-hi)':'var(--tx-dim)' }}>
      {active && <span style={{ position:'absolute', left:0, top:10, bottom:10, width:3, borderRadius:9, background:'var(--gold)' }}></span>}
      <span className="jh-cjk" style={{ fontSize:20, width:24, textAlign:'center', color: active?'var(--gold)':'var(--tx-faint)' }}>{icon}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14.5, fontWeight: active?600:500 }}>{label}</div>
      </div>
      <span className="jh-cjk" style={{ fontSize:12, opacity:.45 }}>{cjk}</span>
    </div>
  );
}

/* ====== Mobile bottom tab bar ====== */
function MobileTabBar({ view, go }) {
  const tabs = [
    { icon:'群', label:'ทำเนียบ', name:'roster' },
    { icon:'帥', label:'บัญชาการ', name:'dashboard' },
    { icon:'令', label:'ภารกิจ', name:'task' },
  ];
  const active = tabs.find(t => t.name === view.name || (view.name === 'profile' && t.name === 'roster'));
  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:50,
      background:'linear-gradient(0deg,#13100a,#1a1510)',
      borderTop:'1px solid var(--ink-line)',
      display:'flex', height:64,
      paddingBottom:'env(safe-area-inset-bottom, 0px)' }}>
      {tabs.map(t=>{
        const isActive = active?.name === t.name;
        return (
          <button key={t.name} onClick={()=>go(t.name)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:3, background:'transparent', border:'none', cursor:'pointer',
            color: isActive?'var(--gold-hi)':'var(--tx-faint)', transition:'color .15s' }}>
            <span className="jh-cjk" style={{ fontSize:22, lineHeight:1, color: isActive?'var(--gold)':'var(--tx-faint)' }}>{t.icon}</span>
            <span style={{ fontSize:10.5, fontFamily:'var(--font-body)', letterSpacing:'.02em', fontWeight: isActive?600:400 }}>{t.label}</span>
            {isActive && <span style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
              width:32, height:2, borderRadius:9, background:'var(--gold)' }}></span>}
          </button>
        );
      })}
    </nav>
  );
}

/* ====== Mobile header ====== */
function MobileHeader({ view, agents, onBack }) {
  const titles = {
    roster: { th:'ทำเนียบยุทธจักร', cjk:'群俠錄' },
    dashboard: { th:'ศาลบัญชาการ', cjk:'帥府' },
    task: { th:'ภารกิจ & ศึก', cjk:'令' },
    profile: { th:'สำนวนประจำตัว', cjk:'英雄' },
  };
  const t = titles[view.name] || titles.roster;
  return (
    <div style={{ position:'sticky', top:0, zIndex:40, display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
      background:'linear-gradient(180deg,#171109,#13100a)', borderBottom:'1px solid var(--ink-line)',
      minHeight:54 }}>
      {view.name === 'profile' && (
        <button onClick={onBack} style={{ background:'transparent', border:'none', color:'var(--tx-dim)', cursor:'pointer', padding:'4px 8px 4px 0', fontSize:18, lineHeight:1 }}>←</button>
      )}
      {view.name !== 'profile' && <Seal text="俠" size={30} />}
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <span className="jh-disp" style={{ fontSize:17, fontWeight:700, color:'var(--gold-hi)' }}>{t.th}</span>
          <span className="jh-cjk" style={{ fontSize:13, color:'var(--gold)', opacity:.65 }}>{t.cjk}</span>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ fontSize:11, color:'var(--tx-faint)', fontFamily:'var(--font-mono)' }}>
          {agents.filter(a=>a.status==='active').length} <span style={{ color:'var(--st-active)' }}>●</span>
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [agents, setAgents] = useState(()=> loadAgents());
  const [view, setView] = useState({ name:'roster', agentId:null });
  const [tab, setTab] = useState('overview');
  const [selId, setSelId] = useState(()=> (loadAgents()[0]||{}).id);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [campaignModal, setCampaignModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [toast, setToast] = useState(null);

  const width = useWindowWidth();
  const isMobile = width < 768;

  useEffect(()=>{ saveAgents(agents); }, [agents]);

  // Load campaigns from server on mount
  useEffect(() => {
    fetch('/api/campaigns')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCampaigns(data); })
      .catch(() => setCampaigns(loadCampaigns())); // fallback to localStorage
  }, []);
  useEffect(()=>{ if(toast){ const t=setTimeout(()=>setToast(null), 2600); return ()=>clearTimeout(t); } }, [toast]);

  // Close modals on Escape
  useEffect(() => {
    const h = (e) => {
      if (e.key !== 'Escape') return;
      if (campaignModal) { setCampaignModal(false); return; }
      if (modal) { setModal(false); return; }
      if (editing) { setEditing(null); return; }
      if (assigning) { setAssigning(null); return; }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [modal, editing, assigning]);

  const openProfile = (id)=>{
    setView({ name:'profile', agentId:id }); setTab('overview');
    document.querySelector('.jh-main')?.scrollTo(0,0);
  };
  const go = (name)=>{
    setView({ name, agentId:null });
    document.querySelector('.jh-main')?.scrollTo(0,0);
  };
  const addAgent = (a)=>{ setAgents(prev=>[...prev, a]); setSelId(a.id); setModal(false); setToast(`เรียก "${a.alias}" เข้าสังกัดแล้ว`); go('roster'); };
  const saveAgent = (a)=>{ setAgents(prev=>prev.map(x=>x.id===a.id?a:x)); setEditing(null); setToast(`บันทึกประวัติ "${a.alias}" แล้ว`); };
  const deleteAgent = (id)=>{ const left = agents.filter(x=>x.id!==id); setAgents(left); setEditing(null); if(selId===id) setSelId((left[0]||{}).id); setToast('ปลดจอมยุทธออกจากสังกัดแล้ว'); go('roster'); };
  const assignAgent = (a)=>{ setAgents(prev=>prev.map(x=>x.id===a.id?a:x)); setAssigning(null); setToast(`ส่งบัญชา "${a.alias}" · ${STATUS[a.status].th} แล้ว`); };
  const syncCampaign = async (updated) => {
    setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
    await fetch(`/api/campaigns/${updated.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const addCampaign = async (form) => {
    const c = makeCampaign(form, agents);
    setCampaigns(prev => [c, ...prev]);
    setCampaignModal(false);
    setToast(`เปิดศึก "${c.title}" แล้ว`);
    go('task');
    await fetch('/api/campaigns', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c),
    }).catch(() => {});
  };

  const advanceStep = (campaignId, fullOutput = null) => {
    const camp = campaigns.find(c => c.id === campaignId);
    const activeIdx = camp?.steps.findIndex(s => s.state === 'active') ?? -1;
    const activeStep = camp?.steps[activeIdx];
    const nextStep = camp?.steps[activeIdx + 1];
    const steps = camp.steps.map((s, i) => {
      if (i === activeIdx) return { ...s, state: 'done', ...(fullOutput ? { fullOutput } : {}) };
      if (i === activeIdx + 1) return { ...s, state: 'active' };
      return s;
    });
    const allDone = steps.every(s => s.state === 'done');
    const updated = { ...camp, steps, status: allDone ? 'done' : 'active' };
    syncCampaign(updated);
    if (activeStep) setToast(nextStep ? `✓ "${activeStep.label}" เสร็จแล้ว → ${nextStep.label}` : `⚔ ศึก "${camp.title}" สำเร็จ!`);
  };

  const rerunStep = (campaignId, stepIdx) => {
    const camp = campaigns.find(c => c.id === campaignId);
    const steps = camp.steps.map((s, i) => {
      if (i === stepIdx) return { ...s, state: 'active', fullOutput: null };
      if (i > stepIdx) return { ...s, state: 'queued' };
      return s;
    });
    const updated = { ...camp, steps, status: 'active' };
    syncCampaign(updated);
    setToast('รีเซ็ตด่านเพื่อรันใหม่แล้ว');
  };
  const reset = ()=>{ const base = resetAgents(); const camps = resetCampaigns(); setAgents(base); setCampaigns(camps); setSelId(base[0].id); setToast('คืนค่าทำเนียบเป็นค่าตั้งต้นแล้ว'); go('roster'); };

  const cur = agents.find(a=>a.id===view.agentId);
  const activeN = agents.filter(a=>a.status==='active').length;

  const mainContent = (
    <>
      {view.name==='roster' && <RosterView agents={agents} selId={selId} setSelId={setSelId} onOpen={openProfile} onAdd={()=>setModal(true)} onNewCampaign={()=>setCampaignModal(true)} isMobile={isMobile} />}
      {view.name==='dashboard' && <DashboardView agents={agents} onOpen={openProfile} onAssign={(a)=>setAssigning(a)} campaigns={campaigns} onNewCampaign={()=>setCampaignModal(true)} isMobile={isMobile} />}
      {view.name==='task' && <TaskView agents={agents} onOpen={openProfile} campaigns={campaigns} onNewCampaign={()=>setCampaignModal(true)} onAdvanceStep={advanceStep} onRerunStep={rerunStep} isMobile={isMobile} />}
      {view.name==='profile' && cur && <ProfileView agent={cur} tab={tab} setTab={setTab} onBack={()=>go('roster')} onEdit={(a)=>setEditing(a)} onAssign={(a)=>setAssigning(a)} isMobile={isMobile} />}
      {view.name==='profile' && !cur && <div style={{ padding:60, color:'var(--tx-faint)' }}>ไม่พบจอมยุทธผู้นี้</div>}
    </>
  );

  return (
    <div className="jh jh-ink" style={{ display:'flex', height:'100dvh', overflow:'hidden' }}>

      {/* ─── Desktop sidebar ─── */}
      {!isMobile && (
        <aside style={{ width:230, flex:'0 0 auto', display:'flex', flexDirection:'column',
          background:'linear-gradient(180deg,#171109,#0e0b07)', borderRight:'1px solid var(--ink-line)' }}>
          <div style={{ padding:'22px 20px 18px', borderBottom:'1px solid var(--ink-line)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Seal text="俠" size={42} />
              <div>
                <div className="jh-disp" style={{ fontSize:18, fontWeight:700, color:'var(--gold-hi)', lineHeight:1.1 }}>ยุทธจักร OS</div>
                <div className="jh-cjk" style={{ fontSize:12, color:'var(--gold)', opacity:.6, letterSpacing:'.15em' }}>江湖 · 督軍府</div>
              </div>
            </div>
          </div>
          <nav style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:6 }}>
            <div className="jh-tag" style={{ padding:'4px 14px 8px' }}>เมนูหลัก · 主菜單</div>
            <NavItem icon="群" label="ทำเนียบจอมยุทธ" cjk="錄" active={view.name==='roster'||view.name==='profile'} onClick={()=>go('roster')} />
            <NavItem icon="帥" label="ศาลบัญชาการ" cjk="府" active={view.name==='dashboard'} onClick={()=>go('dashboard')} />
            <NavItem icon="令" label="ภารกิจ & ศึก" cjk="戰" active={view.name==='task'} onClick={()=>go('task')} />
          </nav>
          <div style={{ marginTop:'auto', padding:'16px 18px', borderTop:'1px solid var(--ink-line)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12, color:'var(--tx-faint)' }}>
              <span>จอมยุทธในสังกัด</span><span style={{ fontFamily:'var(--font-mono)', color:'var(--gold)' }}>{agents.length}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12, color:'var(--tx-faint)', marginTop:6 }}>
              <span>กำลังออกศึก</span><span style={{ fontFamily:'var(--font-mono)', color:'var(--st-active)' }}>{activeN}</span>
            </div>
            <button onClick={reset} style={{ marginTop:14, width:'100%', fontSize:11.5, color:'var(--tx-faint)', background:'transparent',
              border:'1px solid var(--ink-line)', borderRadius:6, padding:'7px', cursor:'pointer', fontFamily:'var(--font-body)' }}>
              ↺ คืนค่าทำเนียบตั้งต้น
            </button>
          </div>
        </aside>
      )}

      {/* ─── Main content ─── */}
      <main className="jh-main" style={{ flex:1, overflow:'auto', minWidth:0,
        paddingBottom: isMobile ? 64 : 0 }}>
        {isMobile && (
          <MobileHeader view={view} agents={agents} onBack={()=>go('roster')} />
        )}
        {mainContent}
      </main>

      {/* ─── Mobile bottom nav ─── */}
      {isMobile && <MobileTabBar view={view} go={go} />}

      {/* ─── Modals ─── */}
      {campaignModal && <NewCampaignModal agents={agents} onClose={()=>setCampaignModal(false)} onCreate={addCampaign} />}
      {modal && <AddAgentModal onClose={()=>setModal(false)} onCreate={addAgent} />}
      {editing && <AddAgentModal initial={editing} onClose={()=>setEditing(null)} onSave={saveAgent} onDelete={deleteAgent} />}
      {assigning && <AssignTaskModal agent={assigning} onClose={()=>setAssigning(null)} onAssign={assignAgent} />}

      {/* ─── Toast ─── */}
      {toast && (
        <div style={{ position:'fixed', bottom: isMobile?76:24, left:'50%', transform:'translateX(-50%)', zIndex:200,
          background:'linear-gradient(180deg,#2a2013,#1a130a)', border:'1px solid var(--gold-deep)', borderRadius:8,
          padding:'12px 20px', color:'var(--gold-hi)', fontSize:13.5, boxShadow:'0 12px 40px rgba(0,0,0,.5)',
          display:'flex', alignItems:'center', gap:10, whiteSpace:'nowrap',
          animation:'toastIn .25s ease' }}>
          <span className="jh-cjk" style={{ color:'var(--gold)' }}>令</span> {toast}
          <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
        </div>
      )}
    </div>
  );
}
