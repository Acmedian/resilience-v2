import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'
import { useToast } from '../components/ui/ToastContext'
import ScreeningProgress from '../components/screening/ScreeningProgress'
import VoiceOrb from '../components/screening/VoiceOrb'
import QuestionRenderer from '../components/screening/QuestionRenderer'

const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
}

function speakText(text, { onStart, onEnd }) {
  onStart?.()

  const azureKey = import.meta.env.VITE_AZURE_SPEECH_KEY
  const azureRegion = import.meta.env.VITE_AZURE_SPEECH_REGION

  if (azureKey && azureRegion) {
    import('microsoft-cognitiveservices-speech-sdk')
      .then(sdk => {
        const speechConfig = sdk.SpeechConfig.fromSubscription(azureKey, azureRegion)
        speechConfig.speechSynthesisVoiceName = 'en-US-AriaNeural'
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig)
        synthesizer.speakTextAsync(
          text,
          () => { synthesizer.close(); onEnd?.() },
          () => { synthesizer.close(); onEnd?.() }
        )
      })
      .catch(() => {
        speakWithBrowser(text, onEnd)
      })
    return
  }

  speakWithBrowser(text, onEnd)
}

function speakWithBrowser(text, onEnd) {
  if (!window.speechSynthesis) {
    onEnd?.()
    return
  }
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.onend = () => onEnd?.()
  utterance.onerror = () => onEnd?.()
  window.speechSynthesis.speak(utterance)
}

function extractNumber(transcript) {
  const digitMatch = transcript.match(/\b(10|[0-9])\b/)
  if (digitMatch) return Number(digitMatch[1])

  const words = transcript.toLowerCase().split(/\s+/)
  for (const word of words) {
    if (word in NUMBER_WORDS) return NUMBER_WORDS[word]
  }
  return null
}

function parseVoiceAnswer(question, transcript) {
  const clean = transcript.trim()
  if (!clean) return { matched: false }

  if (question.type === 'mcq') {
    const lower = clean.toLowerCase()
    const match = question.options.find(
      opt => lower.includes(opt.toLowerCase()) || opt.toLowerCase().includes(lower)
    )
    return match ? { matched: true, value: match } : { matched: false }
  }

  if (question.type === 'rating') {
    const num = extractNumber(clean)
    if (num === null) return { matched: false }
    return { matched: true, value: Math.max(1, Math.min(10, num)) }
  }

  if (question.type === 'truefalse') {
    const lower = clean.toLowerCase()
    if (/\b(true|yes|yeah|correct|agree)\b/.test(lower)) return { matched: true, value: true }
    if (/\b(false|no|nope|disagree|incorrect)\b/.test(lower)) return { matched: true, value: false }
    return { matched: false }
  }

  // fill / file: raw transcript is the answer
  return { matched: true, value: clean }
}

function hasAnswer(question, answers) {
  const val = answers[question.id]
  if (val === undefined || val === null) return false
  if (question.type === 'fill') return typeof val === 'string' && val.trim().length > 0
  if (question.type === 'truefalse') return typeof val === 'boolean'
  if (question.type === 'rating') return typeof val === 'number'
  return typeof val === 'string' && val.length > 0
}

const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition

export default function VoiceScreening() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const showToast = useToast()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [screening, setScreening] = useState(null)
  const [questions, setQuestions] = useState([])
  const [resultId, setResultId] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [mode, setMode] = useState('voice')
  const [orbState, setOrbState] = useState('idle')
  const [transcript, setTranscript] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const recognitionRef = useRef(null)
  const recognitionActiveRef = useRef(false)
  const advanceTimeoutRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function init() {
      setLoading(true)
      setError('')
      try {
        const detail = await api.get(`/api/screenings/${id}`, token)
        if (!detail || !detail.screening) throw new Error('not found')

        const start = await api.post(`/api/screenings/${id}/start`, { voice_mode: true }, token)
        if (!start || !start.result_id) throw new Error('could not start')

        if (cancelled) return
        setScreening(start.screening)
        setQuestions(start.questions)
        setResultId(start.result_id)
      } catch {
        if (!cancelled) setError('Unable to load this screening. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    init()
    return () => { cancelled = true }
  }, [id, token])

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  function stopRecognition() {
    if (recognitionRef.current && recognitionActiveRef.current) {
      recognitionActiveRef.current = false
      try { recognitionRef.current.stop() } catch { /* already stopped */ }
    }
  }

  function startListening() {
    if (!SpeechRecognitionCtor || recognitionActiveRef.current) return

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = event => {
      const result = event.results[event.results.length - 1]
      const text = result[0].transcript
      setTranscript(text)

      if (result.isFinal) {
        const question = questions[currentIndex]
        const { matched, value } = parseVoiceAnswer(question, text)
        recognitionActiveRef.current = false

        if (matched) {
          setAnswers(prev => ({ ...prev, [question.id]: value }))
          setOrbState('speaking')
          advanceTimeoutRef.current = setTimeout(() => {
            goToNextOrSubmit({ ...answers, [question.id]: value })
          }, 1500)
        } else {
          setTranscript("Didn't catch that — tap the orb to try again, or switch to Text mode.")
          setOrbState('idle')
        }
      }
    }

    recognition.onerror = () => {
      recognitionActiveRef.current = false
      setOrbState('idle')
    }

    recognition.onend = () => {
      recognitionActiveRef.current = false
    }

    recognitionRef.current = recognition
    recognitionActiveRef.current = true
    setTranscript('')
    try {
      recognition.start()
      setOrbState('listening')
    } catch {
      recognitionActiveRef.current = false
    }
  }

  function speakCurrentQuestion() {
    if (!currentQuestion) return
    speakText(currentQuestion.text, {
      onStart: () => setOrbState('speaking'),
      onEnd: () => {
        setOrbState('listening')
        startListening()
      },
    })
  }

  useEffect(() => {
    return () => {
      stopRecognition()
      window.speechSynthesis?.cancel()
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    stopRecognition()
    window.speechSynthesis?.cancel()
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current)
    setTranscript('')

    if (mode === 'voice' && currentQuestion) {
      if (!SpeechRecognitionCtor) {
        setOrbState('idle')
        return
      }
      speakCurrentQuestion()
    } else {
      setOrbState('idle')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, mode, currentQuestion?.id])

  function handleOrbToggle() {
    if (!SpeechRecognitionCtor) return
    if (orbState === 'listening') {
      stopRecognition()
      setOrbState('idle')
    } else if (orbState === 'idle') {
      startListening()
    }
  }

  function handleAnswerChange(value) {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
  }

  async function goToNextOrSubmit(latestAnswers) {
    if (isLastQuestion) {
      await handleSubmit(latestAnswers)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex(i => i - 1)
  }

  function handleNext() {
    goToNextOrSubmit(answers)
  }

  async function handleSubmit(finalAnswers) {
    setSubmitting(true)
    try {
      const data = await api.post(
        `/api/screenings/${id}/submit`,
        { result_id: resultId, answers: finalAnswers, voice_mode: mode === 'voice' },
        token
      )
      showToast('Screening submitted', 'success')
      navigate(`/screening/${id}/complete`, {
        replace: true,
        state: {
          score: data.score,
          screeningTitle: data.screening_title,
          completedAt: data.completed_at,
        },
      })
    } catch {
      setError('Could not submit your screening. Please try again.')
      showToast('Could not submit your screening. Please try again.', 'error')
      setSubmitting(false)
    }
  }

  function handleClose() {
    stopRecognition()
    window.speechSynthesis?.cancel()
    navigate('/home')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A1628' }}>
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading screening…</span>
      </div>
    )
  }

  if (error && !currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0A1628' }}>
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{error}</span>
        <button className="btn-mint" onClick={() => navigate('/home')}>Back to Home</button>
      </div>
    )
  }

  const answered = currentQuestion ? hasAnswer(currentQuestion, answers) : false

  return (
    <div className="min-h-screen" style={{ background: '#0A1628' }}>
      <ScreeningProgress
        current={currentIndex + 1}
        total={questions.length}
        title={screening?.title || ''}
        onClose={handleClose}
      />

      <div className="max-w-2xl mx-auto pt-24 pb-32 px-6">
        {/* Mode switcher */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { key: 'voice', label: '🎙 Voice' },
            { key: 'text', label: '📝 Text' },
          ].map(m => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className="rounded-full px-5 py-2 text-sm transition-all duration-200"
              style={{
                background: mode === m.key ? '#2DD4A0' : 'rgba(255,255,255,0.05)',
                color: mode === m.key ? '#06231B' : 'rgba(255,255,255,0.5)',
                fontWeight: mode === m.key ? 800 : 600,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {currentQuestion && (
          <>
            <div className="glass-card glow-br p-6 mb-2">
              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#2DD4A0' }}>
                Question {currentIndex + 1}
              </div>
              <div className="text-xl font-semibold leading-relaxed text-white">
                {currentQuestion.text}
              </div>
            </div>

            {mode === 'voice' ? (
              <>
                <div className="flex justify-center mt-10 mb-6">
                  <VoiceOrb state={orbState} onToggle={handleOrbToggle} />
                </div>

                {!SpeechRecognitionCtor && (
                  <div className="text-center text-xs mb-4" style={{ color: 'rgba(240,180,41,0.8)' }}>
                    Voice input isn't supported in this browser — switch to Text mode.
                  </div>
                )}

                <div className="glass-card p-4" style={{ minHeight: 60 }}>
                  {transcript ? (
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{transcript}</span>
                  ) : (
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      Your response will appear here…
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="mt-6">
                <QuestionRenderer
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  onChange={handleAnswerChange}
                  disabled={submitting}
                />
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="btn-ghost-dark"
                disabled={currentIndex === 0}
                style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-mint"
                disabled={!answered || submitting}
                style={{ opacity: !answered || submitting ? 0.5 : 1 }}
                onClick={handleNext}
              >
                {submitting ? 'Submitting…' : isLastQuestion ? 'Submit Screening' : 'Next Question →'}
              </button>
            </div>

            {error && (
              <div className="text-center text-xs mt-4" style={{ color: '#E5534B' }}>{error}</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
