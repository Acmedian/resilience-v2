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
          <div className="w-8 h-8 rounded-full bg-mint-light flex items-center justify-center flex-shrink-0">
            <Zap size={14} className="text-mint-dark" fill="#0D9488" />
          </div>

          <p className="text-sm leading-relaxed text-text-secondary flex-1 [&_strong]:text-ink [&_strong]:font-black">{children}</p>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md hover:bg-mint/20 transition-colors duration-150 shrink-0"
          >
            <X size={13} className="text-slate-400" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
