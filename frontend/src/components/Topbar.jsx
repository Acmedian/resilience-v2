import { Link, useNavigate } from 'react-router-dom'
import { Zap, Bell, User, ChevronDown, LayoutDashboard, ClipboardList, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Logo = () => (
  <Link to="/home" className="flex items-center gap-2 select-none">
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center"
      style={{ background: '#0F1715', border: '1px solid rgba(45,212,160,0.2)' }}
    >
      <Zap className="w-4 h-4 text-mint" fill="#2DD4A0" strokeWidth={0} />
    </div>
    <span className="font-bold text-[15px] text-white tracking-tight">Resilience</span>
  </Link>
)

export default function Topbar({ variant = 'user', userName = 'Priya S.', onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: ClipboardList, label: 'Screenings', href: '/admin/questions' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]

  return (
    <header className="topbar-blur sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          {variant === 'admin' && (
            <nav className="hidden md:flex items-center gap-1">
              {adminLinks.map(({ icon: Icon, label, href }) => (
                <Link
                  key={href}
                  to={href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors relative"
            style={{ background: 'rgba(255,255,255,0.04)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <Bell className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-mint" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(45,212,160,0.15)' }}
              >
                <User className="w-3.5 h-3.5" style={{ color: '#2DD4A0' }} />
              </div>
              <span className="text-sm font-medium text-white">{userName}</span>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 rounded-xl py-1 z-50"
                  style={{ background: '#0F1715', border: '1px solid rgba(45,212,160,0.12)' }}
                >
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/login') }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors"
                    style={{ color: '#E5534B' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,83,75,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
