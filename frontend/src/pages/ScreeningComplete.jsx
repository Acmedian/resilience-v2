import { Check } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

function interpretation(score) {
  if (score === null || score === undefined) {
    return { text: 'Thanks for completing this screening.', color: 'rgba(255,255,255,0.5)' }
  }
  if (score >= 75) return { text: 'Great — your resilience is strong this week', color: '#2DD4A0' }
  if (score >= 50) return { text: 'Good — some areas to watch', color: '#F0B429' }
  return { text: 'Take care — speak to your clinician', color: '#E5534B' }
}

export default function ScreeningComplete() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const score = state?.score ?? null
  const screeningTitle = state?.screeningTitle || 'Screening'
  const note = interpretation(score)

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0A1628' }}>
      <div className="glass-card glow-br w-full max-w-sm mx-auto p-8 flex flex-col items-center text-center">
        <div
          className="rounded-full flex items-center justify-center"
          style={{ width: 64, height: 64, background: 'rgba(45,212,160,0.15)' }}
        >
          <Check size={32} color="#2DD4A0" />
        </div>

        <div className="text-2xl font-black text-white mt-4">Screening Complete</div>
        <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{screeningTitle}</div>

        <div className="mt-6 flex items-baseline justify-center gap-1">
          <span className="stat-hero-num" style={{ color: '#2DD4A0' }}>
            {score === null ? '—' : Math.round(score)}
          </span>
          <span className="text-2xl" style={{ color: 'rgba(255,255,255,0.3)' }}>/100</span>
        </div>

        <div className="text-sm font-semibold mt-3" style={{ color: note.color }}>{note.text}</div>

        <button
          type="button"
          className="btn-mint mt-8 w-full"
          onClick={() => navigate('/home', { replace: true })}
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
