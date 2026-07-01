import { Upload } from 'lucide-react'

function McqQuestion({ question, value, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-3">
      {question.options.map(option => {
        const selected = value === option
        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option)}
            className="glass-card w-full flex items-center gap-3 p-4 text-left transition-all duration-200"
            style={{
              borderColor: selected ? 'rgba(45,212,160,0.5)' : undefined,
              background: selected ? 'rgba(45,212,160,0.05)' : undefined,
              cursor: disabled ? 'default' : 'pointer',
            }}
            onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(45,212,160,0.3)' }}
            onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = '' }}
          >
            <span
              className="shrink-0 rounded-full flex items-center justify-center"
              style={{
                width: 24,
                height: 24,
                border: `2px solid ${selected ? '#2DD4A0' : 'rgba(255,255,255,0.25)'}`,
              }}
            >
              {selected && <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#2DD4A0' }} />}
            </span>
            <span className="text-sm font-medium text-white">{option}</span>
          </button>
        )
      })}
    </div>
  )
}

function RatingQuestion({ value, onChange, disabled }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => {
          const selected = value === n
          return (
            <button
              key={n}
              type="button"
              disabled={disabled}
              onClick={() => onChange(n)}
              className="rounded-xl transition-all duration-200 font-bold"
              style={{
                width: 40,
                height: 40,
                background: selected ? '#2DD4A0' : 'rgba(255,255,255,0.05)',
                color: selected ? '#06231B' : 'rgba(255,255,255,0.6)',
                fontWeight: selected ? 900 : 600,
                cursor: disabled ? 'default' : 'pointer',
              }}
              onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="flex items-center justify-between mt-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
        <span>Not at all</span>
        <span>Completely</span>
      </div>
    </div>
  )
}

function FillQuestion({ value, onChange, disabled }) {
  return (
    <textarea
      rows={3}
      disabled={disabled}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder="Type your response…"
      className="w-full resize-none rounded-xl text-sm outline-none transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.8)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '12px 14px',
      }}
      onFocus={e => { e.currentTarget.style.borderColor = '#2DD4A0'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,212,160,0.12)' }}
      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
    />
  )
}

function TrueFalseQuestion({ value, onChange, disabled }) {
  const options = [
    { key: true, letter: 'T', label: 'True', color: '#2DD4A0' },
    { key: false, letter: 'F', label: 'False', color: '#E5534B' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(opt => {
        const selected = value === opt.key
        return (
          <button
            key={opt.label}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.key)}
            className="glass-card flex flex-col items-center justify-center gap-2 py-8 transition-all duration-200"
            style={{
              borderLeft: selected ? `4px solid ${opt.color}` : undefined,
              background: selected ? `${opt.color}14` : undefined,
              cursor: disabled ? 'default' : 'pointer',
            }}
          >
            <span className="text-3xl font-black" style={{ color: selected ? opt.color : 'rgba(255,255,255,0.4)' }}>{opt.letter}</span>
            <span className="text-sm font-semibold" style={{ color: selected ? opt.color : 'rgba(255,255,255,0.6)' }}>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function FileQuestion({ value, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange('attachment-uploaded')}
      className="w-full flex flex-col items-center justify-center gap-3 rounded-xl transition-all duration-200"
      style={{
        padding: '32px 16px',
        border: `1.5px dashed ${value ? 'rgba(45,212,160,0.5)' : 'rgba(255,255,255,0.15)'}`,
        background: value ? 'rgba(45,212,160,0.05)' : 'transparent',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <Upload size={22} color="#2DD4A0" />
      <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {value ? 'Attachment added' : 'Tap to upload or take photo'}
      </span>
    </button>
  )
}

export default function QuestionRenderer({ question, value, onChange, disabled }) {
  switch (question.type) {
    case 'mcq':
      return <McqQuestion question={question} value={value} onChange={onChange} disabled={disabled} />
    case 'rating':
      return <RatingQuestion value={value} onChange={onChange} disabled={disabled} />
    case 'fill':
      return <FillQuestion value={value} onChange={onChange} disabled={disabled} />
    case 'truefalse':
      return <TrueFalseQuestion value={value} onChange={onChange} disabled={disabled} />
    case 'file':
      return <FileQuestion value={value} onChange={onChange} disabled={disabled} />
    default:
      return null
  }
}
