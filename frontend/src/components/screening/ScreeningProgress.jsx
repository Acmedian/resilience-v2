import { X } from 'lucide-react'

export default function ScreeningProgress({ current, total, title, onClose }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  function handleClose() {
    if (window.confirm('Exit this screening? Your progress on the current question will be lost.')) {
      onClose()
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(10,22,40,0.9)', backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center justify-between px-5 py-3 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={handleClose}
          className="p-1.5 rounded-lg transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Q{current} of {total}</span>
          <span className="text-sm font-semibold text-white mt-0.5">{title}</span>
        </div>

        <span className="text-xs font-bold" style={{ color: '#2DD4A0' }}>{pct}%</span>
      </div>

      <div className="w-full" style={{ height: 2, background: 'rgba(255,255,255,0.1)' }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: '#2DD4A0' }}
        />
      </div>
    </div>
  )
}
