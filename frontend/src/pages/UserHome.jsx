import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, ChevronRight, Clock, Sparkles, BarChart3, CheckCircle, Bell, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SCREENINGS = [
  {
    id: 1,
    status: 'new',
    type: 'Weekly Check-in',
    name: 'Resilience & Coping Skills',
    daysLeft: 5,
    cta: 'Start Screening',
  },
  {
    id: 2,
    status: 'due',
    type: 'Monthly Assessment',
    name: 'Emotional Wellbeing Index',
    daysLeft: 2,
    cta: 'Complete Now',
  },
  {
    id: 3,
    status: 'done',
    type: 'Baseline Screening',
    name: 'PHQ-9 Depression Screen',
    daysLeft: 0,
    cta: 'View Results',
  },
]

const STATUS_CONFIG = {
  new: {
    pill: 'status-pill-new',
    label: 'New',
    Icon: Sparkles,
    iconColor: '#2DD4A0',
  },
  due: {
    pill: 'status-pill-due',
    label: 'Due Soon',
    Icon: BarChart3,
    iconColor: '#F0B429',
  },
  done: {
    pill: 'status-pill-done',
    label: 'Completed',
    Icon: CheckCircle,
    iconColor: 'rgba(255,255,255,0.3)',
  },
}

function ScreeningCard({ screening, index, onStart }) {
  const { pill, label, Icon, iconColor } = STATUS_CONFIG[screening.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.09, duration: 0.35 }}
      className="glass-card p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <span className={pill}>{label}</span>
        {screening.status !== 'done' && screening.daysLeft > 0 && (
          <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Clock className="w-3 h-3" />
            {screening.daysLeft}d left
          </span>
        )}
      </div>

      <div>
        <p className="label-eyebrow mb-1">{screening.type}</p>
        <h3 className="text-[15px] font-semibold text-white leading-snug">{screening.name}</h3>
      </div>

      <button
        onClick={() => screening.status !== 'done' && onStart()}
        disabled={screening.status === 'done'}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
          screening.status === 'done'
            ? 'cursor-default'
            : 'btn-mint'
        }`}
        style={screening.status === 'done' ? { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)' } : {}}
      >
        {screening.cta}
      </button>
    </motion.div>
  )
}

export default function UserHome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ background: '#0B0F0E' }}>
      {/* Topbar */}
      <header className="topbar-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: '#0F1715', border: '1px solid rgba(45,212,160,0.2)' }}
            >
              <Zap className="w-4 h-4 text-mint" fill="#2DD4A0" strokeWidth={0} />
            </div>
            <span className="font-bold text-white text-sm">Resilience</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center relative transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            >
              <Bell className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-mint" />
            </button>
            <div
              className="flex items-center gap-2 px-2 py-1 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(45,212,160,0.15)' }}
              >
                <User className="w-3.5 h-3.5" style={{ color: '#2DD4A0' }} />
              </div>
              <span className="text-sm font-medium text-white">Priya S.</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-white tracking-tight">Good morning, Priya</h1>
            <span
              className="px-2.5 py-0.5 text-xs font-semibold rounded-full tracking-wide"
              style={{ background: 'rgba(45,212,160,0.12)', color: '#2DD4A0', border: '1px solid rgba(45,212,160,0.2)' }}
            >
              CBT Program
            </span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Here's your wellbeing overview for today.
          </p>
        </motion.div>

        {/* Insight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="insight-glow"
        >
          <p className="text-sm text-white leading-relaxed">
            Your resilience scores improved{' '}
            <span className="font-bold" style={{ color: '#2DD4A0' }}>+14%</span>{' '}
            over the last 3 weeks. Keep building those coping strategies — you're on a great trajectory.
          </p>
        </motion.div>

        {/* Screening Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-white">Your Screenings</h2>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {SCREENINGS.filter(s => s.status !== 'done').length} active
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SCREENINGS.map((screening, i) => (
              <ScreeningCard
                key={screening.id}
                screening={screening}
                index={i}
                onStart={() => navigate('/survey/1/voice')}
              />
            ))}
          </div>
        </div>

        {/* AI Copilot CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          onClick={() => navigate('/survey/1/voice')}
          className="w-full glass-card p-5 flex items-center gap-4 group text-left"
          style={{ background: '#0F1715' }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: 'rgba(45,212,160,0.10)' }}
          >
            <Zap className="w-5 h-5 text-mint" fill="#2DD4A0" strokeWidth={0} />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-[15px] mb-0.5">Talk to your AI Copilot</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Voice-guided check-in, anywhere, anytime
            </p>
          </div>
          <ChevronRight
            className="w-5 h-5 flex-shrink-0 transition-all group-hover:translate-x-1"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          />
        </motion.button>
      </main>
    </div>
  )
}
