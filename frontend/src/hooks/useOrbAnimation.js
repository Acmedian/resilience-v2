import { useEffect, useRef, useState } from 'react'

function wave(t, period, min, max, phaseOffset = 0) {
  const mid = (min + max) / 2
  const amp = (max - min) / 2
  return mid + amp * Math.sin((2 * Math.PI * t) / period + phaseOffset)
}

export function useOrbAnimation(state) {
  const [scales, setScales] = useState({ outerScale: 1, middleScale: 1, innerScale: 1 })
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (state === 'idle') {
      setScales({ outerScale: 1, middleScale: 1, innerScale: 1 })
      return
    }

    startRef.current = performance.now()

    function tick(now) {
      const t = (now - startRef.current) / 1000

      if (state === 'speaking') {
        setScales({
          outerScale: wave(t, 1.8, 0.95, 1.08, 0),
          middleScale: wave(t, 1.8, 0.97, 1.05, 0.6),
          innerScale: wave(t, 1.8, 0.98, 1.03, 1.2),
        })
      } else {
        // listening: single slow pulse shared by all rings
        const scale = wave(t, 3, 1.0, 1.02)
        setScales({ outerScale: scale, middleScale: scale, innerScale: scale })
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [state])

  return scales
}
