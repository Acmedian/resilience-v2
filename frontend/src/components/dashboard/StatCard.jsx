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
      className="glass-card p-5 flex flex-col gap-3 cursor-default"
      style={{ borderLeft: `3px solid ${progressColor}` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {IconComponent && (
            <IconComponent size={14} style={{ color: 'rgba(255,255,255,0.3)' }} className="shrink-0" />
          )}
          <span className="label-eyebrow">{label}</span>
        </div>
        <button
          className="p-0.5 rounded transition-colors duration-150"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <ChevronRight size={13} />
        </button>
      </div>

      <div className="stat-number">
        <AnimatedNumber value={parseFloat(value) || 0} decimals={decimals} suffix={suffix} />
      </div>

      {subStats.length > 0 && (
        <div className="flex items-center gap-5">
          {subStats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-white">{s.value}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {sparkData.length > 0 && <SparkBar data={sparkData} height={40} />}

      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progressValue}%`, backgroundColor: progressColor }}
        />
      </div>
    </motion.div>
  )
}
