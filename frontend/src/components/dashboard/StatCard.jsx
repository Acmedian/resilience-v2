import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import * as Icons from 'lucide-react'
import AnimatedNumber from '../ui/AnimatedNumber'
import SparkBar from '../ui/SparkBar'

export default function StatCard({
  icon,
  label,
  value,
  decimals = 0,
  suffix = '',
  subStats = [],
  sparkData = [],
  progressValue = 0,
  progressColor = '#2DD4A0',
}) {
  const IconComponent = Icons[icon]

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="bg-white border border-border rounded-2xl shadow-card hover:shadow-lift transition-shadow duration-150 p-4 flex flex-col gap-3 cursor-default"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {IconComponent && (
            <IconComponent size={14} className="text-slate-400 shrink-0" />
          )}
          <span className="text-xs font-medium text-slate-500">{label}</span>
        </div>
        <button className="p-0.5 rounded hover:bg-slate-100 transition-colors duration-150">
          <ChevronRight size={13} className="text-slate-300" />
        </button>
      </div>

      {/* Main number */}
      <div className="stat-number text-ink">
        <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
      </div>

      {/* Sub-stats */}
      {subStats.length > 0 && (
        <div className="flex items-center gap-4">
          {subStats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-ink">{s.value}</span>
              <span className="text-xs text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Spark bars */}
      {sparkData.length > 0 && <SparkBar data={sparkData} height={32} />}

      {/* Progress bar */}
      <div
        className="w-full bg-slate-100 rounded-full overflow-hidden"
        style={{ height: 3 }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progressValue}%`, backgroundColor: progressColor }}
        />
      </div>
    </motion.div>
  )
}
