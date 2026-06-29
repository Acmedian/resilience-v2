import { Link, useNavigate } from 'react-router-dom'
import { Zap, Bell, User, ChevronDown, LayoutDashboard, FileQuestion, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Logo = () => (
  <Link to="/home" className="flex items-center gap-2 select-none">
    <div className="w-8 h-8 rounded-xl bg-ink flex items-center justify-center">
      <Zap className="w-4 h-4 text-mint" fill="#2DD4A0" strokeWidth={0} />
    </div>
    <span className="font-bold text-[15px] text-ink tracking-tight">Resilience</span>
  </Link>
)

export default function Topbar({ variant = 'user', userName = 'Priya S.', onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: FileQuestion, label: 'Questions', href: '/admin/questions' },
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-text hover:bg-surface-border hover:text-ink transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-border transition-colors relative">
            <Bell className="w-4 h-4 text-slate-text" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-mint" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl hover:bg-border transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-mint-light flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-mint-dark" />
              </div>
              <span className="text-sm font-medium text-ink">{userName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-text" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 card py-1 z-50"
                >
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/login') }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
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
