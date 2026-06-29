import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, ChevronRight, Clock, Sparkles, BarChart3, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar'
import InsightBanner from '../components/layout/InsightBanner'

const SURVEYS = [
  {
    id: 1,
    status: 'new',
    type: 'Weekly Check-in',
    name: 'Resilience & Coping Skills',
    daysLeft: 5,
    cta: 'Start Survey',
  },
  {
    id: 2,
    status: 'retake',
    type: 'Monthly Assessment',
    name: 'Emotional Wellbeing Index',
    daysLeft: 2,
    cta: 'Retake Now',
  },
  {
    id: 3,
    status: 'expired',
    type: 'Baseline Survey',
    name: 'PHQ-9 Depression Screen',
    daysLeft: 0,
    cta: 'View Results',
  },
]

const STATUS_CONFIG = {
  new: {
    label: 'New',
    bg: 'bg-mint-light',
    text: 'text-mint-dark',
    Icon: Sparkles,
  },
  retake: {
    label: 'Retake',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    Icon: BarChart3,
  },
  expired: {
    label: 'Expired',
    bg: 'bg-red-50',
    text: 'text-red-400',
    Icon: XCircle,
  },
}

function SurveyCard({ survey, index, onStart }) {
  const { label, bg, text, Icon } = STATUS_CONFIG[survey.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.09, duration: 0.35 }}
      className="card-hover p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${bg} ${text}`}>
          <Icon className="w-3 h-3" />
          {label}
        </span>
        {survey.status !== 'expired' && survey.daysLeft > 0 && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {survey.daysLeft}d left
          </span>
        )}
      </div>

      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{survey.type}</p>
        <h3 className="text-[15px] font-semibold text-ink leading-snug">{survey.name}</h3>
      </div>

      <button
        onClick={() => survey.status !== 'expired' && onStart()}
        disabled={survey.status === 'expired'}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
          survey.status === 'expired'
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'btn-primary'
        }`}
      >
        {survey.cta}
      </button>
    </motion.div>
  )
}

export default function UserHome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-soft">
      <Topbar variant="user" userName="Priya S." />

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-ink tracking-tight">Good morning, Priya</h1>
            <span className="px-2.5 py-0.5 bg-ink text-mint text-xs font-semibold rounded-full tracking-wide">
              Unit B · Ward 4
            </span>
          </div>
          <p className="text-sm text-slate-400">Here's your wellbeing overview for today.</p>
        </motion.div>

        {/* Insight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <InsightBanner>
            Your resilience scores improved{' '}
            <span className="text-mint-mid font-bold">+14%</span> over the last 3 weeks.
            Keep building those coping strategies — you're on a great trajectory.
          </InsightBanner>
        </motion.div>

        {/* Survey Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-ink">Your Surveys</h2>
            <span className="text-xs text-slate-400">
              {SURVEYS.filter(s => s.status !== 'expired').length} active
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SURVEYS.map((survey, i) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                index={i}
                onStart={() => navigate('/survey/voice')}
              />
            ))}
          </div>
        </div>

        {/* Copilot Entry Banner */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          onClick={() => navigate('/survey/voice')}
          className="w-full bg-ink rounded-2xl p-5 flex items-center gap-4 group hover:bg-ink/90 transition-all text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-white/10 group-hover:bg-mint/20 flex items-center justify-center transition-colors flex-shrink-0">
            <Zap className="w-5 h-5 text-mint" fill="#2DD4A0" strokeWidth={0} />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-[15px] mb-0.5">Talk to your AI Copilot</p>
            <p className="text-white/50 text-xs">Voice-guided check-in, anywhere, anytime</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-mint group-hover:translate-x-1 transition-all flex-shrink-0" />
        </motion.button>
      </main>
    </div>
  )
}
