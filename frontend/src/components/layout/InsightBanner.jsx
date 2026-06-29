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
          className="insight-glow rounded-2xl px-4 py-3 flex items-center gap-3"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-mint/20 shrink-0">
            <Zap size={13} className="text-mint-dark" fill="#0D9488" />
          </div>

          <p className="text-sm text-ink flex-1 leading-relaxed">{children}</p>

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
