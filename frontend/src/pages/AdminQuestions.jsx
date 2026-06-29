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
  Rating: 'bg-blue-50 text-blue-600',
  MCQ: 'bg-purple-50 text-purple-600',
  Fill: 'bg-amber-50 text-amber-600',
  'True/False': 'bg-mint-light text-mint-dark',
}

export default function AdminQuestions() {
  const [activeNav, setActiveNav] = useState('Questions')
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
    <div className="min-h-screen bg-surface-soft">
      <Topbar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* AI Generator Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-mint-light flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-mint" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-ink">Generate with AI</h2>
              <p className="text-xs text-slate-400">Describe a topic and let AI draft questions</p>
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
              >
                {QUESTION_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
              className="btn-mint disabled:opacity-50 disabled:cursor-not-allowed"
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
                <h3 className="text-sm font-semibold text-ink">AI Preview</h3>
                <button
                  onClick={approveAll}
                  className="flex items-center gap-1.5 text-xs font-semibold text-mint-dark hover:text-ink transition-colors"
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
                    className={`card p-5 transition-colors ${
                      approvedIds.has(q.id) ? 'border-mint/40 bg-mint-light/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[q.type] || 'bg-gray-100 text-gray-600'}`}>
                        {q.type}
                      </span>
                      <p className="text-sm font-medium text-ink leading-relaxed flex-1">{q.text}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {q.options.map((opt, j) => (
                        <span key={j} className="text-xs bg-surface-soft text-slate-500 border border-border px-3 py-1 rounded-lg">
                          {opt}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {approvedIds.has(q.id) ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-mint-mid">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      ) : (
                        <button
                          onClick={() => approveCard(q.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-ink text-mint hover:bg-ink/80 rounded-xl transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => discardCard(q.id)}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
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
            <h2 className="text-[15px] font-bold text-ink">Question Bank</h2>
            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-border-strong hover:border-mint hover:text-mint-dark transition-colors">
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
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  filter === chip
                    ? 'bg-ink text-mint border-ink'
                    : 'bg-white text-slate-500 border-border-strong hover:border-mint hover:text-mint-dark'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-soft border-b border-border text-left">
                  <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Question</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-28">Type</th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-32">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((q, i) => (
                  <motion.tr
                    key={q.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-surface-soft transition-colors"
                  >
                    <td className="px-5 py-4 text-ink leading-snug">{q.text}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${TYPE_COLORS[q.type] || 'bg-gray-100 text-gray-600'}`}>
                        {q.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-xs">{q.category}</td>
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
