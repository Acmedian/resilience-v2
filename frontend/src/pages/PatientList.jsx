import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'
import AddPatientModal from '../components/clinician/AddPatientModal'

const FILTERS = ['All', 'CBT Program', 'Mindfulness Group', 'Self-Guided', 'High risk']

const RISK_LABEL = { stable: 'Stable', monitor: 'Monitor', high_risk: 'High risk' }
const RISK_PILL_CLASS = { stable: 'status-pill-new', monitor: 'status-pill-due', high_risk: 'status-pill-critical' }

function initialsOf(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
}

function avatarGradient(seed) {
  const palettes = ['135deg,#1d3a5f,#050d18', '135deg,#3a2f5f,#050d18', '135deg,#5f2f33,#050d18', '135deg,#2f5f4a,#050d18']
  return palettes[seed % palettes.length]
}

export default function PatientList() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)

  function fetchPatients() {
    setLoading(true)
    return api.get('/api/patients', token)
      .then(data => { if (Array.isArray(data)) setPatients(data) })
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPatients() }, [token])

  const filtered = useMemo(() => {
    return patients.filter(p => {
      if (filter === 'High risk' && p.risk_status !== 'high_risk') return false
      if (filter !== 'All' && filter !== 'High risk' && p.cohort_name !== filter) return false
      if (search) {
        const q = search.toLowerCase()
        const haystack = `${p.name} ${p.cohort_name || ''} ${p.email || ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [patients, filter, search])

  const flaggedCount = patients.filter(p => p.risk_status === 'high_risk').length

  return (
    <div className="min-h-screen" style={{ background: '#0A1628', color: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="text-2xl font-black" style={{ letterSpacing: '-0.025em' }}>Patients</div>
            <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <b style={{ color: '#fff', fontWeight: 700 }}>{patients.length}</b> active · {flaggedCount} flagged for review
            </div>
          </div>
          <button className="btn-mint" onClick={() => setModalOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#06352a" strokeWidth="2.6"><path d="M12 5v14M5 12h14"/></svg>
            Add patient
          </button>
        </div>

        {/* Search + filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2" style={{ flex: 1, minWidth: 220, height: 42, padding: '0 14px', borderRadius: 12, background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, cohort or email…"
              className="bg-transparent text-white placeholder:text-white/40 text-sm outline-none"
              style={{ flex: 1, fontFamily: 'inherit' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => {
              const isActive = filter === f
              const isDanger = f === 'High risk'
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className="text-xs font-semibold transition-all duration-200"
                  style={{
                    padding: '9px 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    color: isActive ? (isDanger ? '#FF6B5E' : '#06352a') : (isDanger ? '#FF6B5E' : 'rgba(255,255,255,0.6)'),
                    background: isActive ? (isDanger ? 'rgba(240,68,56,0.14)' : '#2DD4A0') : (isDanger ? 'rgba(240,68,56,0.1)' : 'rgba(255,255,255,0.05)'),
                    border: isDanger ? '1px solid rgba(240,68,56,0.25)' : (isActive ? 'none' : '1px solid rgba(255,255,255,0.08)'),
                  }}
                >{f}</button>
              )
            })}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div className="grid" style={{ gridTemplateColumns: '2.2fr 1.4fr 1.4fr 1fr 1.3fr 40px', gap: 16, padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {['Patient', 'Cohort', 'Last screening', 'Score', 'Risk status', ''].map(h => (
              <span key={h} className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{h}</span>
            ))}
          </div>

          {loading && (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-lg" style={{ height: 48 }} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {patients.length === 0 ? 'No patients yet.' : 'No patients match your search.'}
              </div>
              {patients.length === 0 && (
                <button className="btn-mint" onClick={() => setModalOpen(true)}>Add Patient</button>
              )}
            </div>
          )}

          {!loading && filtered.map((p, i) => (
            <div
              key={p.id}
              onClick={() => navigate(`/clinician/patients/${p.id}`)}
              className="grid transition-colors duration-200"
              style={{
                gridTemplateColumns: '2.2fr 1.4fr 1.4fr 1fr 1.3fr 40px',
                gap: 16,
                padding: '15px 20px',
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                cursor: 'pointer',
                background: p.risk_status === 'high_risk' ? 'rgba(240,68,56,0.05)' : 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = p.risk_status === 'high_risk' ? 'rgba(240,68,56,0.1)' : 'rgba(45,212,160,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.background = p.risk_status === 'high_risk' ? 'rgba(240,68,56,0.05)' : 'transparent' }}
            >
              <div className="flex items-center gap-3">
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(${avatarGradient(p.id)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', border: `1px solid ${p.risk_status === 'high_risk' ? 'rgba(240,68,56,0.3)' : 'rgba(255,255,255,0.12)'}`, flexShrink: 0 }}>
                  {initialsOf(p.name)}
                </div>
                <div>
                  <div className="text-sm font-bold">{p.name}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>PT-{10000 + p.id}</div>
                </div>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>{p.cohort_name || '—'}</span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {p.latest_screening?.completed_at
                  ? new Date(p.latest_screening.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                  : '—'}
              </span>
              <span className="text-sm font-extrabold" style={{
                color: p.latest_screening?.score == null ? 'rgba(255,255,255,0.3)'
                  : p.latest_screening.score >= 75 ? '#2DD4A0'
                  : p.latest_screening.score >= 50 ? '#F0B429' : '#E5534B',
              }}>
                {p.latest_screening?.score != null ? Math.round(p.latest_screening.score) : '—'}
              </span>
              <span>
                <span className={RISK_PILL_CLASS[p.risk_status]}>{RISK_LABEL[p.risk_status] || p.risk_status}</span>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.4"><path d="M9 6l6 6-6 6"/></svg>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <AddPatientModal
          onClose={() => setModalOpen(false)}
          onCreated={() => { setModalOpen(false); fetchPatients() }}
        />
      )}
    </div>
  )
}
