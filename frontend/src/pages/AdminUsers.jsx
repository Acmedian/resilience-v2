import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'

const FILTERS = ['All', 'Patients', 'Clinicians', 'Admins']
const FILTER_ROLE = { Patients: 'patient', Clinicians: 'clinician', Admins: 'admin' }
const ROLE_PILL_CLASS = { patient: 'status-pill-new', clinician: 'status-pill-due', admin: 'status-pill-critical' }

const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-mint focus:ring-1 focus:ring-mint"

function initialsOf(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
}

function AddUserModal({ onClose, onCreated, token }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'clinician', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  async function handleSubmit() {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.')
      return
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const data = await api.post('/api/admin/users', {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        password: form.password,
      }, token)
      if (!data || !data.id) {
        setError(data?.detail || 'Could not create user.')
        return
      }
      onCreated()
    } catch {
      setError('Unable to reach the server. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 100 }} onClick={onClose}>
      <div className="glass-card w-full max-w-md p-6" style={{ background: '#0F1715' }} onClick={e => e.stopPropagation()}>
        <div className="text-white font-black text-xl mb-1">Add user</div>
        <div className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>Create a clinician or admin account. Patients sign in with Google SSO.</div>

        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Full name</label>
        <input className={inputClass} style={{ marginBottom: 14 }} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Dr. Jane Doe" />

        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Email</label>
        <input className={inputClass} style={{ marginBottom: 14 }} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane.doe@clinic.com" />

        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Role</label>
        <select className={inputClass} style={{ marginBottom: 14 }} value={form.role} onChange={e => set('role', e.target.value)}>
          <option value="clinician">Clinician</option>
          <option value="admin">Admin</option>
        </select>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Password</label>
            <input className={inputClass} type="password" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Confirm password</label>
            <input className={inputClass} type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
          </div>
        </div>

        {error && <div className="text-red-400 text-xs mt-3">{error}</div>}

        <div className="flex gap-3 mt-6">
          <button className="btn-ghost-dark" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn-mint" style={{ flex: 1, opacity: submitting ? 0.7 : 1 }} disabled={submitting} onClick={handleSubmit}>
            {submitting ? 'Creating…' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)

  function fetchUsers() {
    setLoading(true)
    return api.get('/api/admin/users', token)
      .then(data => { if (Array.isArray(data)) setUsers(data) })
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchUsers() }, [token])

  const filtered = useMemo(() => {
    if (filter === 'All') return users
    return users.filter(u => u.role === FILTER_ROLE[filter])
  }, [users, filter])

  const counts = useMemo(() => ({
    patient: users.filter(u => u.role === 'patient').length,
    clinician: users.filter(u => u.role === 'clinician').length,
    admin: users.filter(u => u.role === 'admin').length,
  }), [users])

  async function handleRoleChange(user, role) {
    const data = await api.put(`/api/admin/users/${user.id}/role`, { role }, token)
    if (data && data.id) fetchUsers()
  }

  async function handleDeactivate(user) {
    if (!window.confirm(`Deactivate ${user.name}? They will no longer be able to sign in.`)) return
    await api.delete(`/api/admin/users/${user.id}`, token)
    fetchUsers()
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A1628', color: '#fff' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 mb-4 text-sm font-semibold"
          style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 6l-6 6 6 6"/></svg>
          Back to dashboard
        </button>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="text-2xl font-black" style={{ letterSpacing: '-0.025em' }}>Users &amp; Access</div>
          <button className="btn-mint" onClick={() => setModalOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#06352a" strokeWidth="2.6"><path d="M12 5v14M5 12h14"/></svg>
            Add User
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Patients', value: counts.patient, color: '#2DD4A0' },
            { label: 'Clinicians', value: counts.clinician, color: '#F0B429' },
            { label: 'Admins', value: counts.admin, color: '#E5534B' },
          ].map(s => (
            <div key={s.label} className="glass-card p-5">
              <div className="label-eyebrow mb-2">{s.label}</div>
              <div className="text-3xl font-black" style={{ color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {FILTERS.map(f => (
            <button
              key={f}
              className="text-xs font-semibold transition-all duration-200"
              style={{
                padding: '9px 14px', borderRadius: 10, cursor: 'pointer',
                background: filter === f ? '#2DD4A0' : 'rgba(255,255,255,0.05)',
                color: filter === f ? '#06352a' : 'rgba(255,255,255,0.6)',
                border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}
              onClick={() => setFilter(f)}
            >{f}</button>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {loading && (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-lg" style={{ height: 48 }} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-sm text-center py-10" style={{ color: 'rgba(255,255,255,0.4)' }}>No users match this filter.</div>
          )}

          {!loading && filtered.length > 0 && (
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['User', 'Email', 'Role', 'Created', 'Status', ''].map(h => (
                    <th key={h} className="text-left text-[10px] font-extrabold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)', padding: '12px 18px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-white/5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#1d3a5f,#050d18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                          {initialsOf(u.name)}
                        </div>
                        <span className="text-sm font-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-sm" style={{ padding: '12px 18px', color: 'rgba(255,255,255,0.6)' }}>{u.email}</td>
                    <td style={{ padding: '12px 18px' }}><span className={ROLE_PILL_CLASS[u.role]}>{u.role}</span></td>
                    <td className="text-sm" style={{ padding: '12px 18px', color: 'rgba(255,255,255,0.5)' }}>
                      {new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span className={u.is_active ? 'status-pill-new' : 'status-pill-done'}>{u.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <div className="flex items-center gap-2">
                        <select
                          className="text-xs"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, padding: '4px 6px' }}
                          value={u.role}
                          onChange={e => handleRoleChange(u, e.target.value)}
                        >
                          <option value="patient">Patient</option>
                          <option value="clinician">Clinician</option>
                          <option value="admin">Admin</option>
                        </select>
                        {u.is_active && (
                          <button
                            className="btn-ghost-dark"
                            style={{ padding: '5px 10px', fontSize: 11 }}
                            onClick={() => handleDeactivate(u)}
                          >Deactivate</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <AddUserModal
          token={token}
          onClose={() => setModalOpen(false)}
          onCreated={() => { setModalOpen(false); fetchUsers() }}
        />
      )}
    </div>
  )
}
