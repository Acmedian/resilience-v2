import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, TrendingUp, AlertTriangle } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import AIPanel from '../components/dashboard/AIPanel'

/* ── Sparkline SVG ───────────────────────────────────────────────────────── */
function Sparkline({ data = [], height = 48, id = 'spark' }) {
  if (data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const W = 300
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = height - 4 - ((v - min) / range) * (height - 8)
    return [x, y]
  })
  const linePath = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const areaPath = `${linePath} L${W},${height} L0,${height} Z`
  const gid = `sg-${id}`
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2DD4A0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2DD4A0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gid})`} />
      <path d={linePath} fill="none" stroke="#2DD4A0" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

/* ── Circular progress ring ───────────────────────────────────────────────── */
function RingProgress({ pct = 91, size = 72 }) {
  const strokeW = 7
  const r = (size - strokeW) / 2
  const circ = 2 * Math.PI * r
  const filled = (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeW} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#2DD4A0" strokeWidth={strokeW} strokeLinecap="round"
        strokeDasharray={`${filled} ${circ - filled}`}
      />
    </svg>
  )
}

/* ── Cohort bar row ──────────────────────────────────────────────────────── */
/* Bar track represents scores 50–90. Threshold dashed line at 75. */
const SCALE_MIN = 50
const SCALE_MAX = 90
function toTrackPct(score) { return ((score - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100 }

function CohortRow({ number, initials, cohort, patients, score, trend, isLeading, delay }) {
  const barPct = toTrackPct(score)
  const thresholdPct = toTrackPct(75)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex items-center gap-4"
    >
      {/* Numbered avatar badge */}
      <div className="relative shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black"
          style={{ background: 'rgba(45,212,160,0.12)', color: '#2DD4A0', border: '1px solid rgba(45,212,160,0.2)' }}
        >
          {initials}
        </div>
        <div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
          style={{ background: '#1A2E28', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {number}
        </div>
      </div>

      {/* Name */}
      <div className="w-40 shrink-0">
        <p className="text-[13px] font-semibold text-white leading-tight">{cohort}</p>
        <div className="flex items-center gap-1 mt-0.5">
          {isLeading && (
            <>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2DD4A0', flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: '#2DD4A0', fontWeight: 800, letterSpacing: '0.04em' }}>LEADING</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>·</span>
            </>
          )}
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{patients} patients</span>
        </div>
      </div>

      {/* Track */}
      <div className="flex-1 relative">
        <div
          className="h-2 rounded-full overflow-visible relative"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(45,212,160,0.25) 0%, rgba(45,212,160,0.65) 55%, #2DD4A0 100%)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${barPct}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
          />
          {/* Healthy threshold dashed line */}
          <div
            className="absolute top-[-5px] bottom-[-5px]"
            style={{
              left: `${thresholdPct}%`,
              width: 1,
              background: 'rgba(255,255,255,0.22)',
              borderLeft: '1px dashed rgba(255,255,255,0.22)',
            }}
          />
        </div>
      </div>

      {/* Score */}
      <div className="w-14 text-right shrink-0">
        <span className="text-[20px] font-black text-white leading-none">{score}</span>
      </div>

      {/* Trend */}
      <div className="w-24 text-right shrink-0">
        <p className="text-[11px] font-bold" style={{ color: '#2DD4A0' }}>▲ {trend}</p>
        <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>vs last wk</p>
      </div>
    </motion.div>
  )
}

/* ── Scale axis below cohort bars ────────────────────────────────────────── */
function CohortAxis() {
  const ticks = [50, 60, 70, 75, 80, 90]
  return (
    <div className="flex items-center gap-4">
      {/* Placeholder spacers matching CohortRow layout */}
      <div className="w-9 shrink-0" />
      <div className="w-40 shrink-0" />
      <div className="flex-1 relative h-4">
        {ticks.map(v => (
          <span
            key={v}
            className="absolute"
            style={{
              left: `${toTrackPct(v)}%`,
              transform: 'translateX(-50%)',
              fontSize: 9,
              color: 'rgba(255,255,255,0.22)',
              fontWeight: 600,
              userSelect: 'none',
            }}
          >
            {v}
          </span>
        ))}
      </div>
      <div className="w-14 shrink-0" />
      <div className="w-24 shrink-0" />
    </div>
  )
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const WEEK_SPARKLINE = [63, 65, 69, 71, 70, 73, 73]
const WEEK_LABELS = ['Mon', 'Wed', 'Fri', 'Sun']
const SCREENINGS_SPARKLINE = [1650, 1680, 1710, 1740, 1780, 1820, 1847]

const COHORTS = [
  { number: 1, initials: 'CB', cohort: 'CBT Program',       patients: 82,  score: 78.6, trend: '8.2', isLeading: true  },
  { number: 2, initials: 'MG', cohort: 'Mindfulness Group', patients: 64,  score: 74.1, trend: '3.1', isLeading: false },
  { number: 3, initials: 'SG', cohort: 'Self-Guided',       patients: 102, score: 71.2, trend: '1.8', isLeading: false },
]

const cardAnim = {
  initial: { opacity: 0, y: 20 },
  animate: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' } }),
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
        {/* ── Main scroll area ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* Page header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">Analytics Overview</h1>
                <span className="pill-live">
                  <span className="pill-live-dot" />
                  Live
                </span>
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Patient resilience monitoring · Northside Practice · Updated 6m ago
              </p>
            </div>

            {/* Period + Export controls */}
            <div className="flex items-center gap-1">
              {TIME_PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all"
                  style={{
                    background: period === p ? '#111827' : 'transparent',
                    color: period === p ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all"
                style={{ background: '#111827', color: '#FFFFFF' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1F2937'}
                onMouseLeave={e => e.currentTarget.style.background = '#111827'}
              >
                <Download size={13} />
                Export
              </button>
            </div>
          </div>

          {/*
           * Stat grid — 3 columns, Card A row-span-2 (tall left card)
           *
           * [A: col1, rows 1+2]  [B: col2, row1]  [C: col3, row1]
           * [A: col1, rows 1+2]  [D: col2, row2]  [E: col3, row2]
           *
           * Glow pairing: A's glow-br meets B's glow-bl and D's glow-tl at the
           * col1/2 × row1/2 intersection forming one ambient ring at centre-left.
           * C's glow-bl and E's glow-tl form a second ring at col2/3 × row1/2.
           */}
          <div className="grid grid-cols-3 gap-4">

            {/* ── Card A — Avg Resilience Score (tall, row-span-2) ── */}
            <motion.div
              className="glass-card glow-br row-span-2 p-6 flex flex-col gap-4"
              variants={cardAnim} initial="initial" animate="animate" custom={0}
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
                Practice-wide composite across 9 resilience dimensions, up from 71.1 last week.
              </p>

              {/* Sparkline grows to fill remaining space */}
              <div className="flex-1 flex flex-col justify-end">
                <Sparkline data={WEEK_SPARKLINE} height={80} id="resil" />
                <div className="flex justify-between mt-1 px-0.5">
                  {WEEK_LABELS.map(d => (
                    <span key={d} style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>{d}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Card B — Active Patients ── */}
            <motion.div
              className="glass-card glow-bl p-5 flex flex-col gap-3"
              variants={cardAnim} initial="initial" animate="animate" custom={1}
            >
              <span className="label-eyebrow">Active Patients</span>
              <span className="stat-mid-num">248</span>

              {/* Inline sub-stats with colored dots */}
              <div className="flex items-center gap-3 mt-auto">
                <span className="flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#2DD4A0' }} />
                  <span className="font-semibold text-white">12 new</span>
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>·</span>
                <span className="flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.25)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>34 inactive</span>
                </span>
              </div>
            </motion.div>

            {/* ── Card C — Screenings Completed ── */}
            <motion.div
              className="glass-card glow-bl p-5 flex flex-col gap-3"
              variants={cardAnim} initial="initial" animate="animate" custom={2}
            >
              <span className="label-eyebrow">Screenings Completed</span>
              <span className="stat-mid-num">1,847</span>
              <div className="mt-auto">
                <Sparkline data={SCREENINGS_SPARKLINE} height={44} id="screen" />
              </div>
            </motion.div>

            {/* ── Card D — High Risk Flags ── */}
            <motion.div
              className="glass-card glow-tl p-5 flex flex-col gap-3"
              variants={cardAnim} initial="initial" animate="animate" custom={3}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={12} style={{ color: '#E5534B' }} />
                <span className="label-eyebrow">High Risk Flags</span>
              </div>
              <span className="stat-mid-num" style={{ color: '#E5534B' }}>14</span>
              <p className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#E5534B' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#E5534B' }} />
                3 critical — needs review
              </p>
            </motion.div>

            {/* ── Card E — Screening Participation ── */}
            <motion.div
              className="glass-card glow-tl p-5 flex flex-col gap-3"
              variants={cardAnim} initial="initial" animate="animate" custom={4}
            >
              <span className="label-eyebrow">Survey Participation</span>
              <div className="flex items-center gap-4">
                <span className="stat-mid-num">91.2<span className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>%</span></span>
                <RingProgress pct={91} size={72} />
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>226 of 248 responded</p>
            </motion.div>
          </div>

          {/* ── Resilience by Cohort ── */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.35 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-[15px] font-bold text-white mb-1">Resilience by Cohort</h2>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  This week's composite by care program, measured against the healthy threshold
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#2DD4A0' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>This week</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 14, borderTop: '1px dashed rgba(255,255,255,0.3)' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>Healthy ≥ 75</span>
                </div>
              </div>
            </div>

            {/* Cohort rows */}
            <div className="space-y-4">
              {COHORTS.map((c, i) => (
                <CohortRow key={c.cohort} {...c} delay={0.5 + i * 0.1} />
              ))}
            </div>

            {/* Numeric axis */}
            <div className="mt-2">
              <CohortAxis />
            </div>
          </motion.div>
        </div>

        {/* ── AI Panel — collapsible, docked right ── */}
        <AIPanel collapsed={aiCollapsed} onToggle={() => setAiCollapsed(v => !v)} />
      </div>
    </div>
  )
}
