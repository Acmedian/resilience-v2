import { useState } from 'react'

const TONES = ['Empathetic', 'Clinical', 'Casual']

const QUESTIONS_DATA = [
  { num: 1, text: 'Over the past two weeks, how rested did you feel when you woke up in the morning?', tags: ['Likert 1–5', 'Sleep'] },
  { num: 2, text: 'When you felt stressed during the day, how often did it trace back to poor sleep the night before?', tags: ['Likert 1–5', 'Stress link'] },
  { num: 3, text: 'How confident did you feel using a coping strategy to wind down before bed?', tags: ['Likert 1–5', 'Coping'] },
]

export default function AdminQuestions() {
  const [tone, setTone] = useState('Empathetic')
  const [count, setCount] = useState(6)
  const [approved, setApproved] = useState(new Set())
  const [rejected, setRejected] = useState(new Set())

  function approve(num) { setApproved(s => new Set([...s, num])); setRejected(s => { const n = new Set(s); n.delete(num); return n }) }
  function reject(num) { setRejected(s => new Set([...s, num])); setApproved(s => { const n = new Set(s); n.delete(num); return n }) }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(900px 520px at 100% -8%,rgba(45,212,160,0.07),transparent 60%),#F4F7F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', maxWidth: 1280, height: 840, borderRadius: 26, background: 'radial-gradient(760px 460px at 100% -6%,rgba(45,212,160,0.10),transparent 55%),#0A1628', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 1px 2px rgba(16,24,40,0.1),0 40px 72px -20px rgba(16,24,40,0.45)', display: 'flex', flexDirection: 'column', color: '#fff' }}>

        {/* Header */}
        <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.025em' }}>New Screening</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginTop: 2 }}>Describe what you want to measure — AI drafts the questions</div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#2DD4A0', background: 'rgba(45,212,160,0.12)', border: '1px solid rgba(45,212,160,0.22)', padding: '7px 13px', borderRadius: 9 }}>
            <div style={{ width: 7, height: 7, background: '#2DD4A0', transform: 'rotate(45deg)', borderRadius: 1, flexShrink: 0 }} />AI-assisted
          </div>
        </div>

        {/* Two columns */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: 0 }}>

          {/* Config panel */}
          <div style={{ padding: 24, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 9 }}>What should this screening measure?</label>
              <div style={{ height: 128, padding: 14, borderRadius: 13, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13.5, lineHeight: 1.55, color: 'rgba(255,255,255,0.85)' }}>
                Assess sleep quality and its impact on daytime stress for patients in the CBT program over the past two weeks.
                <span style={{ display: 'inline-block', width: 8, height: 15, background: '#2DD4A0', borderRadius: 1, verticalAlign: -2, marginLeft: 1, animation: 'recblink 1s infinite' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 9 }}>Question type</label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44, padding: '0 14px', borderRadius: 12, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, fontWeight: 600, color: '#fff' }}>
                  Likert scale
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 9 }}>Count</label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44, padding: '0 6px 0 14px', borderRadius: 12, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div onClick={() => setCount(c => Math.min(c + 1, 20))} style={{ width: 26, height: 16, borderRadius: 5, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3"><path d="M18 15l-6-6-6 6"/></svg>
                    </div>
                    <div onClick={() => setCount(c => Math.max(c - 1, 1))} style={{ width: 26, height: 16, borderRadius: 5, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 9 }}>Tone</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {TONES.map(t => (
                  <span key={t} onClick={() => setTone(t)}
                    style={{ fontSize: 12.5, fontWeight: tone === t ? 700 : 600, color: tone === t ? '#06352a' : 'rgba(255,255,255,0.6)', background: tone === t ? '#2DD4A0' : 'rgba(255,255,255,0.05)', border: tone === t ? 'none' : '1px solid rgba(255,255,255,0.08)', padding: '8px 14px', borderRadius: 9, cursor: 'pointer', transition: 'all .15s' }}
                  >{t}</span>
                ))}
              </div>
            </div>

            <button style={{ marginTop: 'auto', height: 50, border: 'none', borderRadius: 13, background: '#2DD4A0', color: '#06352a', fontSize: 14.5, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, boxShadow: '0 10px 26px -8px rgba(45,212,160,0.7)' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#06352a" strokeWidth="2.4"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
              Generate questions
            </button>
          </div>

          {/* Generated questions */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, background: 'rgba(255,255,255,0.015)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 12px' }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.01em' }}>
                Generated questions <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>· {count} drafts</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#2DD4A0', cursor: 'pointer' }}>Approve all</span>
            </div>

            <div style={{ flex: 1, overflow: 'hidden', padding: '6px 24px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {QUESTIONS_DATA.map(q => {
                const isApproved = approved.has(q.num)
                const isRejected = rejected.has(q.num)
                return (
                  <div key={q.num} style={{ padding: '16px 18px', borderRadius: 15, background: 'rgba(255,255,255,0.04)', border: `1px solid ${isApproved ? 'rgba(45,212,160,0.3)' : isRejected ? 'rgba(240,68,56,0.25)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', gap: 14, alignItems: 'flex-start', opacity: isRejected ? 0.5 : 1, transition: 'all .2s' }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(45,212,160,0.14)', color: '#2DD4A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{q.num}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: 'rgba(255,255,255,0.92)' }}>{q.text}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9 }}>
                        {q.tags.map(tag => (
                          <span key={tag} style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 6 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                      <div onClick={() => approve(q.num)} style={{ width: 32, height: 32, borderRadius: 9, background: isApproved ? 'rgba(45,212,160,0.24)' : 'rgba(45,212,160,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .15s' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2DD4A0" strokeWidth="2.6"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                      <div onClick={() => reject(q.num)} style={{ width: 32, height: 32, borderRadius: 9, background: isRejected ? 'rgba(240,68,56,0.14)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .15s' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isRejected ? '#FF6B5E' : 'rgba(255,255,255,0.6)'} strokeWidth="2.4"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>+ {count - 3} more questions below</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
