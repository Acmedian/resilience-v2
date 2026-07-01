import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0A1628' }}>
      <div className="glass-card glow-br w-full max-w-sm p-8 flex flex-col items-center text-center">
        <div className="text-2xl font-black text-white">404</div>
        <div className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Page not found.</div>
        <button className="btn-mint mt-6 w-full" onClick={() => navigate('/')}>Back Home</button>
      </div>
    </div>
  )
}
