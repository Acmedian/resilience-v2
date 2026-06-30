import { ChevronRight } from 'lucide-react'

export default function ParticipantRow({ participants = [] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {participants.map((p) => (
        <div
          key={p.id}
          className="glass-card p-4 cursor-pointer group flex items-center gap-3"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: p.color, color: p.textColor }}
          >
            {p.initials}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{p.name}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.cohort || p.unit}</p>
          </div>

          <ChevronRight
            size={14}
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            style={{ color: '#2DD4A0' }}
          />
        </div>
      ))}
    </div>
  )
}
