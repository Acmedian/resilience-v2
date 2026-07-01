import { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../lib/api'

export default function AIPanel({ collapsed, onToggle, token }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [asking, setAsking] = useState(false)

  async function ask(question) {
    if (!question.trim() || asking) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setAsking(true)
    try {
      const data = await api.post('/api/admin/stats', { question }, token)
      setMessages(prev => [...prev, { role: 'ai', text: data?.answer || 'Sorry, I could not find an answer to that.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong reaching the assistant. Please try again.' }])
    } finally {
      setAsking(false)
    }
  }

  function handleSend() {
    ask(input)
  }

  /* ── Collapsed rail — dark, 56px wide ── */
  if (collapsed) {
    return (
      <motion.div
        key="collapsed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, width: 56 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        onClick={onToggle}
        title="Expand AI assistant"
        style={{ width: 56, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0', borderRadius: 22, color: '#fff', cursor: 'pointer', background: 'radial-gradient(120% 60% at 50% 0%,rgba(45,212,160,0.22),transparent 55%),#0A1628', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 1px 2px rgba(10,22,40,0.18),0 16px 32px -8px rgba(10,22,40,0.42)', transition: 'transform .25s cubic-bezier(.4,0,.2,1),box-shadow .25s cubic-bezier(.4,0,.2,1)' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(10,22,40,0.22),0 26px 48px -12px rgba(10,22,40,0.55)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 2px rgba(10,22,40,0.18),0 16px 32px -8px rgba(10,22,40,0.42)' }}
      >
        {/* chevron button at top */}
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s ease' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M15 6l-6 6 6 6"/></svg>
        </div>

        {/* diamond icon */}
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 18, boxShadow: '0 4px 10px -2px rgba(10,22,40,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: 11, height: 11, background: '#2DD4A0', transform: 'rotate(45deg)', borderRadius: 2 }} />
        </div>

        {/* vertical label */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '18px 0' }}>
          <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Resilience AI</span>
        </div>

        {/* online dot */}
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2DD4A0', animation: 'onlinepulse 2.4s infinite' }} />
      </motion.div>
    )
  }

  /* ── Expanded panel — white, 362px wide ── */
  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, width: 362 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: 362, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRadius: 22, overflow: 'hidden', background: '#fff', border: '1px solid rgba(16,24,40,0.05)', boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 16px 32px -6px rgba(16,24,40,0.12)' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid rgba(16,24,40,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px -2px rgba(10,22,40,0.4)' }}>
            <div style={{ width: 11, height: 11, background: '#2DD4A0', transform: 'rotate(45deg)', borderRadius: 2 }} />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, letterSpacing: '-0.01em', color: '#0A1628' }}>Resilience AI</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#667085', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DD4A0', animation: 'onlinepulse 2.4s infinite', flexShrink: 0 }}/>Online · analysing live data
            </div>
          </div>
        </div>
        <button
          onClick={onToggle}
          title="Collapse"
          style={{ width: 30, height: 30, flexShrink: 0, border: 'none', borderRadius: 9, background: 'rgba(16,24,40,0.05)', color: '#667085', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,24,40,0.1)'; e.currentTarget.style.color = '#0A1628' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,24,40,0.05)'; e.currentTarget.style.color = '#667085' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, background: 'linear-gradient(180deg,rgba(16,24,40,0.015),transparent 120px)', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', fontSize: 10.5, fontWeight: 600, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today · 09:14</div>

        {/* user bubble */}
        <div style={{ alignSelf: 'flex-end', maxWidth: '84%', background: '#0A1628', color: '#fff', padding: '12px 15px', borderRadius: '16px 16px 5px 16px', fontSize: 13, lineHeight: 1.5, fontWeight: 500, boxShadow: '0 6px 14px -4px rgba(10,22,40,0.35)' }}>
          Which cohort shows the highest resilience improvement?
        </div>

        {/* AI response */}
        <div style={{ alignSelf: 'flex-start', maxWidth: '90%', display: 'flex', gap: 9 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <div style={{ width: 8, height: 8, background: '#2DD4A0', transform: 'rotate(45deg)', borderRadius: 1 }}/>
          </div>
          <div style={{ background: 'rgba(16,24,40,0.045)', padding: '13px 15px', borderRadius: '16px 16px 16px 5px', fontSize: 13, lineHeight: 1.55, color: '#0A1628' }}>
            <span style={{ fontWeight: 500 }}><b style={{ fontWeight: 800, color: '#0A8a63' }}>CBT Program</b> leads with the strongest gain this week. Here's the ranked breakdown:</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 13 }}>
              {[
                { label: 'CBT', pct: '100%', val: '+8.2' },
                { label: 'Mindfulness', pct: '38%', val: '+3.1' },
                { label: 'Self-guided', pct: '22%', val: '+1.8' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 64, fontSize: 11.5, fontWeight: 700, flexShrink: 0, color: '#0A1628' }}>{row.label}</span>
                  <div style={{ flex: 1, height: 7, borderRadius: 4, background: 'rgba(16,24,40,0.06)', overflow: 'hidden' }}>
                    <div style={{ width: row.pct, height: '100%', borderRadius: 4, background: '#2DD4A0' }}/>
                  </div>
                  <span style={{ width: 36, textAlign: 'right', fontSize: 12, fontWeight: 800, color: '#0A8a63', fontVariantNumeric: 'tabular-nums' }}>{row.val}</span>
                </div>
              ))}
            </div>
            <span style={{ display: 'block', marginTop: 13, fontSize: 12, color: '#667085', fontWeight: 500, lineHeight: 1.5 }}>
              The CBT cohort's gain is driven mainly by improved sleep-quality and session-adherence scores following last week's protocol update.
            </span>
          </div>
        </div>

        {/* suggestion chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 2, paddingLeft: 35 }}>
          {['How many high risk patients?', 'Which cohort is leading?', 'What is our participation rate?'].map(chip => (
            <span key={chip}
              onClick={() => ask(chip)}
              style={{ fontSize: 11.5, fontWeight: 600, color: '#475467', background: '#fff', border: '1px solid rgba(16,24,40,0.1)', padding: '6px 11px', borderRadius: 20, cursor: 'pointer', transition: 'border-color .15s,color .15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2DD4A0'; e.currentTarget.style.color = '#0A8a63' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,24,40,0.1)'; e.currentTarget.style.color = '#475467' }}
            >{chip}</span>
          ))}
        </div>

        {/* live Q&A */}
        {messages.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
            {messages.map((m, i) => m.role === 'user' ? (
              <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '84%', background: '#0A1628', color: '#fff', padding: '12px 15px', borderRadius: '16px 16px 5px 16px', fontSize: 13, lineHeight: 1.5, fontWeight: 500, boxShadow: '0 6px 14px -4px rgba(10,22,40,0.35)' }}>
                {m.text}
              </div>
            ) : (
              <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '90%', display: 'flex', gap: 9 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <div style={{ width: 8, height: 8, background: '#2DD4A0', transform: 'rotate(45deg)', borderRadius: 1 }}/>
                </div>
                <div style={{ background: 'rgba(16,24,40,0.045)', padding: '13px 15px', borderRadius: '16px 16px 16px 5px', fontSize: 13, lineHeight: 1.55, color: '#0A1628' }}>
                  {m.text}
                </div>
              </div>
            ))}
            {asking && (
              <div style={{ alignSelf: 'flex-start', fontSize: 12, color: '#98A2B3', fontWeight: 600, paddingLeft: 35 }}>Thinking…</div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(16,24,40,0.06)', background: 'rgba(250,251,252,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid rgba(16,24,40,0.1)', borderRadius: 14, padding: '7px 7px 7px 15px', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your data…"
            style={{ flex: 1, fontSize: 13, color: input ? '#0A1628' : '#98A2B3', fontWeight: 500, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'inherit' }}
          />
          <button
            onClick={handleSend}
            style={{ position: 'relative', width: 36, height: 36, flexShrink: 0, border: 'none', borderRadius: 10, background: '#0A1628', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'box-shadow .25s ease', boxShadow: '0 4px 10px -3px rgba(10,22,40,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 16px -4px rgba(10,22,40,0.5)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 10px -3px rgba(10,22,40,0.4)'}
          >
            {/* pulsing ring */}
            <span style={{ position: 'absolute', inset: 0, borderRadius: 10, border: '2px solid #2DD4A0', animation: 'pulsering 2.2s cubic-bezier(.4,0,.2,1) infinite', pointerEvents: 'none' }}/>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2DD4A0" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
