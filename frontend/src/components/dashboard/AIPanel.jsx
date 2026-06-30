import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Files, BarChart2, Mic, ArrowUp } from 'lucide-react'

const TABS = [
  { id: 'files', label: 'Files', Icon: Files },
  { id: 'reports', label: 'Reports', Icon: BarChart2 },
  { id: 'voice', label: 'Voice', Icon: Mic },
]

function UserMessage({ msg }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center text-[9px] font-bold text-mint shrink-0 mt-0.5">
        A
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-semibold text-ink">{msg.name}</span>
          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{msg.text}</p>
      </div>
    </div>
  )
}

function AIMessage({ msg }) {
  return (
    <div className="pl-1">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-4 h-4 rounded-md bg-mint flex items-center justify-center text-[9px] text-white font-bold leading-none">
          ✦
        </div>
        <span className="text-xs font-semibold text-mint-dark">AI Assistant</span>
        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
      </div>

      <div className="bg-[#F8FDF9] border border-mint-light rounded-xl p-3">
        <p className="text-xs font-semibold text-ink mb-2.5">{msg.title}</p>
        <div className="flex flex-col gap-2.5">
          {msg.rows.map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-500">{row.label}</span>
                <span
                  className="text-[11px] font-bold"
                  style={{ color: row.color }}
                >
                  {row.value}
                </span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${row.progress}%`,
                    backgroundColor: row.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AIPanel({ messages = [] }) {
  const [activeTab, setActiveTab] = useState('files')
  const [input, setInput] = useState('')

  function handleSend() {
    if (!input.trim()) return
    setInput('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="flex flex-col bg-white rounded-2xl overflow-hidden"
      style={{ height: 'calc(100vh - 88px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-ink shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-mint rounded-md flex items-center justify-center text-ink text-xs font-black leading-none">
            ✦
          </div>
          <span className="text-sm font-semibold text-white">AI Assistant</span>
        </div>
        <button className="p-1 rounded hover:bg-white/10 transition-colors duration-150">
          <ChevronRight size={14} className="text-white/60" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 min-h-0">
        {messages.map((msg) =>
          msg.type === 'user' ? (
            <UserMessage key={msg.id} msg={msg} />
          ) : (
            <AIMessage key={msg.id} msg={msg} />
          )
        )}
      </div>

      {/* Tab bar */}
      <div className="bg-surface-soft border-t border-border px-3 py-2 flex items-center gap-1 shrink-0">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              activeTab === id
                ? 'bg-ink text-white'
                : 'text-slate-400 hover:text-ink hover:bg-slate-100'
            }`}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 shrink-0">
        <div className="flex items-center gap-2 bg-[#F0F2F7] rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-mint transition-all duration-150">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 text-xs bg-transparent outline-none border-0 text-ink placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            className="w-6 h-6 rounded-full bg-ink flex items-center justify-center hover:bg-ink/80 transition-colors duration-150 shrink-0"
          >
            <ArrowUp size={11} className="text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
