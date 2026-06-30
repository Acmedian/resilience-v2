import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown, CheckCircle2, Trash2, Plus } from 'lucide-react'
import Topbar from '../components/layout/Topbar'

const QUESTION_TYPES = ['MCQ', 'Rating', 'Fill', 'True/False']
const FILTER_CHIPS = ['All', 'MCQ', 'Rating', 'Fill', 'True/False']

const QUESTION_BANK = [
  { id: 1, text: 'I feel able to bounce back after setbacks.', type: 'Rating', category: 'Resilience' },
  { id: 2, text: 'Which coping strategy do you use most?', type: 'MCQ', category: 'Coping' },
  { id: 3, text: 'I have felt hopeful about the future recently.', type: 'True/False', category: 'Wellbeing' },
  { id: 4, text: 'Complete: "When I feel stressed, I usually…"', type: 'Fill', category: 'Stress' },
  { id: 5, text: 'Rate your sleep quality on average this week.', type: 'Rating', category: 'Sleep' },
  { id: 6, text: 'What activity most helped your mood this week?', type: 'MCQ', category: 'Mood' },
]

const AI_TEMPLATES = [
  {
    id: 'g1',
    text: 'On a scale of 1–10, how confident do you feel managing your emotions in stressful situations?',
    type: 'Rating',
    options: ['1 (Not at all)', '5 (Moderately)', '10 (Very confident)'],
  },
  {
    id: 'g2',
    text: 'Which of the following best describes your primary coping strategy?',
    type: 'MCQ',
    options: ['Physical exercise', 'Talking to someone', 'Journaling', 'Distraction activities'],
  },
  {
    id: 'g3',
    text: 'I feel supported by people around me when I am going through a difficult time.',
    type: 'True/False',
    options: ['True', 'False'],
  },
]

const TYPE_COLORS = {
  Rating: { bg: 'rgba(59,130,246,0.12)', text: '#60A5FA' },
  MCQ: { bg: 'rgba(139,92,246,0.12)', text: '#A78BFA' },
  Fill: { bg: 'rgba(240,180,41,0.12)', text: '#F0B429' },
  'True/False': { bg: 'rgba(45,212,160,0.12)', text: '#2DD4A0' },
}

function TypeBadge({ type }) {
  const { bg, text } = TYPE_COLORS[type] || { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.4)' }
  return (
    <span
      className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
      style={{ background: bg, color: text }}
    >
      {type}
    </span>
  )
}

export default function AdminQuestions() {
  const [activeNav, setActiveNav] = useState('Screenings')
  const [topic, setTopic] = useState('')
  const [qType, setQType] = useState('MCQ')
  const [count, setCount] = useState(3)
  const [previews, setPreviews] = useState([])
  const [generating, setGenerating] = useState(false)
  const [approvedIds, setApprovedIds] = useState(new Set())
  const [filter, setFilter] = useState('All')

  function handleGenerate() {
    if (!topic.trim()) return
    setGenerating(true)
    setPreviews([])
    setTimeout(() => {
      setPreviews(AI_TEMPLATES.slice(0, Math.min(count, AI_TEMPLATES.length)))
      setGenerating(false)
    }, 900)
  }

  function approveCard(id) {
    setApprovedIds(s => new Set([...s, id]))
  }

  function discardCard(id) {
    setPreviews(p => p.filter(q => q.id !== id))
    setApprovedIds(s => { const n = new Set(s); n.delete(id); return n })
  }

  function approveAll() {
    setApprovedIds(new Set(previews.map(p => p.id)))
  }

  const filtered = filter === 'All'
    ? QUESTION_BANK
    : QUESTION_BANK.filter(q => q.type === filter)

  return (
    <div className="min-h-screen" style={{ background: '#0B0F0E' }}>
      <Topbar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* AI Generator Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(45,212,160,0.10)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#2DD4A0' }} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">Generate with AI</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Describe a topic and let AI draft screening questions
              </p>
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="e.g. Resilience and emotional regulation strategies for adults with chronic stress…"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="input resize-none mb-4 text-sm"
          />

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[140px]">
              <select
                value={qType}
                onChange={e => setQType(e.target.value)}
                className="input appearance-none pr-8 text-sm"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                {QUESTION_TYPES.map(t => <option key={t} style={{ background: '#0F1715' }}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
            </div>

            <input
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={e => setCount(Number(e.target.value))}
              className="input w-20 text-center text-sm"
            />

            <button
              onClick={handleGenerate}
              disabled={generating || !topic.trim()}
              className="btn-mint disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              {generating ? 'Generating…' : 'Generate'}
            </button>
          </div>
        </motion.div>

        {/* Preview Cards */}
        <AnimatePresence>
          {previews.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">AI Preview</h3>
                <button
                  onClick={approveAll}
                  className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  style={{ color: '#2DD4A0' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#5EEAC0'}
                  onMouseLeave={e => e.currentTarget.style.color = '#2DD4A0'}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve all ({previews.length})
                </button>
              </div>

              <div className="space-y-3">
                {previews.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="glass-card p-5"
                    style={approvedIds.has(q.id) ? { borderColor: 'rgba(45,212,160,0.35)' } : {}}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <TypeBadge type={q.type} />
                      <p className="text-sm font-medium text-white leading-relaxed flex-1">{q.text}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {q.options.map((opt, j) => (
                        <span
                          key={j}
                          className="text-xs px-3 py-1 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                          {opt}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {approvedIds.has(q.id) ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#2DD4A0' }}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      ) : (
                        <button
                          onClick={() => approveCard(q.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                          style={{ background: 'rgba(45,212,160,0.12)', color: '#2DD4A0' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(45,212,160,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(45,212,160,0.12)'}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => discardCard(q.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-colors"
                        style={{ color: '#E5534B' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229,83,75,0.10)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Discard
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Bank */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-white">Question Bank</h2>
            <button
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(45,212,160,0.3)'; e.currentTarget.style.color = '#2DD4A0' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add question
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 flex-wrap mb-4">
            {FILTER_CHIPS.map(chip => (
              <button
                key={chip}
                onClick={() => setFilter(chip)}
                className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
                style={filter === chip
                  ? { background: 'rgba(45,212,160,0.15)', color: '#2DD4A0', borderColor: 'rgba(45,212,160,0.3)' }
                  : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.08)' }
                }
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(45,212,160,0.08)' }}>
                  <th className="px-5 py-3 text-left label-eyebrow">Question</th>
                  <th className="px-4 py-3 text-left label-eyebrow w-28">Type</th>
                  <th className="px-4 py-3 text-left label-eyebrow w-32">Category</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, i) => (
                  <motion.tr
                    key={q.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-5 py-4 leading-snug" style={{ color: 'rgba(255,255,255,0.7)' }}>{q.text}</td>
                    <td className="px-4 py-4">
                      <TypeBadge type={q.type} />
                    </td>
                    <td className="px-4 py-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{q.category}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
