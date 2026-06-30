import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, CheckCircle, Edit3, Mic, MicOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TRANSCRIPT = [
  { role: 'clinician', text: 'Good morning. How have you been feeling since our last session?' },
  { role: 'patient', text: 'A bit better, but the sleep issues are still there. Some nights I just can\'t switch off.' },
  { role: 'clinician', text: 'I see. Are you still taking the melatonin we discussed?' },
  { role: 'patient', text: 'Yes, 3mg before bed. It helps a little but not consistently.' },
  { role: 'clinician', text: 'Okay. Let\'s consider adjusting the dose. I also want to review your mood logs this week.' },
  { role: 'patient', text: 'Sure, I\'ve been tracking on the app. There were a couple of low days mid-week.' },
]

const SESSION_INFO = [
  { label: 'Clinician', value: 'Dr. Aryan Shah' },
  { label: 'Patient', value: 'Priya Sharma (32F)' },
  { label: 'Session type', value: 'Follow-up' },
  { label: 'History', value: 'Depression, Insomnia' },
]

const SUMMARY_FIELDS = [
  { label: 'Chief Complaint', value: 'Persistent sleep difficulties and residual depressive symptoms.' },
  { label: 'Progress', value: 'Patient reports mild improvement; low mood episodes mid-week. Sleep quality variable.' },
  { label: 'Medication', value: 'Melatonin 3mg — consider dose adjustment to 5mg. Continue SSRIs as prescribed.' },
  { label: 'Follow-up', value: 'Review mood logs next session. Schedule in 2 weeks.' },
]

function Timer() {
  const [seconds, setSeconds] = useState(522)
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return <span className="font-mono text-sm font-semibold text-white">{mm}:{ss}</span>
}

export default function MedicalScribe() {
  const navigate = useNavigate()
  const [recording, setRecording] = useState(true)
  const [approved, setApproved] = useState(false)
  const [editing, setEditing] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0B0F0E' }}>
      {/* Topbar */}
      <header className="topbar-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: '#0F1715', border: '1px solid rgba(45,212,160,0.2)' }}
              >
                <Zap className="w-4 h-4 text-mint" fill="#2DD4A0" strokeWidth={0} />
              </div>
              <span className="font-bold text-white text-sm">Resilience</span>
            </div>
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Medical Scribe</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setRecording(r => !r)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={recording
                ? { background: 'rgba(229,83,75,0.12)', color: '#E5534B', border: '1px solid rgba(229,83,75,0.25)' }
                : { background: 'rgba(45,212,160,0.10)', color: '#2DD4A0', border: '1px solid rgba(45,212,160,0.2)' }
              }
            >
              {recording ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-danger animate-blink" />
                  <Timer />
                  <span>Recording</span>
                  <MicOff className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  Start recording
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/home')}
              className="btn-ghost text-sm"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Info Bar */}
      <div style={{ background: '#0A0E0D', borderBottom: '1px solid rgba(45,212,160,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-x-8 gap-y-1">
          {SESSION_INFO.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.25)' }}>{label}:</span>
              <span className="text-xs font-medium text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transcript Panel */}
        <div className="glass-card flex flex-col overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(45,212,160,0.08)' }}
          >
            <h2 className="text-sm font-bold text-white">Live transcript</h2>
            <div
              className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(229,83,75,0.12)', color: '#E5534B', border: '1px solid rgba(229,83,75,0.2)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-blink" />
              LIVE
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {TRANSCRIPT.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: line.role === 'clinician' ? -8 : 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12, duration: 0.3 }}
                className="flex flex-col gap-1"
              >
                <span
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: line.role === 'clinician' ? '#2DD4A0' : 'rgba(255,255,255,0.35)' }}
                >
                  {line.role === 'clinician' ? 'Dr. Shah' : 'Priya'}
                </span>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: line.role === 'clinician' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.55)' }}
                >
                  {line.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Summary Panel */}
        <div className="glass-card flex flex-col overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(45,212,160,0.08)' }}
          >
            <h2 className="text-sm font-bold text-white">AI Summary</h2>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wider"
              style={{ background: 'rgba(45,212,160,0.12)', color: '#2DD4A0' }}
            >
              AI · Draft
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {SUMMARY_FIELDS.map(({ label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
              >
                <p className="section-label mb-1">{label}</p>
                {editing ? (
                  <textarea
                    defaultValue={value}
                    rows={3}
                    className="input resize-none text-xs"
                  />
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{value}</p>
                )}
              </motion.div>
            ))}
          </div>

          <div
            className="px-5 py-4 flex gap-2"
            style={{ borderTop: '1px solid rgba(45,212,160,0.08)' }}
          >
            {approved ? (
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#2DD4A0' }}>
                <CheckCircle className="w-4 h-4" />
                Approved
              </div>
            ) : (
              <button
                onClick={() => setApproved(true)}
                className="btn-mint flex-1"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            )}
            <button
              onClick={() => setEditing(e => !e)}
              className="btn-outline flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {editing ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
