import { Mic, Radio } from 'lucide-react'
import { useOrbAnimation } from '../../hooks/useOrbAnimation'

const RINGS = [
  { radius: 85, stroke: 'rgba(45,212,160,0.15)', strokeWidth: 1, key: 'outerScale' },
  { radius: 68, stroke: 'rgba(45,212,160,0.25)', strokeWidth: 1.5, key: 'middleScale' },
  { radius: 51, stroke: 'rgba(45,212,160,0.4)', strokeWidth: 2, key: 'innerScale' },
]

const CENTER_STYLE = {
  speaking: { background: '#2DD4A0', boxShadow: '0 0 40px rgba(45,212,160,0.5)' },
  listening: { background: '#1A6B5A', boxShadow: 'none' },
  idle: { background: 'rgba(255,255,255,0.1)', boxShadow: 'none' },
}

const STATUS_TEXT = {
  speaking: { text: 'Speaking...', style: { color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' } },
  listening: { text: 'Listening — respond now', style: { color: '#2DD4A0', fontWeight: 500 } },
  idle: { text: 'Tap to start', style: { color: 'rgba(255,255,255,0.3)' } },
}

export default function VoiceOrb({ state, onToggle }) {
  const { outerScale, middleScale, innerScale } = useOrbAnimation(state)
  const scaleByKey = { outerScale, middleScale, innerScale }
  const status = STATUS_TEXT[state] || STATUS_TEXT.idle

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: 180, height: 180, cursor: onToggle ? 'pointer' : 'default' }}
        onClick={onToggle}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" className="absolute inset-0">
          {RINGS.map(ring => (
            <circle
              key={ring.key}
              cx={90}
              cy={90}
              r={ring.radius}
              fill="none"
              stroke={ring.stroke}
              strokeWidth={ring.strokeWidth}
              style={{
                transform: `scale(${scaleByKey[ring.key]})`,
                transformOrigin: 'center',
                transformBox: 'fill-box',
              }}
            />
          ))}
        </svg>

        <div
          className="relative rounded-full flex items-center justify-center transition-all duration-200"
          style={{ width: 80, height: 80, ...CENTER_STYLE[state] }}
        >
          {state === 'speaking' && <Mic size={28} color="#06231B" />}
          {state === 'listening' && <Radio size={28} color="#2DD4A0" />}
          {state === 'idle' && <Mic size={28} color="rgba(255,255,255,0.3)" />}
        </div>
      </div>

      <span className="mt-4 text-xs" style={status.style}>{status.text}</span>
    </div>
  )
}
