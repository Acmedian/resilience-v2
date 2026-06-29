import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export default function ParticipantRow({ participants = [] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {participants.map((p) => (
        <motion.div
          key={p.id}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="bg-white border border-border rounded-2xl shadow-card hover:shadow-lift transition-shadow duration-150 p-3 flex items-center gap-3 cursor-pointer"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: p.color, color: p.textColor }}
          >
            {p.initials}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
            <p className="text-xs text-slate-400 truncate">{p.unit}</p>
          </div>

          <ChevronRight size={14} className="text-slate-300 shrink-0" />
        </motion.div>
      ))}
    </div>
  )
}
