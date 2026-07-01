import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'

const QUESTION_TYPES = [
  { value: '', label: 'Mixed types' },
  { value: 'mcq', label: 'MCQ' },
  { value: 'rating', label: 'Rating' },
  { value: 'fill', label: 'Fill in blank' },
  { value: 'truefalse', label: 'True / False' },
]

const BANK_FILTERS = [
  { value: 'All', label: 'All' },
  { value: 'mcq', label: 'MCQ' },
  { value: 'rating', label: 'Rating' },
  { value: 'fill', label: 'Fill' },
  { value: 'truefalse', label: 'True/False' },
]

const TYPE_PILL_CLASS = {
  mcq: 'status-pill-new',
  rating: 'status-pill-due',
  fill: 'status-pill-done',
  truefalse: 'status-pill-critical',
}

const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-mint focus:ring-1 focus:ring-mint"

function EditQuestionModal({ question, onClose, onSaved, token }) {
  const [text, setText] = useState(question.text)
  const [optionsText, setOptionsText] = useState((question.options || []).join(', '))
  const [isRequired, setIsRequired] = useState(question.is_required)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        text,
        is_required: isRequired,
        options: question.type === 'mcq'
          ? optionsText.split(',').map(o => o.trim()).filter(Boolean)
          : undefined,
      }
      const data = await api.put(`/api/screenings/${question.screening_id}/questions/${question.id}`, payload, token)
      if (data && data.id) onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', zIndex: 100 }} onClick={onClose}>
      <div className="glass-card w-full max-w-md p-6" style={{ background: '#0F1715' }} onClick={e => e.stopPropagation()}>
        <div className="text-white font-black text-lg mb-4">Edit question</div>
        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Question text</label>
        <textarea className={inputClass} style={{ marginBottom: 14, resize: 'none' }} rows={3} value={text} onChange={e => setText(e.target.value)} />
        {question.type === 'mcq' && (
          <>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Options (comma-separated)</label>
            <input className={inputClass} style={{ marginBottom: 14 }} value={optionsText} onChange={e => setOptionsText(e.target.value)} />
          </>
        )}
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <input type="checkbox" checked={isRequired} onChange={e => setIsRequired(e.target.checked)} />
          Required
        </label>
        <div className="flex gap-3 mt-6">
          <button className="btn-ghost-dark" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn-mint" style={{ flex: 1, opacity: saving ? 0.7 : 1 }} disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ScreeningBuilder() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [topic, setTopic] = useState('')
  const [questionType, setQuestionType] = useState('')
  const [count, setCount] = useState(6)
  const [targetScreeningId, setTargetScreeningId] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState([])
  const [approvedIndices, setApprovedIndices] = useState(new Set())
  const [discardedIndices, setDiscardedIndices] = useState(new Set())

  const [screenings, setScreenings] = useState([])
  const [bankQuestions, setBankQuestions] = useState([])
  const [bankLoading, setBankLoading] = useState(true)
  const [bankFilter, setBankFilter] = useState('All')
  const [editingQuestion, setEditingQuestion] = useState(null)

  function loadBank() {
    setBankLoading(true)
    api.get('/api/screenings', token)
      .then(async list => {
        if (!Array.isArray(list)) return
        setScreenings(list)
        const details = await Promise.all(
          list.map(s => api.get(`/api/screenings/${s.id}`, token))
        )
        const flat = []
        details.forEach((detail, i) => {
          if (!detail || !detail.questions) return
          detail.questions.forEach(q => {
            flat.push({ ...q, screening_id: list[i].id, screening_title: list[i].title })
          })
        })
        setBankQuestions(flat)
      })
      .finally(() => setBankLoading(false))
  }

  useEffect(() => { loadBank() }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleGenerate() {
    if (!topic.trim()) return
    setGenerating(true)
    setGenerated([])
    setApprovedIndices(new Set())
    setDiscardedIndices(new Set())
    try {
      const data = await api.post('/api/questions/generate', {
        topic,
        question_type: questionType || null,
        count,
      }, token)
      if (Array.isArray(data)) setGenerated(data)
    } finally {
      setGenerating(false)
    }
  }

  async function approveOne(index) {
    if (!targetScreeningId) return
    const q = generated[index]
    await api.post('/api/questions/approve', {
      screening_id: Number(targetScreeningId),
      questions: [q],
    }, token)
    setApprovedIndices(prev => new Set([...prev, index]))
    loadBank()
  }

  async function approveAll() {
    if (!targetScreeningId) return
    const remaining = generated
      .map((q, i) => ({ q, i }))
      .filter(({ i }) => !approvedIndices.has(i) && !discardedIndices.has(i))
    if (remaining.length === 0) return
    await api.post('/api/questions/approve', {
      screening_id: Number(targetScreeningId),
      questions: remaining.map(r => r.q),
    }, token)
    setApprovedIndices(prev => new Set([...prev, ...remaining.map(r => r.i)]))
    loadBank()
  }

  function discardOne(index) {
    setDiscardedIndices(prev => new Set([...prev, index]))
  }

  async function handleDelete(question) {
    if (!window.confirm('Delete this question? This cannot be undone.')) return
    await api.delete(`/api/screenings/${question.screening_id}/questions/${question.id}`, token)
    loadBank()
  }

  const pendingCount = generated.length - approvedIndices.size - discardedIndices.size
  const filteredBank = bankFilter === 'All' ? bankQuestions : bankQuestions.filter(q => q.type === bankFilter)

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
        {/* AI Question Generator */}
        <div className="glass-card glow-br p-6 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: '#2DD4A0', fontSize: 18 }}>✦</span>
            <span className="text-white font-black text-lg">Generate with AI</span>
          </div>
          <div className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>Describe what you want this screening to measure, and AI will draft the questions.</div>

          <textarea
            className={inputClass}
            style={{ marginBottom: 14, resize: 'none' }}
            rows={4}
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Describe the topic or screening goal…"
          />

          <div className="flex flex-wrap gap-3 items-center mb-2">
            <select className={inputClass} style={{ width: 180 }} value={questionType} onChange={e => setQuestionType(e.target.value)}>
              {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <input
              type="number" min="1" max="20"
              className={inputClass}
              style={{ width: 100 }}
              value={count}
              onChange={e => setCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            />
            <select className={inputClass} style={{ width: 220 }} value={targetScreeningId} onChange={e => setTargetScreeningId(e.target.value)}>
              <option value="">Add to screening…</option>
              {screenings.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <button className="btn-mint" disabled={generating || !topic.trim()} style={{ opacity: generating || !topic.trim() ? 0.6 : 1 }} onClick={handleGenerate}>
              {generating ? 'Generating…' : '✦ Generate'}
            </button>
          </div>

          {generating && (
            <div className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Generating questions...</div>
          )}

          {!generating && generated.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold">{generated.length} drafts</div>
                {pendingCount > 0 && (
                  <button className="btn-mint" style={{ padding: '8px 14px', fontSize: 12 }} onClick={approveAll} disabled={!targetScreeningId}>
                    Approve All ({pendingCount})
                  </button>
                )}
              </div>
              {!targetScreeningId && (
                <div className="text-xs mb-3" style={{ color: '#F0B429' }}>Select a screening above to approve questions into it.</div>
              )}
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {generated.map((q, i) => {
                    const isApproved = approvedIndices.has(i)
                    const isDiscarded = discardedIndices.has(i)
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: isDiscarded ? 0.4 : 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        className="glass-card p-4"
                        style={{ borderLeft: isApproved ? '3px solid #2DD4A0' : undefined }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">{q.text}</div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className={TYPE_PILL_CLASS[q.type]}>{q.type}</span>
                              {q.options && q.options.map(opt => (
                                <span key={opt} className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 10 }}>{opt}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            {isApproved ? (
                              <span className="text-xs font-bold" style={{ color: '#2DD4A0' }}>Added ✓</span>
                            ) : isDiscarded ? (
                              <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>Discarded</span>
                            ) : (
                              <>
                                <button className="btn-mint" style={{ padding: '6px 12px', fontSize: 11 }} disabled={!targetScreeningId} onClick={() => approveOne(i)}>Approve</button>
                                <button className="btn-ghost-dark" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => discardOne(i)}>Discard</button>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Question Bank */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="text-white font-bold">Question Bank</div>
            <div className="flex gap-2 flex-wrap">
              {BANK_FILTERS.map(f => (
                <button
                  key={f.value}
                  className="text-xs font-semibold transition-all duration-200"
                  style={{
                    padding: '7px 12px', borderRadius: 9, cursor: 'pointer',
                    background: bankFilter === f.value ? '#2DD4A0' : 'rgba(255,255,255,0.05)',
                    color: bankFilter === f.value ? '#06352a' : 'rgba(255,255,255,0.6)',
                    border: bankFilter === f.value ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  }}
                  onClick={() => setBankFilter(f.value)}
                >{f.label}</button>
              ))}
            </div>
          </div>

          {bankLoading && <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading question bank…</div>}

          {!bankLoading && filteredBank.length === 0 && (
            <div className="text-sm text-center py-8" style={{ color: 'rgba(255,255,255,0.4)' }}>No questions match this filter.</div>
          )}

          {!bankLoading && filteredBank.length > 0 && (
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Question', 'Screening', 'Type', ''].map(h => (
                    <th key={h} className="text-left text-[10px] font-extrabold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)', padding: '10px 14px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBank.map(q => (
                  <tr key={`${q.screening_id}-${q.id}`} className="hover:bg-white/5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="text-sm" style={{ padding: '12px 14px', maxWidth: 360 }}>{q.text}</td>
                    <td className="text-sm" style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.6)' }}>{q.screening_title}</td>
                    <td style={{ padding: '12px 14px' }}><span className={TYPE_PILL_CLASS[q.type]}>{q.type}</span></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div className="flex gap-2">
                        <button title="Edit" onClick={() => setEditingQuestion(q)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>
                        </button>
                        <button title="Delete" onClick={() => handleDelete(q)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E5534B' }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          token={token}
          onClose={() => setEditingQuestion(null)}
          onSaved={() => { setEditingQuestion(null); loadBank() }}
        />
      )}
    </div>
  )
}
