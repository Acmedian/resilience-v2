import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A1628' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '3px solid rgba(45,212,160,0.18)',
          borderTopColor: '#2DD4A0',
          animation: 'rsl-spin 0.8s linear infinite',
        }} />
        <style>{'@keyframes rsl-spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      {children ? children : <Outlet />}
      <SignOutButton />
    </>
  )
}

function SignOutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <button
      onClick={handleSignOut}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 700,
        color: '#2DD4A0',
        background: 'rgba(10,22,40,0.85)',
        border: '1px solid rgba(45,212,160,0.3)',
        borderRadius: 20,
        padding: '7px 14px',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 18px -6px rgba(0,0,0,0.4)',
      }}
    >
      Sign out
    </button>
  )
}
