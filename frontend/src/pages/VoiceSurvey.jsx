import { useNavigate } from 'react-router-dom'

export default function VoiceSurvey() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(900px 520px at 100% -8%,rgba(45,212,160,0.07),transparent 60%),#F4F7F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>

      {/* Phone frame */}
      <div style={{ position: 'relative', overflow: 'hidden', width: 452, height: 912, borderRadius: 34, background: 'radial-gradient(620px 560px at 50% 44%,rgba(45,212,160,0.12),transparent 62%),#F4F7F9', border: '1px solid rgba(16,24,40,0.05)', boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 30px 60px -18px rgba(16,24,40,0.2)', padding: '26px 24px', display: 'flex', flexDirection: 'column' }}>

        {/* dot grid */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(16,24,40,0.04) 1px,transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(130% 100% at 50% 50%,#000,transparent 88%)', WebkitMaskImage: 'radial-gradient(130% 100% at 50% 50%,#000,transparent 88%)' }} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2.2"><path d="M15 6l-6 6 6 6"/></svg>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475467', fontVariantNumeric: 'tabular-nums' }}>Question 3 of 8</span>
            <span onClick={() => navigate('/home')} style={{ fontSize: 12.5, fontWeight: 700, color: '#98A2B3', cursor: 'pointer' }}>Exit</span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(16,24,40,0.07)', overflow: 'hidden', marginBottom: 30 }}>
            <div style={{ width: '37.5%', height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,rgba(45,212,160,0.5),#2DD4A0)', boxShadow: '0 0 12px rgba(45,212,160,0.5)' }} />
          </div>

          {/* Question card */}
          <div style={{ padding: 22, borderRadius: 20, background: '#fff', border: '1px solid rgba(16,24,40,0.05)', boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 12px 24px -4px rgba(16,24,40,0.1)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#0A8a63', marginBottom: 10 }}>Resilience AI asks</div>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.45, letterSpacing: '-0.015em', color: '#0A1628' }}>Over the past week, how easily were you able to bounce back after a stressful moment?</div>
          </div>

          {/* Orb */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* pulsing rings */}
              {[0, 1, 2].map(i => (
                <span key={i} style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', border: '1.5px solid rgba(45,212,160,0.5)', animation: `orbring 3s ease-out infinite ${i}s` }} />
              ))}
              {/* orb */}
              <div style={{ position: 'relative', width: 124, height: 124, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,rgba(45,212,160,0.95),rgba(45,212,160,0.55) 45%,#0d7a5a)', boxShadow: '0 0 60px rgba(45,212,160,0.5),inset 0 0 30px rgba(255,255,255,0.3)', animation: 'breathe 2.6s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* wave bars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 42 }}>
                  {[0, 0.15, 0.3, 0.45, 0.6].map((delay, i) => (
                    <div key={i} style={{ width: 4, background: 'rgba(6,53,42,0.75)', borderRadius: 2, animation: `wave 1s ease-in-out infinite ${delay}s`, height: '18%' }} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 30, fontSize: 14, fontWeight: 700, color: '#0A8a63' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2DD4A0', animation: 'onlinepulse 2s infinite', flexShrink: 0 }} />
              Listening…
            </div>
            <div style={{ fontSize: 12.5, color: '#667085', fontWeight: 500, marginTop: 8, textAlign: 'center', maxWidth: 260 }}>
              Speak naturally — I'll follow up if I need more detail.
            </div>
          </div>

          {/* Text fallback */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 7px 7px 16px', borderRadius: 15, background: '#fff', border: '1px solid rgba(16,24,40,0.08)', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
            <span style={{ flex: 1, fontSize: 13.5, color: '#98A2B3', fontWeight: 500 }}>Type your answer instead…</span>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: '#2DD4A0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px -4px rgba(45,212,160,0.5)', cursor: 'pointer' }} onClick={() => navigate('/home')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06352a" strokeWidth="2.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
