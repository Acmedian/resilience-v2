import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = ['Overview', 'Cohorts', 'Surveys', 'Reports']
const ROUTE_ITEMS = [
  { label: 'Screenings', path: '/admin/screenings' },
  { label: 'Users', path: '/admin/users' },
]

export default function Topbar({ activeNav, onNavChange }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66, padding: '0 32px', background: 'rgba(250,251,252,0.72)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderBottom: '1px solid rgba(16,24,40,0.06)' }}>

      {/* Left: logo + nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(16,24,40,0.18)' }}>
            <div style={{ width: 9, height: 9, background: '#2DD4A0', transform: 'rotate(45deg)', borderRadius: 2 }}/>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: '#0A1628' }}>Resilience</span>
        </div>

        {/* Nav items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_ITEMS.map(item => {
            const isActive = item === 'Overview' ? location.pathname === '/admin' : activeNav === item
            return (
              <button
                key={item}
                onClick={() => { if (item === 'Overview') navigate('/admin'); onNavChange?.(item) }}
                style={{
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#0A1628' : '#667085',
                  padding: '7px 13px',
                  borderRadius: 9,
                  background: isActive ? 'rgba(16,24,40,0.05)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background .15s,color .15s',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(16,24,40,0.04)'; e.currentTarget.style.color = '#0A1628' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#667085' } }}
              >
                {item}
              </button>
            )
          })}
          <span style={{ width: 1, height: 18, background: 'rgba(16,24,40,0.1)', margin: '0 4px' }} />
          {ROUTE_ITEMS.map(item => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#0A1628' : '#667085',
                  padding: '7px 13px',
                  borderRadius: 9,
                  background: isActive ? 'rgba(16,24,40,0.05)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background .15s,color .15s',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(16,24,40,0.04)'; e.currentTarget.style.color = '#0A1628' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#667085' } }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Right: search + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 13px', borderRadius: 10, background: 'rgba(16,24,40,0.04)', minWidth: 190 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
          <span style={{ fontSize: 13, color: '#98A2B3', fontWeight: 500 }}>Search patients…</span>
        </div>

        {/* Avatar */}
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#0A1628,#1d3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, boxShadow: '0 2px 6px rgba(16,24,40,0.18)' }}>
          MK
        </div>
      </div>
    </nav>
  )
}
