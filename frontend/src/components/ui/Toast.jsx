import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info } from 'lucide-react'

const STYLES = {
  success: { border: 'rgba(45,212,160,0.3)', color: '#2DD4A0', Icon: CheckCircle2 },
  error: { border: 'rgba(240,68,56,0.3)', color: '#FF6B5E', Icon: XCircle },
  info: { border: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)', Icon: Info },
}

export default function Toast({ message, type = 'info', onDismiss }) {
  const style = STYLES[type] || STYLES.info
  const { Icon } = style

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-card flex items-center gap-3 p-4"
      style={{ background: '#0F1715', border: `1px solid ${style.border}`, minWidth: 260, maxWidth: 360, boxShadow: '0 12px 28px -8px rgba(0,0,0,0.5)' }}
      onClick={onDismiss}
    >
      <Icon size={18} color={style.color} style={{ flexShrink: 0 }} />
      <span className="text-sm font-medium" style={{ color: '#fff', flex: 1 }}>{message}</span>
    </motion.div>
  )
}
