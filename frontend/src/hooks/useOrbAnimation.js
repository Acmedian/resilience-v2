import { useEffect, useRef, useState } from 'react'

export function useOrbAnimation(state) {
  const [rings, setRings] = useState([
    { scale: 1, opacity: 0.5 },
    { scale: 1, opacity: 0.35 },
    { scale: 1, opacity: 0.2 },
  ])
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    startRef.current = performance.now()

    function tick(now) {
      const t = (now - startRef.current) / 1000

      if (state === 'speaking') {
        // 3 rings with different sin-wave phases, 1.8s period
        const period = 1.8
        setRings([
          {
            scale: 1 + 0.15 * Math.sin((2 * Math.PI * t) / period),
            opacity: 0.6 + 0.2 * Math.sin((2 * Math.PI * t) / period),
          },
          {
            scale: 1 + 0.12 * Math.sin((2 * Math.PI * t) / period + (Math.PI * 2) / 3),
            opacity: 0.45 + 0.15 * Math.sin((2 * Math.PI * t) / period + (Math.PI * 2) / 3),
          },
          {
            scale: 1 + 0.1 * Math.sin((2 * Math.PI * t) / period + (Math.PI * 4) / 3),
            opacity: 0.3 + 0.1 * Math.sin((2 * Math.PI * t) / period + (Math.PI * 4) / 3),
          },
        ])
      } else {
        // listening: 1 ring slow pulse, 3s period
        const period = 3
        const pulse = 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / period)
        setRings([
          { scale: 1 + 0.06 * pulse, opacity: 0.4 + 0.2 * pulse },
          { scale: 1, opacity: 0.2 },
          { scale: 1, opacity: 0.1 },
        ])
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [state])

  return rings
}
