import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'
import AddPatientModal from '../components/clinician/AddPatientModal'

const RISK_LABEL = { stable: 'Stable', monitor: 'Monitor', high_risk: 'High risk' }
const RISK_PILL_CLASS = { stable: 'status-pill-new', monitor: 'status-pill-due', high_risk: 'status-pill-critical' }
const GENDER_LABEL = { male: 'Male', female: 'Female', non_binary: 'Non-binary', undisclosed: 'Prefer not to say' }

function scoreColor(score) {
  if (score == null) return 'rgba(255,255,255,0.3)'
  if (score >= 75) return '#2DD4A0'
  if (score >= 50) return '#F0B429'
  return '#E5534B'
}

function InfoField({ label, value }) {
  return (
    <div>
      <div className="label-eyebrow">{label}</div>
      <div className="text-sm font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{value || '—'}</div>
    </div>
  )
}

function ResultModal({ screeningId, resultId, onClose, token }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/screenings/${screeningId}/result/${resultId}`, token)
      .then(data => { if (data && data.result) setDetail(data) })
      .finally(() => setLoading(false))
  }, [screeningId, resultId, token])

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 100 }} onClick={onClose}>
      <div className="glass-card w-full max-w-lg p-6" style={{ background: '#0F1715', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {loading && <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading…</div>}
        {!loading && detail && (
          <>
            <div className="text-white font-black text-lg">{detail.screening.title}</div>
            <div className="text-sm mt-1" style={{ color: scoreColor(detail.result.score) }}>
              Score: {detail.result.score != null ? Math.round(detail.result.score) : 'Not scored'}
            </div>
            <div className="flex flex-col gap-3 mt-5">
              {detail.questions.map(q => (
                <div key={q.id} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{q.text}</div>
                  <div className="text-sm font-semibold mt-1" style={{ color: '#fff' }}>
                    {q.patient_answer === null || q.patient_answer === undefined
                      ? '— no answer —'
                      : typeof q.patient_answer === 'boolean' ? (q.patient_answer ? 'True' : 'False') : String(q.patient_answer)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <button className="btn-ghost-dark w-full mt-5" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [viewingResult, setViewingResult] = useState(null)

  function fetchDetail() {
    setLoading(true)
    return api.get(`/api/patients/${id}`, token)
      .then(d => { if (d && d.patient) setData(d) })
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchDetail() }, [id, token])

  async function handleStartSession() {
    const created = await api.post('/api/scribe/sessions', { patient_id: Number(id) }, token)
    if (created && created.session_id) {
      navigate(`/clinician/scribe/${created.session_id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A1628' }}>
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading patient…</span>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0A1628' }}>
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Patient not found.</span>
        <button className="btn-mint" onClick={() => navigate('/clinician/patients')}>Back to Patients</button>
      </div>
    )
  }

  const { patient, screening_history, scribe_sessions } = data

  return (
    <div className="min-h-screen" style={{ background: '#0A1628', color: '#fff' }}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/clinician/patients')}
          className="flex items-center gap-2 mb-4 text-sm font-semibold"
          style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 6l-6 6 6 6"/></svg>
          Back to patients
        </button>

        {/* Top section */}
        <div className="glass-card glow-tl p-6 mb-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(45,212,160,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#2DD4A0', flexShrink: 0 }}>
                {patient.name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl font-black text-white">{patient.name}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 6 }}>PT-{10000 + patient.id}</span>
                </div>
                <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{patient.condition || 'No condition on file'}</div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {patient.cohort_name && (
                    <span className="status-pill-new">{patient.cohort_name}</span>
                  )}
                  <span className={RISK_PILL_CLASS[patient.risk_status]}>{RISK_LABEL[patient.risk_status] || patient.risk_status}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="btn-mint" onClick={handleStartSession}>Start Scribe Session</button>
              <button className="btn-ghost-dark" onClick={() => setEditOpen(true)}>Edit Patient</button>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <InfoField label="Age" value={patient.age} />
            <InfoField label="Gender" value={GENDER_LABEL[patient.gender] || patient.gender} />
            <InfoField label="Email" value={patient.email} />
            <InfoField label="Created" value={new Date(patient.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} />
          </div>
          {patient.notes && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="label-eyebrow mb-1">Notes</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{patient.notes}</div>
            </div>
          )}
        </div>

        {/* Screening history */}
        <div className="mt-6">
          <div className="text-white font-bold mb-3">Screening History</div>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            {screening_history.length === 0 ? (
              <div className="p-6 text-sm text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>No completed screenings linked to this patient yet.</div>
            ) : (
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Screening', 'Score', 'Date', 'Mode', ''].map(h => (
                      <th key={h} className="text-left text-[10px] font-extrabold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)', padding: '12px 20px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {screening_history.map(item => (
                    <tr key={item.result_id} className="hover:bg-white/5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="text-sm font-semibold" style={{ padding: '14px 20px' }}>{item.screening_title}</td>
                      <td className="text-sm font-extrabold" style={{ padding: '14px 20px', color: scoreColor(item.score) }}>{item.score != null ? Math.round(item.score) : '—'}</td>
                      <td className="text-sm" style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.6)' }}>
                        {item.completed_at ? new Date(item.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {item.voice_mode ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2DD4A0" strokeWidth="2.2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <button
                          className="btn-ghost-dark"
                          style={{ padding: '6px 12px', fontSize: 11 }}
                          onClick={() => setViewingResult({ screeningId: item.screening_id, resultId: item.result_id })}
                        >View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Scribe sessions */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white font-bold">Session History</div>
            <button className="btn-mint" style={{ padding: '8px 14px', fontSize: 12 }} onClick={handleStartSession}>New Session</button>
          </div>
          <div className="flex flex-col gap-3">
            {scribe_sessions.length === 0 && (
              <div className="glass-card p-6 text-sm text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>No scribe sessions recorded yet.</div>
            )}
            {scribe_sessions.map(session => (
              <div key={session.id} className="glass-card p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {new Date(session.recorded_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {session.duration_seconds != null
                        ? `${Math.floor(session.duration_seconds / 60)}:${String(session.duration_seconds % 60).padStart(2, '0')} min`
                        : 'In progress'}
                    </div>
                  </div>
                  <span className={session.status === 'completed' ? 'status-pill-new' : 'status-pill-due'}>
                    {session.status === 'completed' ? 'Completed' : session.status === 'processing' ? 'Processing' : 'Recording'}
                  </span>
                </div>
                <button className="btn-ghost-dark" onClick={() => navigate(`/clinician/scribe/${session.id}`)}>View session</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editOpen && (
        <AddPatientModal
          patient={patient}
          onClose={() => setEditOpen(false)}
          onCreated={() => { setEditOpen(false); fetchDetail() }}
        />
      )}

      {viewingResult && (
        <ResultModal
          screeningId={viewingResult.screeningId}
          resultId={viewingResult.resultId}
          token={token}
          onClose={() => setViewingResult(null)}
        />
      )}
    </div>
  )
}
