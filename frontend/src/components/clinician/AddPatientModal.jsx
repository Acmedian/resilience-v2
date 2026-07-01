import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../lib/api'

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'undisclosed', label: 'Prefer not to say' },
]

const COHORTS = ['CBT Program', 'Mindfulness Group', 'Self-Guided']

const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-mint focus:ring-1 focus:ring-mint"
const labelClass = "text-xs font-semibold mb-1.5 block"

export default function AddPatientModal({ onClose, onCreated, patient }) {
  const { token } = useAuth()
  const isEdit = Boolean(patient)
  const [form, setForm] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    age: patient?.age ?? '',
    gender: patient?.gender || '',
    condition: patient?.condition || '',
    cohort_name: patient?.cohort_name || '',
    notes: patient?.notes || '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError('Full name is required.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        condition: form.condition.trim() || null,
        cohort_name: form.cohort_name || null,
        notes: form.notes.trim() || null,
      }
      const data = isEdit
        ? await api.put(`/api/patients/${patient.id}`, payload, token)
        : await api.post('/api/patients', payload, token)
      if (!data || !data.id) {
        setError(data?.detail || `Could not ${isEdit ? 'update' : 'add'} patient. Please try again.`)
        return
      }
      onCreated(data)
    } catch {
      setError('Unable to reach the server. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', zIndex: 100 }}
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-md p-6"
        style={{ background: '#0F1715', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-white font-black text-xl mb-1">{isEdit ? 'Edit patient' : 'Add new patient'}</div>
        <div className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {isEdit ? 'Update this patient’s record.' : 'Create a new patient record on your roster.'}
        </div>

        <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Full name</label>
        <input className={inputClass} style={{ marginBottom: 14 }} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Doe" />

        <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Email (optional)</label>
        <input className={inputClass} style={{ marginBottom: 14 }} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane.doe@example.com" />

        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 14 }}>
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Age</label>
            <input className={inputClass} type="number" min="0" value={form.age} onChange={e => set('age', e.target.value)} placeholder="34" />
          </div>
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Gender</label>
            <select className={inputClass} value={form.gender} onChange={e => set('gender', e.target.value)}>
              <option value="">Select…</option>
              {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
        </div>

        <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Condition / diagnosis</label>
        <input className={inputClass} style={{ marginBottom: 14 }} value={form.condition} onChange={e => set('condition', e.target.value)} placeholder="Anxiety Disorder" />

        <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Cohort</label>
        <select className={inputClass} style={{ marginBottom: 14 }} value={form.cohort_name} onChange={e => set('cohort_name', e.target.value)}>
          <option value="">Select…</option>
          {COHORTS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Notes</label>
        <textarea className={inputClass} style={{ marginBottom: 6, resize: 'none' }} rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional context…" />

        {error && <div className="text-red-400 text-xs mt-2">{error}</div>}

        <div className="flex gap-3 mt-6">
          <button type="button" className="btn-ghost-dark" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button type="button" className="btn-mint" style={{ flex: 1, opacity: submitting ? 0.7 : 1 }} disabled={submitting} onClick={handleSubmit}>
            {submitting ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save Changes' : 'Add Patient')}
          </button>
        </div>
      </div>
    </div>
  )
}
