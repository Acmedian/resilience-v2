export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4" style={{ background: '#0A1628', zIndex: 200 }}>
      <svg width="48" height="48" viewBox="0 0 48 48" style={{ animation: 'rsl-rotate 1s linear infinite' }}>
        <circle
          cx="24" cy="24" r="20"
          fill="none"
          stroke="rgba(45,212,160,0.15)"
          strokeWidth="4"
        />
        <circle
          cx="24" cy="24" r="20"
          fill="none"
          stroke="#2DD4A0"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="125.6"
          strokeDashoffset="94.2"
        />
      </svg>
      <style>{'@keyframes rsl-rotate { to { transform: rotate(360deg); } }'}</style>
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
    </div>
  )
}
