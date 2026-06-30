import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ChevronLeft, ChevronRight } from 'lucide-react'

function DiamondIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 1L13 7L7 13L1 7L7 1Z" fill="#2DD4A0" stroke="#2DD4A0" strokeWidth="0.5" strokeLinejoin="round" />
    </svg>
  )
}

const COHORT_BARS = [
  { label: 'CBT Program', value: '+8.2', progress: 82, color: '#2DD4A0' },
  { label: 'Mindfulness Group', value: '+3.1', progress: 55, color: '#0D9488' },
  { label: 'Self-Guided', value: '+1.8', progress: 32, color: '#94A3B8' },
]

export default function AIPanel({ collapsed, onToggle }) {
  const [input, setInput] = useState('')

  function handleSend() {
    if (!input.trim()) return
    setInput('')
  }

  return (
    <motion.div
      animate={{ width: collapsed ? 48 : 320 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative flex-shrink-0 flex flex-col overflow-hidden"
      style={{
        background: '#0A0E0D',
        borderLeft: '1px solid rgba(45,212,160,0.10)',
        height: 'calc(100vh - 56px)',
      }}
    >
      <AnimatePresence mode="wait">
        {collapsed ? (
          /* ── Collapsed strip ── */
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center py-4 gap-4 cursor-pointer h-full"
            onClick={onToggle}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <DiamondIcon size={16} />
            </div>
            <div
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.3)',
                userSelect: 'none',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              RESILIENCE AI
            </div>
            <div className="w-2 h-2 rounded-full bg-[#2DD4A0] mb-2" style={{ boxShadow: '0 0 6px #2DD4A0' }} />
          </motion.div>
        ) : (
          /* ── Expanded panel ── */
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex flex-col h-full w-[320px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0"
              style={{ background: '#0D1512' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(45,212,160,0.15)' }}>
                  <DiamondIcon size={12} />
                </div>
                <div>
                  <p className="text-white text-xs font-bold leading-tight">Resilience AI</p>
                  <p className="text-[10px] leading-tight" style={{ color: '#2DD4A0' }}>Online · analysing live data</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
              {/* Timestamp divider */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
                  TODAY · 09:14
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>

              {/* User message */}
              <div className="flex justify-end">
                <div
                  className="max-w-[220px] rounded-2xl rounded-tr-sm px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Which cohort shows the highest resilience improvement?
                  </p>
                </div>
              </div>

              {/* AI response */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-md flex items-center justify-center" style={{ background: 'rgba(45,212,160,0.15)' }}>
                    <DiamondIcon size={8} />
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: '#2DD4A0' }}>Resilience AI</span>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  CBT Program leads with the strongest gain this week. Here's the ranked breakdown:
                </p>

                <div
                  className="rounded-xl p-3 space-y-2.5"
                  style={{ background: 'rgba(45,212,160,0.05)', border: '1px solid rgba(45,212,160,0.10)' }}
                >
                  {COHORT_BARS.map(row => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                        <span className="text-[11px] font-bold" style={{ color: row.color }}>{row.value}</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${row.progress}%`, background: row.color, transition: 'width 0.6s ease' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  The CBT cohort's gain is driven mainly by improved sleep-quality and session-adherence scores following last week's protocol update.
                </p>

                {/* Suggestion chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Why is CBT improving?", "Show high-risk patients"].map(chip => (
                    <button
                      key={chip}
                      className="text-[10px] font-semibold px-2.5 py-1.5 rounded-full transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.45)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(45,212,160,0.4)'
                        e.currentTarget.style.color = '#2DD4A0'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="px-3 pb-3 pt-2 shrink-0 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(45,212,160,0.12)' }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your data..."
                  className="flex-1 text-xs bg-transparent outline-none border-0"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                />
                <button
                  onClick={handleSend}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={{ background: '#2DD4A0' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#5EEAC0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2DD4A0'}
                >
                  <Send size={10} style={{ color: '#06231B' }} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
