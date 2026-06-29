import { useEffect, useRef, useState } from 'react'

function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4)
}

export function useAnimatedNumber(target, duration = 800) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const fromRef = useRef(0)

  useEffect(() => {
    fromRef.current = current
    startRef.current = null

    function tick(timestamp) {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuart(progress)
      const value = fromRef.current + (target - fromRef.current) * eased

      setCurrent(Math.round(value))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return current
}
