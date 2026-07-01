import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TRANSCRIPT = [
  { speaker: 'Dr. Reed', color: '#0A8a63', time: '00:12', isClinician: true,
    text: 'How have things been since we adjusted your sleep routine last week?' },
  { speaker: 'Patient', color: '#667085', time: '00:21', isClinician: false,
    text: "Honestly a lot better. I'm falling asleep faster, and I only woke up once or twice this week instead of every night." },
  { speaker: 'Dr. Reed', color: '#0A8a63', time: '00:39', isClinician: true,
    text: "That's great progress. And how about your stress levels during the workday?" },
  { speaker: 'Patient', color: '#667085', time: '00:48', isClinician: false,
    text: 'Still tough around deadlines, but the breathing exercise actually helps me reset', cursor: true },
]

const INDICATORS = [
  { label: 'Sleep quality',       value: 'Improved ▲', color: '#0A8a63' },
  { label: 'Daytime stress',      value: 'Moderate',   color: '#DC6803' },
  { label: 'Coping strategy use', value: 'Consistent', color: '#0A8a63' },
]

export default function MedicalScribe() {
  const navigate = useNavigate()
  const [timer] = useState('12:47')

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(900px 520px at 100% -8%,rgba(45,212,160,0.07),transparent 60%),#F4F7F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', maxWidth: 1280, height: 840, borderRadius: 26, background: 'radial-gradient(760px 460px at 100% -6%,rgba(45,212,160,0.06),transparent 55%),#F4F7F9', border: '1px solid rgba(16,24,40,0.05)', boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 30px 60px -18px rgba(16,24,40,0.2)', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 26px', borderBottom: '1px solid rgba(16,24,40,0.06)', background: 'rgba(255,255,255,0.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Recording badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '8px 14px', borderRadius: 11, background: 'rgba(240,68,56,0.1)', border: '1px solid rgba(240,68,56,0.22)' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#F04438', animation: 'recblink 1.4s infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#D92D20', letterSpacing: '0.02em' }}>Recording</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#D92D20', fontVariantNumeric: 'tabular-nums' }}>{timer}</span>
            </div>
            {/* Session meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 12.5, fontWeight: 500, color: '#667085' }}>
              <span><span style={{ color: '#98A2B3' }}>Patient</span> &nbsp;<b style={{ color: '#0A1628', fontWeight: 700 }}>Sarah Mitchell</b></span>
              <span style={{ width: 1, height: 14, background: 'rgba(16,24,40,0.12)', flexShrink: 0 }} />
              <span><span style={{ color: '#98A2B3' }}>Clinician</span> &nbsp;<b style={{ color: '#0A1628', fontWeight: 700 }}>Dr. Alan Reed</b></span>
              <span style={{ width: 1, height: 14, background: 'rgba(16,24,40,0.12)', flexShrink: 0 }} />
              <span><span style={{ color: '#98A2B3' }}>Session</span> &nbsp;<b style={{ color: '#0A1628', fontWeight: 700 }}>Jul 1, 2026 · Follow-up</b></span>
            </div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 16px', borderRadius: 11, background: 'rgba(240,68,56,0.1)', color: '#D92D20', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', border: '1px solid rgba(240,68,56,0.25)' }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: '#D92D20', flexShrink: 0 }} />Stop &amp; save
          </button>
        </div>

        {/* Two columns */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 0 }}>

          {/* Transcript */}
          <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(16,24,40,0.06)', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px 12px' }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.01em', color: '#0A1628' }}>Live Transcript</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: '#0A8a63' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DD4A0', animation: 'onlinepulse 2s infinite', flexShrink: 0 }} />Transcribing
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', padding: '6px 24px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {TRANSCRIPT.map((t, i) => (
                <div key={i} style={{ maxWidth: '90%', alignSelf: t.isClinician ? 'flex-start' : 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, justifyContent: t.isClinician ? 'flex-start' : 'flex-end' }}>
                    {!t.isClinician && <span style={{ fontSize: 10.5, color: '#98A2B3', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{t.time}</span>}
                    <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: t.color }}>{t.speaker}</span>
                    {t.isClinician && <span style={{ fontSize: 10.5, color: '#98A2B3', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{t.time}</span>}
                  </div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#1f2937', background: t.isClinician ? 'rgba(45,212,160,0.1)' : '#fff', border: t.isClinician ? '1px solid rgba(45,212,160,0.2)' : '1px solid rgba(16,24,40,0.08)', padding: '11px 14px', borderRadius: t.isClinician ? '4px 14px 14px 14px' : '14px 4px 14px 14px', boxShadow: t.isClinician ? 'none' : '0 1px 2px rgba(16,24,40,0.04)' }}>
                    {t.text}
                    {t.cursor && <span style={{ display: 'inline-block', width: 8, height: 15, background: '#2DD4A0', borderRadius: 1, verticalAlign: -2, marginLeft: 3, animation: 'recblink 1s infinite' }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, background: 'rgba(255,255,255,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 8, height: 8, background: '#2DD4A0', transform: 'rotate(45deg)', borderRadius: 1 }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.01em', color: '#0A1628' }}>AI-Generated Summary</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#98A2B3' }}>Updating live</span>
            </div>

            <div style={{ flex: 1, overflow: 'hidden', padding: '6px 24px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Chief concern */}
              <div style={{ padding: '14px 16px', borderRadius: 14, background: '#fff', border: '1px solid rgba(16,24,40,0.05)', boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 8px 18px -6px rgba(16,24,40,0.1)' }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#98A2B3', marginBottom: 7 }}>Chief concern</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.5, color: '#1f2937' }}>Follow-up on sleep disturbance and work-related stress management.</div>
              </div>
              {/* Resilience indicators */}
              <div style={{ padding: '14px 16px', borderRadius: 14, background: '#fff', border: '1px solid rgba(16,24,40,0.05)', boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 8px 18px -6px rgba(16,24,40,0.1)' }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#98A2B3', marginBottom: 9 }}>Resilience indicators</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {INDICATORS.map(ind => (
                    <div key={ind.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 12.5, color: '#344054', flex: 1 }}>{ind.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: ind.color, fontVariantNumeric: 'tabular-nums' }}>{ind.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Suggested plan */}
              <div style={{ padding: '14px 16px', borderRadius: 14, background: '#fff', border: '1px solid rgba(16,24,40,0.05)', boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 8px 18px -6px rgba(16,24,40,0.1)' }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#98A2B3', marginBottom: 7 }}>Suggested plan</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#1f2937' }}>Continue current sleep protocol. Reinforce breathing exercise as primary deadline-stress tool. Reassess in 2 weeks.</div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, padding: '16px 24px', borderTop: '1px solid rgba(16,24,40,0.06)' }}>
              <button style={{ flex: 1, height: 44, border: 'none', borderRadius: 12, background: '#2DD4A0', color: '#06352a', fontSize: 13.5, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 20px -6px rgba(45,212,160,0.5)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06352a" strokeWidth="2.6"><path d="M20 6L9 17l-5-5"/></svg>
                Approve &amp; save to record
              </button>
              <button style={{ width: 110, height: 44, border: '1px solid rgba(16,24,40,0.12)', borderRadius: 12, background: '#fff', color: '#344054', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
