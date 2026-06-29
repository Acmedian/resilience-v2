import { motion } from 'framer-motion'
import SparkLine from '../ui/SparkLine'

function XLabels({ labels, count }) {
  if (!labels || labels.length === 0) return null
  return (
    <div className="flex justify-between px-0.5 mt-1">
      {labels.map((l) => (
        <span key={l} className="text-[10px] text-slate-400">
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
      className="bg-white border border-border rounded-2xl shadow-card hover:shadow-lift transition-shadow duration-150 p-4 flex flex-col gap-3 cursor-default"
    >
      <div>
        <p className="text-xs font-medium text-slate-500 mb-0.5">{title}</p>
        <p className="text-3xl font-extrabold text-ink tracking-tight leading-none">
          {value}
          <span className="text-lg font-semibold text-slate-400 ml-0.5">{suffix}</span>
        </p>
      </div>

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

      <div className="h-16">
        <SparkLine data={sparkData} width={260} height={64} color="#2DD4A0" />
      </div>

      <XLabels labels={xLabels} count={sparkData.length} />
    </motion.div>
  )
}
