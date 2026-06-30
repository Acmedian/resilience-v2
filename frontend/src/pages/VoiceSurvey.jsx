import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ArrowRight, Send, AlignLeft, Mic } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOrbAnimation } from '../hooks/useOrbAnimation'

const QUESTIONS = [
  'On a scale of 1–10, how would you rate your overall mood over the past week?',
  'Have you been able to get adequate sleep most nights this week?',
  'How confident do you feel in handling daily challenges right now?',
]

const ORB_INNER_R = 42
const ORB_RING_RADII = [60, 80, 100]

function VoiceOrb({ state }) {
  const rings = useOrbAnimation(state)

  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      <svg width={220} height={220} viewBox="0 0 220 220">
        {/* Outer rings */}
        {ORB_RING_RADII.map((r, i) => (
          <circle
            key={i}
            cx={110}
            cy={110}
            r={r * (rings[i]?.scale ?? 1)}
            fill="none"
            stroke="#2DD4A0"
            strokeWidth={1.5 - i * 0.4}
            opacity={rings[i]?.opacity ?? 0.3}
            style={{ transition: 'r 0.04s linear, opacity 0.04s linear' }}
          />
        ))}
        {/* Filled inner circle */}
        <circle
          cx={110}
          cy={110}
          r={ORB_INNER_R}
          fill={state === 'speaking' ? '#2DD4A0' : '#1BB88A'}
          opacity={1}
        />
        {/* Mic icon area */}
        <g transform="translate(93,93)">
          <Mic
            x={0} y={0}
            width={34}
            height={34}
            color={state === 'speaking' ? '#0A1628' : '#E6F9F4'}
            strokeWidth={2}
          />
        </g>
      </svg>

      {/* Glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: state === 'speaking'
            ? 'radial-gradient(circle at 50%, rgba(45,212,160,0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50%, rgba(45,212,160,0.10) 0%, transparent 70%)',
          transition: 'background 0.5s ease',
        }}
      />
    </div>
  )
}

export default function VoiceSurvey() {
  const navigate = useNavigate()
  const [qIndex, setQIndex] = useState(0)
  const [orbState, setOrbState] = useState('speaking')
  const [textInput, setTextInput] = useState('')
  const progress = ((qIndex + 1) / QUESTIONS.length) * 100

  // Toggle orb state every 5 seconds for demo
  useEffect(() => {
    const id = setInterval(() => {
      setOrbState(s => s === 'speaking' ? 'listening' : 'speaking')
    }, 5000)
    return () => clearInterval(id)
  }, [])

  function nextQuestion() {
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(i => i + 1)
    } else {
      navigate('/home')
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A1628' }}>
      {/* Topbar */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-mint" fill="#2DD4A0" strokeWidth={0} />
          </div>
          <span className="font-bold text-white text-sm">Resilience</span>
        </div>

        <div className="flex-1 mx-4">
          <p className="text-xs text-white/40 mb-1 font-medium">Weekly Screening · Q{qIndex + 1}/{QUESTIONS.length}</p>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-mint"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </div>
        </div>

        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/15 hover:border-white/30 rounded-xl px-3 py-1.5 transition-all"
        >
          <AlignLeft className="w-3.5 h-3.5" />
          Switch to text
        </button>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8">
        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-mint animate-blink" />
              <span className="text-xs font-semibold text-mint uppercase tracking-wider">Speaking now</span>
            </div>
            <p className="text-white text-lg font-medium leading-relaxed">
              {QUESTIONS[qIndex]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Orb */}
        <VoiceOrb state={orbState} />

        {/* Status */}
        <motion.p
          key={orbState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm italic text-white/40"
        >
          {orbState === 'speaking' ? 'AI is asking…' : 'Listening to your response…'}
        </motion.p>

        {/* Text input + Send */}
        <div className="w-full max-w-lg flex gap-2">
          <input
            type="text"
            placeholder="Or type your answer here…"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && nextQuestion()}
            className="flex-1 bg-transparent border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-mint/60 transition-colors"
          />
          <button
            onClick={nextQuestion}
            className="w-10 h-10 rounded-xl bg-mint hover:bg-mint-mid transition-colors flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-4 h-4 text-ink" />
          </button>
        </div>
      </div>
    </div>
  )
}
