import { motion } from 'framer-motion'
import InsightBanner from '../components/layout/InsightBanner'
import StatCard from '../components/dashboard/StatCard'
import AIPanel from '../components/dashboard/AIPanel'
import SparkLineCard from '../components/dashboard/SparkLineCard'
import ParticipantRow from '../components/dashboard/ParticipantRow'
import ResultsTable from '../components/dashboard/ResultsTable'
import {
  MOCK_STATS,
  MOCK_PARTICIPANTS,
  MOCK_RESULTS,
  MOCK_SPARKLINES,
  MOCK_AI_MESSAGES,
} from '../constants'

const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
}

export default function AdminDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 p-5 min-h-[calc(100vh-56px)] bg-surface"
    >
      {/* Left column */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <InsightBanner>
          <strong>14 participants</strong> showed resilience improvement above 15% this week
          — highest since March.
        </InsightBanner>

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink leading-tight">Overview</h1>
            <p className="text-sm text-slate-400 mt-0.5">Sunday, June 29, 2026</p>
          </div>
        </div>

        {/* 2x2 Stat cards with stagger */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-3"
        >
          {MOCK_STATS.map((stat) => (
            <motion.div key={stat.id} variants={cardVariants}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* SparkLine cards side by side */}
        <div className="grid grid-cols-2 gap-3">
          <SparkLineCard {...MOCK_SPARKLINES.resilience} />
          <SparkLineCard {...MOCK_SPARKLINES.participation} />
        </div>

        {/* Recent participants */}
        <div>
          <h2 className="text-sm font-semibold text-ink mb-2">Recent Participants</h2>
          <ParticipantRow participants={MOCK_PARTICIPANTS} />
        </div>

        {/* Results table */}
        <ResultsTable results={MOCK_RESULTS} />
      </div>

      {/* Right column — AI Panel fixed 260px */}
      <div className="w-[260px] shrink-0">
        <AIPanel messages={MOCK_AI_MESSAGES} />
      </div>
    </motion.div>
  )
}
