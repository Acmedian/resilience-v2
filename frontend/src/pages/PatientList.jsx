import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PATIENTS = [
  { initials: 'SM', grad: '135deg,#1d3a5f,#0A1628', name: 'Sarah Mitchell', id: 'PT-10428', cohort: 'CBT Program',    last: '2 days ago', score: 78,  risk: 'Stable',    riskBg: 'rgba(45,212,160,0.13)', riskColor: '#0A8a63', dot: '#2DD4A0', rowBg: 'transparent' },
  { initials: 'JC', grad: '135deg,#3a2f5f,#0A1628', name: 'James Carter',   id: 'PT-10391', cohort: 'Mindfulness',   last: '5 days ago', score: 71,  risk: 'Monitor',   riskBg: 'rgba(247,144,9,0.12)',  riskColor: '#DC6803', dot: '#F79009', rowBg: 'transparent' },
  { initials: 'RA', grad: '135deg,#7a2f33,#0A1628', name: 'Rachel Adams',   id: 'PT-10355', cohort: 'CBT Program',    last: 'Today',      score: 52,  risk: 'High risk', riskBg: 'rgba(240,68,56,0.12)',  riskColor: '#D92D20', dot: '#F04438', rowBg: 'rgba(240,68,56,0.035)', scoreColor: '#D92D20' },
  { initials: 'DL', grad: '135deg,#2f5f4a,#0A1628', name: 'David Lin',      id: 'PT-10402', cohort: 'Self-Guided',    last: '1 week ago', score: 75,  risk: 'Stable',    riskBg: 'rgba(45,212,160,0.13)', riskColor: '#0A8a63', dot: '#2DD4A0', rowBg: 'transparent' },
  { initials: 'EO', grad: '135deg,#1d3a5f,#0A1628', name: 'Emma Ortiz',     id: 'PT-10377', cohort: 'Mindfulness',   last: '3 days ago', score: 69,  risk: 'Monitor',   riskBg: 'rgba(247,144,9,0.12)',  riskColor: '#DC6803', dot: '#F79009', rowBg: 'transparent' },
  { initials: 'TN', grad: '135deg,#3a2f5f,#0A1628', name: 'Tom Nguyen',     id: 'PT-10410', cohort: 'CBT Program',    last: '4 days ago', score: 81,  risk: 'Stable',    riskBg: 'rgba(45,212,160,0.13)', riskColor: '#0A8a63', dot: '#2DD4A0', rowBg: 'transparent' },
]

const FILTERS = ['All', 'CBT', 'Mindfulness', 'High risk']

export default function PatientList() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(900px 520px at 0% -8%,rgba(45,212,160,0.07),transparent 60%),#F4F7F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', maxWidth: 1280, height: 800, borderRadius: 26, background: 'radial-gradient(760px 460px at 0% -6%,rgba(45,212,160,0.06),transparent 55%),#F4F7F9', border: '1px solid rgba(16,24,40,0.05)', boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 30px 60px -18px rgba(16,24,40,0.2)', padding: '26px 28px', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.025em', color: '#0A1628' }}>Patients</div>
            <div style={{ fontSize: 13, color: '#667085', fontWeight: 500, marginTop: 3 }}>
              <b style={{ color: '#0A1628', fontWeight: 700 }}>248</b> active · 14 flagged for review
            </div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 16px', border: 'none', borderRadius: 12, background: '#2DD4A0', color: '#06352a', fontSize: 13, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 20px -6px rgba(45,212,160,0.5)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#06352a" strokeWidth="2.6"><path d="M12 5v14M5 12h14"/></svg>
            Add patient
          </button>
        </div>

        {/* Search + filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, height: 42, padding: '0 14px', borderRadius: 12, background: '#fff', border: '1px solid rgba(16,24,40,0.08)', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
            <span style={{ fontSize: 13.5, color: '#98A2B3', fontWeight: 500 }}>Search by name, ID or cohort…</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {FILTERS.map(f => {
              const isActive = filter === f
              const isDanger = f === 'High risk'
              return (
                <span key={f} onClick={() => setFilter(f)}
                  style={{ fontSize: 12.5, fontWeight: isActive ? 700 : 600, cursor: 'pointer', padding: '9px 14px', borderRadius: 10, color: isActive ? (isDanger ? '#D92D20' : '#06352a') : (isDanger ? '#D92D20' : '#475467'), background: isActive ? (isDanger ? 'rgba(240,68,56,0.12)' : '#2DD4A0') : (isDanger ? 'rgba(240,68,56,0.08)' : '#fff'), border: isActive ? (isDanger ? '1px solid rgba(240,68,56,0.22)' : 'none') : (isDanger ? '1px solid rgba(240,68,56,0.22)' : '1px solid rgba(16,24,40,0.08)'), boxShadow: !isActive ? '0 1px 2px rgba(16,24,40,0.04)' : 'none' }}
                >{f}</span>
              )
            })}
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, borderRadius: 16, background: '#fff', border: '1px solid rgba(16,24,40,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 12px 24px -4px rgba(16,24,40,0.1)' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.4fr 1.4fr 1fr 1.3fr 40px', gap: 16, padding: '13px 20px', borderBottom: '1px solid rgba(16,24,40,0.06)', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#98A2B3' }}>
            <span>Patient</span><span>Cohort</span><span>Last screening</span><span>Score</span><span>Risk status</span><span />
          </div>

          {/* Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PATIENTS.map((p, i) => (
              <div key={p.id}
                style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.4fr 1.4fr 1fr 1.3fr 40px', gap: 16, padding: '15px 20px', alignItems: 'center', borderBottom: i < PATIENTS.length - 1 ? '1px solid rgba(16,24,40,0.05)' : 'none', background: p.rowBg, transition: 'background .18s ease', cursor: 'pointer' }}
                onMouseEnter={e => { if (!p.rowBg || p.rowBg === 'transparent') e.currentTarget.style.background = 'rgba(45,212,160,0.05)'; else e.currentTarget.style.background = 'rgba(240,68,56,0.07)' }}
                onMouseLeave={e => e.currentTarget.style.background = p.rowBg || 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(${p.grad})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{p.initials}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0A1628' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#98A2B3', fontWeight: 500 }}>{p.id}</div>
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#475467' }}>{p.cohort}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#667085' }}>{p.last}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: p.scoreColor || '#0A1628', fontVariantNumeric: 'tabular-nums' }}>{p.score}</span>
                <span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: p.riskColor, background: p.riskBg, padding: '5px 11px', borderRadius: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot, flexShrink: 0 }} />{p.risk}
                  </span>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C2C9D2" strokeWidth="2.4"><path d="M9 6l6 6-6 6"/></svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
