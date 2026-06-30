import { motion } from 'framer-motion'
import SparkLine from '../ui/SparkLine'

function XLabels({ labels }) {
  if (!labels || labels.length === 0) return null
  return (
    <div className="flex justify-between px-0.5 mt-1">
      {labels.map((l) => (
        <span key={l} style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
          {l}
        </span>
      ))}
    </div>
  )
}

export default function SparkLineCard({
  title,
  value,
  suffix = '',
  subStats = [],
  sparkData = [],
  xLabels = [],
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="glass-card p-4 flex flex-col gap-3 cursor-default"
    >
      <div>
        <p className="label-eyebrow mb-0.5">{title}</p>
        <p className="stat-number">
          {value}
          <span className="text-lg font-semibold ml-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{suffix}</span>
        </p>
      </div>

      {subStats.length > 0 && (
        <div className="flex items-center gap-4">
          {subStats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-white">{s.value}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="h-16">
          <SparkLine data={sparkData} width={260} height={64} color="#2DD4A0" />
        </div>
      </div>

      <XLabels labels={xLabels} />
    </motion.div>
  )
}
