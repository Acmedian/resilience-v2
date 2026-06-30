import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, TrendingUp, AlertTriangle } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import AIPanel from '../components/dashboard/AIPanel'

/* ── Inline sparkline SVG ─────────────────────────────────────────────── */
function Sparkline({ data = [], height = 40 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 240
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = height - ((v - min) / range) * (height - 4)
    return `${x},${y}`
  })
  const areaPath = `M${pts[0]} L${pts.join(' L')} L${w},${height} L0,${height} Z`
  const linePath = `M${pts.join(' L')}`

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2DD4A0" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2DD4A0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sg)" />
      <path d={linePath} fill="none" stroke="#2DD4A0" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Circular progress ring ───────────────────────────────────────────── */
function RingProgress({ pct = 91, size = 60 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const filled = (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#2DD4A0" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${filled} ${circ - filled}`}
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
    </svg>
  )
}

/* ── Cohort row component ─────────────────────────────────────────────── */
function CohortRow({ initials, cohort, patients, score, trend, pct, thresholdPct, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex items-center gap-4"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black"
        style={{ background: 'rgba(45,212,160,0.10)', color: '#2DD4A0' }}
      >
        {initials}
      </div>
      <div className="w-36 shrink-0">
        <p className="text-[13px] font-semibold text-white">{cohort}</p>
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{patients} patients</p>
      </div>
      <div className="flex-1 relative">
        {/* Track */}
        <div className="h-2 rounded-full overflow-visible relative" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {/* Fill bar */}
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, rgba(45,212,160,0.5) 0%, #2DD4A0 100%)' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: delay + 0.2, duration: 0.7, ease: 'easeOut' }}
          />
          {/* Threshold marker */}
          <div
            className="absolute top-[-4px] bottom-[-4px] w-px"
            style={{ left: `${thresholdPct}%`, background: 'rgba(240,180,41,0.5)', borderLeft: '1px dashed rgba(240,180,41,0.5)' }}
          />
        </div>
      </div>
      <div className="w-12 text-right shrink-0">
        <span className="text-[18px] font-black text-white">{score}</span>
      </div>
      <div className="w-28 text-right shrink-0">
        <span className="text-[11px] font-bold" style={{ color: '#2DD4A0' }}>▲ {trend} vs last wk</span>
      </div>
    </motion.div>
  )
}

const WEEK_SPARKLINE = [63, 65, 69, 72, 70, 74, 73]
const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SCREENINGS_SPARKLINE = [1600, 1680, 1720, 1750, 1790, 1820, 1847]

const COHORTS = [
  { initials: 'CB', cohort: 'CBT Program', patients: 98, score: 79.6, trend: '8.2', pct: 80 },
  { initials: 'MG', cohort: 'Mindfulness Group', patients: 84, score: 73.1, trend: '3.1', pct: 73 },
  { initials: 'SG', cohort: 'Self-Guided', patients: 66, score: 68.4, trend: '1.8', pct: 68 },
]

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' },
  }),
}

const TIME_PERIODS = ['Week', 'Month', 'Quarter']

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [aiCollapsed, setAiCollapsed] = useState(false)
  const [period, setPeriod] = useState('Week')

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0B0F0E' }}>
      <Topbar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* Page header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[28px] font-black text-white leading-tight tracking-tight">Analytics Overview</h1>
                <span className="pill-live">
                  <span className="pill-live-dot" />
                  Live
                </span>
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Patient resilience monitoring · Clearwater Clinic · Updated 2m ago
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Period switcher */}
              <div
                className="flex items-center rounded-xl p-1 gap-0.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {TIME_PERIODS.map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: period === p ? 'rgba(45,212,160,0.12)' : 'transparent',
                      color: period === p ? '#2DD4A0' : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button className="btn-ghost-dark flex items-center gap-1.5 text-xs">
                <Download size={12} />
                Export
              </button>
            </div>
          </div>

          {/*
           * Stat Cards Grid — 4 columns
           * Row 1: [A: col-span-2, glow-br] [B: glow-bl] [C: glow-br]
           * Row 2: [D: col-span-2, glow-tr] [E: col-span-2, glow-tl]
           * The four corner glows of A/B (bottom) and D/E (top) overlap at the
           * row boundary to form one continuous ambient ring at the grid centre.
           */}
          <div className="grid grid-cols-4 gap-4">

            {/* Card A — Avg Resilience Score (col-span-2) */}
            <motion.div
              className="glass-card glow-br col-span-2 p-6 flex flex-col gap-4"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={0}
            >
              <div className="flex items-start justify-between">
                <span className="label-eyebrow">Avg Resilience Score</span>
                <span
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(45,212,160,0.12)', color: '#2DD4A0' }}
                >
                  <TrendingUp size={10} />
                  +2.3
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="stat-hero-num">73.4</span>
                <span className="text-xl font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>/100</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Practice-wide composite across 9 resilience dimensions, up from 71.1 last week
              </p>
              <div>
                <Sparkline data={WEEK_SPARKLINE} height={48} />
                <div className="flex justify-between mt-1">
                  {WEEK_LABELS.map(d => (
                    <span key={d} style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>{d}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card B — Active Patients */}
            <motion.div
              className="glass-card glow-bl p-5 flex flex-col gap-3"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={1}
            >
              <span className="label-eyebrow">Active Patients</span>
              <span className="stat-mid-num">248</span>
              <div className="flex gap-3 mt-auto">
                <div>
                  <p className="text-[11px] font-bold text-white">12 new</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>this week</p>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.07)' }} />
                <div>
                  <p className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>34 inactive</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>no activity</p>
                </div>
              </div>
            </motion.div>

            {/* Card C — Screenings Completed */}
            <motion.div
              className="glass-card glow-br p-5 flex flex-col gap-3"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={2}
            >
              <span className="label-eyebrow">Screenings Completed</span>
              <span className="stat-mid-num">1,847</span>
              <div className="mt-auto">
                <Sparkline data={SCREENINGS_SPARKLINE} height={32} />
              </div>
            </motion.div>

            {/* Card D — High Risk Flags */}
            <motion.div
              className="glass-card glow-tr col-span-2 p-5 flex flex-col gap-3"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={3}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={12} style={{ color: '#E5534B' }} />
                <span className="label-eyebrow">High Risk Flags</span>
              </div>
              <span className="stat-mid-num" style={{ color: '#E5534B' }}>14</span>
              <p className="text-xs font-semibold" style={{ color: '#E5534B' }}>
                3 critical — needs review
              </p>
            </motion.div>

            {/* Card E — Screening Participation */}
            <motion.div
              className="glass-card glow-tl col-span-2 p-5 flex flex-col gap-3"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={4}
            >
              <span className="label-eyebrow">Screening Participation</span>
              <div className="flex items-center gap-4">
                <span className="stat-mid-num">91.2%</span>
                <RingProgress pct={91} size={56} />
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>226 of 248 patients responded</p>
            </motion.div>
          </div>

          {/* Cohort breakdown */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.35 }}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-[15px] font-bold text-white mb-1">Resilience by Cohort</h2>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  This week's composite by care program, measured against the healthy threshold
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#2DD4A0' }} />
                  <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>This week</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-px border-t border-dashed" style={{ borderColor: 'rgba(240,180,41,0.6)' }} />
                  <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Healthy ≥ 75</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {COHORTS.map((c, i) => (
                <CohortRow
                  key={c.cohort}
                  {...c}
                  thresholdPct={75}
                  delay={0.5 + i * 0.1}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Panel — collapsible, docked right */}
        <AIPanel collapsed={aiCollapsed} onToggle={() => setAiCollapsed(v => !v)} />
      </div>
    </div>
  )
}
