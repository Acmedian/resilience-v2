import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'
import { useToast } from '../components/ui/ToastContext'

const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition

const SUMMARY_FIELDS = [
  { key: 'chief_complaint', label: 'Chief Complaint' },
  { key: 'progress', label: 'Progress Since Last Session' },
  { key: 'medication_response', label: 'Medication Response' },
  { key: 'mental_state', label: 'Mental State Assessment' },
  { key: 'recommended_followup', label: 'Recommended Follow-up' },
  { key: 'session_notes', label: 'Session Notes' },
]

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function formatClock(iso) {
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return ''
  }
}

export default function MedicalScribe() {
  const { sessionId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const showToast = useToast()

  const isNew = sessionId === 'new'
  const patientIdFromQuery = searchParams.get('patientId')

  const [uiState, setUiState] = useState('idle') // idle | recording | processing | completed
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [realSessionId, setRealSessionId] = useState(isNew ? null : Number(sessionId))
  const [patientId, setPatientId] = useState(isNew ? Number(patientIdFromQuery) : null)
  const [patientName, setPatientName] = useState('')
  const [transcript, setTranscript] = useState([])
  const [summary, setSummary] = useState(null)
  const [shareWithPatient, setShareWithPatient] = useState(false)
  const [speaker, setSpeaker] = useState('clinician')
  const [elapsed, setElapsed] = useState(0)
  const [savingField, setSavingField] = useState('')

  const recognitionRef = useRef(null)
  const speakerRef = useRef('clinician')
  const transcriptRef = useRef([])
  const flushedCountRef = useRef(0)
  const timerRef = useRef(null)
  const flushTimerRef = useRef(null)

  useEffect(() => { speakerRef.current = speaker }, [speaker])
  useEffect(() => { transcriptRef.current = transcript }, [transcript])

  useEffect(() => {
    let cancelled = false
    async function init() {
      setLoading(true)
      try {
        if (isNew) {
          const created = await api.post('/api/scribe/sessions', { patient_id: Number(patientIdFromQuery) }, token)
          if (!created || !created.session_id) throw new Error('create failed')
          if (cancelled) return
          setRealSessionId(created.session_id)
          setPatientId(created.patient_id)
          setPatientName(created.patient_name)
        } else {
          const data = await api.get(`/api/scribe/sessions/${sessionId}`, token)
          if (!data || !data.id) throw new Error('not found')
          if (cancelled) return
          setRealSessionId(data.id)
          setPatientId(data.patient_id)
          setPatientName(data.patient_name)
          setTranscript(data.transcript || [])
          transcriptRef.current = data.transcript || []
          flushedCountRef.current = (data.transcript || []).length
          setSummary(data.summary)
          setShareWithPatient(data.share_with_patient)
          if (data.status === 'completed') setUiState('completed')
        }
      } catch {
        if (!cancelled) setError('Unable to load this session.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    init()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      stopRecognition()
      if (timerRef.current) clearInterval(timerRef.current)
      if (flushTimerRef.current) clearInterval(flushTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function stopRecognition() {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch { /* already stopped */ }
      recognitionRef.current = null
    }
  }

  async function flushTranscript() {
    const all = transcriptRef.current
    const newLines = all.slice(flushedCountRef.current)
    if (newLines.length === 0 || !realSessionId) return
    flushedCountRef.current = all.length
    try {
      await api.post(`/api/scribe/sessions/${realSessionId}/transcript`, { lines: newLines }, token)
    } catch {
      flushedCountRef.current -= newLines.length
    }
  }

  function handleStartRecording() {
    if (!SpeechRecognitionCtor) {
      setError('Voice recognition is not supported in this browser.')
      return
    }
    setUiState('recording')
    setElapsed(0)

    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    flushTimerRef.current = setInterval(() => flushTranscript(), 30000)

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = event => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          const line = { speaker: speakerRef.current, text: result[0].transcript.trim(), timestamp: new Date().toISOString() }
          if (line.text) {
            const next = [...transcriptRef.current, line]
            transcriptRef.current = next
            setTranscript(next)
            if (next.length - flushedCountRef.current >= 10) flushTranscript()
          }
        }
      }
    }

    recognition.onerror = () => { /* keep recording UI; browser will fire onend */ }
    recognition.onend = () => {
      if (recognitionRef.current) {
        try { recognition.start() } catch { /* session ended */ }
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  async function handleEndSession() {
    stopRecognition()
    if (timerRef.current) clearInterval(timerRef.current)
    if (flushTimerRef.current) clearInterval(flushTimerRef.current)
    setUiState('processing')
    await flushTranscript()
    try {
      const data = await api.post(`/api/scribe/sessions/${realSessionId}/summarise`, {}, token)
      setSummary(data.summary)
      setUiState('completed')
      showToast('Session saved', 'success')
    } catch {
      setError('Could not generate summary. Please try again.')
      showToast('Could not generate summary. Please try again.', 'error')
      setUiState('recording')
    }
  }

  function handleSummaryChange(key, value) {
    setSummary(prev => ({ ...prev, [key]: value }))
  }

  async function handleSummaryBlur(key) {
    setSavingField(key)
    try {
      await api.patch(`/api/scribe/sessions/${realSessionId}`, { summary: { [key]: summary[key] } }, token)
    } finally {
      setSavingField('')
    }
  }

  async function handleToggleShare() {
    const next = !shareWithPatient
    setShareWithPatient(next)
    await api.patch(`/api/scribe/sessions/${realSessionId}`, { share_with_patient: next }, token)
  }

  function handleApprove() {
    showToast('Session approved', 'success')
    navigate(`/clinician/patients/${patientId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A1628' }}>
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading session…</span>
      </div>
    )
  }

  if (error && uiState !== 'recording') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0A1628' }}>
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{error}</span>
        <button className="btn-mint" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A1628', color: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Patient info bar */}
        <div className="glass-card p-4 mb-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 flex-wrap text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span>Patient &nbsp;<b style={{ color: '#fff' }}>{patientName || '—'}</b></span>
            {uiState === 'recording' && (
              <>
                <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.15)' }} />
                <span className="inline-flex items-center gap-2" style={{ color: '#FF6B5E', fontWeight: 700 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F04438', animation: 'recblink 1.4s infinite' }} />
                  Recording {formatTimer(elapsed)}
                </span>
              </>
            )}
          </div>
          {uiState === 'recording' && (
            <button className="btn-ghost-dark" onClick={handleEndSession}>End Session</button>
          )}
        </div>

        {uiState === 'idle' && (
          <div className="glass-card glow-br flex flex-col items-center justify-center gap-6" style={{ padding: '80px 24px' }}>
            <div className="text-white/60 text-sm">Ready to record your session with {patientName}</div>
            <button className="btn-mint" style={{ height: 56, padding: '0 32px', fontSize: 15 }} onClick={handleStartRecording}>
              Start Recording
            </button>
            {error && <div className="text-red-400 text-xs">{error}</div>}
          </div>
        )}

        {uiState === 'recording' && (
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold">Live Transcript</div>
              <div className="flex gap-2">
                <button
                  className="text-xs font-bold rounded-lg py-2 px-4 transition-all duration-200"
                  style={{ background: speaker === 'clinician' ? '#2DD4A0' : 'rgba(255,255,255,0.05)', color: speaker === 'clinician' ? '#06231B' : 'rgba(255,255,255,0.5)' }}
                  onClick={() => setSpeaker('clinician')}
                >👨‍⚕️ Clinician</button>
                <button
                  className="text-xs font-bold rounded-lg py-2 px-4 transition-all duration-200"
                  style={{ background: speaker === 'patient' ? '#2DD4A0' : 'rgba(255,255,255,0.05)', color: speaker === 'patient' ? '#06231B' : 'rgba(255,255,255,0.5)' }}
                  onClick={() => setSpeaker('patient')}
                >🧑 Patient</button>
              </div>
            </div>
            <div className="flex flex-col gap-3" style={{ maxHeight: 420, overflowY: 'auto' }}>
              {transcript.length === 0 && (
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>Listening… speak naturally, toggle the speaker as the conversation switches.</div>
              )}
              {transcript.map((line, i) => (
                <div key={i}>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{formatClock(line.timestamp)}</span>{' '}
                  <span className="text-sm" style={{ color: line.speaker === 'clinician' ? '#2DD4A0' : 'rgba(255,255,255,0.7)' }}>
                    {line.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {uiState === 'processing' && (
          <div className="glass-card flex flex-col items-center justify-center gap-4" style={{ padding: '100px 24px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(45,212,160,0.18)', borderTopColor: '#2DD4A0', animation: 'rsl-spin 0.8s linear infinite' }} />
            <style>{'@keyframes rsl-spin { to { transform: rotate(360deg); } }'}</style>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Generating AI summary...</div>
          </div>
        )}

        {uiState === 'completed' && summary && (
          <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {/* Left: transcript */}
            <div className="glass-card p-5">
              <div className="text-sm font-bold mb-4">Transcript</div>
              <div className="flex flex-col gap-3" style={{ maxHeight: 560, overflowY: 'auto' }}>
                {transcript.map((line, i) => (
                  <div key={i}>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{formatClock(line.timestamp)}</span>{' '}
                    <span className="text-sm" style={{ color: line.speaker === 'clinician' ? '#2DD4A0' : 'rgba(255,255,255,0.7)' }}>
                      {line.text}
                    </span>
                  </div>
                ))}
                {transcript.length === 0 && (
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>No transcript recorded.</div>
                )}
              </div>
            </div>

            {/* Right: editable summary */}
            <div className="glass-card p-5">
              <div className="text-sm font-bold mb-4">AI-Generated Summary</div>
              <div className="flex flex-col gap-4">
                {SUMMARY_FIELDS.map(f => (
                  <div key={f.key}>
                    <div className="label-eyebrow mb-1.5 flex items-center justify-between">
                      <span>{f.label}</span>
                      {savingField === f.key && <span style={{ color: '#2DD4A0' }}>Saving…</span>}
                    </div>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-mint focus:ring-1 focus:ring-mint"
                      style={{ resize: 'vertical', minHeight: 60 }}
                      value={summary[f.key] || ''}
                      onChange={e => handleSummaryChange(f.key, e.target.value)}
                      onBlur={() => handleSummaryBlur(f.key)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <input type="checkbox" checked={shareWithPatient} onChange={handleToggleShare} />
                  Share with Patient
                </label>
              </div>

              <button className="btn-mint w-full mt-4" onClick={handleApprove}>Approve &amp; Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
