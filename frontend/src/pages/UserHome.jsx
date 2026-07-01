import { useNavigate } from 'react-router-dom'

export default function UserHome() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(900px 520px at 100% -8%,rgba(45,212,160,0.07),transparent 60%),#F4F7F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>

      {/* Phone frame — dark #0A1628 */}
      <div style={{ position: 'relative', overflow: 'hidden', width: 452, height: 912, borderRadius: 34, background: 'radial-gradient(560px 420px at 100% -6%,rgba(45,212,160,0.13),transparent 55%),radial-gradient(520px 460px at -10% 108%,rgba(45,212,160,0.06),transparent 55%),#0A1628', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 1px 2px rgba(16,24,40,0.1),0 40px 72px -20px rgba(16,24,40,0.45)', padding: '26px 22px' }}>

        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(130% 90% at 50% 18%,#000,transparent 92%)', WebkitMaskImage: 'radial-gradient(130% 90% at 50% 18%,#000,transparent 92%)' }} />

        <div style={{ position: 'relative', color: '#fff' }}>

          {/* header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Good morning,</div>
              <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: '-0.025em', marginTop: 2 }}>Sarah</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 9, fontSize: 11, fontWeight: 700, color: '#2DD4A0', background: 'rgba(45,212,160,0.13)', border: '1px solid rgba(45,212,160,0.22)', padding: '4px 10px', borderRadius: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DD4A0' }} />CBT Program
              </div>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#1d3a5f,#050d18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>SM</div>
          </div>

          {/* insight banner */}
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, padding: 20, marginBottom: 22, background: 'repeating-radial-gradient(circle at 100% 0%,rgba(45,212,160,0.06) 0 1.5px,transparent 1.5px 22px),radial-gradient(70% 110% at 100% 0%,rgba(45,212,160,0.34),transparent 58%),#0d1d33', border: '1px solid rgba(45,212,160,0.2)', boxShadow: '0 16px 34px -12px rgba(0,0,0,0.55)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#2DD4A0', marginBottom: 10 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
              This week's insight
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.45, letterSpacing: '-0.01em' }}>Your resilience score is up <span style={{ color: '#2DD4A0', fontWeight: 800 }}>+4 points</span>. Your sleep consistency is driving the gain — keep it up.</div>
          </div>

          {/* screenings */}
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>Your screenings</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 22 }}>

            <div onClick={() => navigate('/survey/1/voice')} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, background: 'rgba(45,212,160,0.08)', border: '1px solid rgba(45,212,160,0.25)', boxShadow: '0 1px 2px rgba(0,0,0,0.2),0 12px 26px -10px rgba(45,212,160,0.35)', cursor: 'pointer' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(45,212,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2DD4A0" strokeWidth="2.4"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em' }}>Weekly Resilience Check</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginTop: 2 }}>8 questions · ~4 min</div>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#06352a', background: '#2DD4A0', padding: '8px 15px', borderRadius: 10, boxShadow: '0 6px 14px -4px rgba(45,212,160,0.6)' }}>Start</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 1px 2px rgba(0,0,0,0.2),0 12px 26px -10px rgba(0,0,0,0.5)', cursor: 'pointer' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(245,181,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5B544" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em' }}>Sleep &amp; Mood Journal</div>
                <div style={{ fontSize: 12, color: '#F5B544', fontWeight: 600, marginTop: 2 }}>Due in 2 days</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.4"><path d="M9 6l6 6-6 6"/></svg>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 1px 2px rgba(0,0,0,0.15),0 10px 22px -10px rgba(0,0,0,0.45)', cursor: 'pointer', opacity: 0.82 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2DD4A0" strokeWidth="2.6"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.85)' }}>Anxiety Baseline (GAD-7)</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', fontWeight: 500, marginTop: 2 }}>Completed Mon · Score 6</div>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>View</span>
            </div>
          </div>

          {/* AI copilot CTA */}
          <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 1px 2px rgba(0,0,0,0.2),0 14px 30px -12px rgba(0,0,0,0.55)', cursor: 'pointer' }}>
            <div style={{ position: 'relative', width: 46, height: 46, flexShrink: 0, borderRadius: 13, background: '#050d18', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(45,212,160,0.3)', boxShadow: '0 0 20px rgba(45,212,160,0.4)' }}>
              <div style={{ width: 15, height: 15, background: '#2DD4A0', transform: 'rotate(45deg)', borderRadius: 2 }} />
              <span style={{ position: 'absolute', inset: 0, borderRadius: 13, border: '2px solid #2DD4A0', animation: 'pulsering 2.4s cubic-bezier(.4,0,.2,1) infinite' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: '-0.01em' }}>Talk to your AI Copilot</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginTop: 2 }}>Ask anything about your progress</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: '#2DD4A0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px -4px rgba(45,212,160,0.6)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06352a" strokeWidth="2.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
