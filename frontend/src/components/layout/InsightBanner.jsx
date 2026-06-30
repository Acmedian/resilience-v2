import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, X } from 'lucide-react'

export default function InsightBanner({ children }) {
  const [dismissed, setDismissed] = useState(false)

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="insight-glow flex items-center gap-3"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(45,212,160,0.12)' }}
          >
            <Zap size={14} style={{ color: '#2DD4A0' }} fill="#2DD4A0" strokeWidth={0} />
          </div>

          <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {children}
          </p>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md transition-colors duration-150 shrink-0"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
