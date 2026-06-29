import { motion } from 'framer-motion'
import { Search, Bell, Settings, ChevronDown } from 'lucide-react'

const NAV_ITEMS = ['Overview', 'Analytics', 'Surveys', 'Questions', 'Users', 'Medical Scribe']

function BrainIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 3C6.24 3 4 5.24 4 8v.17A3 3 0 0 0 2 11v2a3 3 0 0 0 3 3h1v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3h1a3 3 0 0 0 3-3v-2a3 3 0 0 0-2-2.83V8c0-2.76-2.24-5-5-5H9z"
        stroke="#2DD4A0"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M12 8v8M9.5 10v4M14.5 10v4"
        stroke="#2DD4A0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Topbar({ activeNav, onNavChange }) {
  return (
    <header className="sticky top-0 z-50 topbar-blur">
      <div className="flex items-center gap-4 px-5 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-ink flex items-center justify-center">
            <BrainIcon />
          </div>
          <span className="font-bold text-ink text-[15px] tracking-tight">Resilience</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-ink text-mint tracking-wide">
            Admin
          </span>
        </div>

        {/* Center nav */}
        <nav className="flex items-center gap-0.5 flex-1 justify-center">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => onNavChange(item)}
              className="relative px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors duration-150 whitespace-nowrap"
              style={{ color: activeNav === item ? '#fff' : '#64748B' }}
            >
              {activeNav === item && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{ zIndex: -1 }}
                />
              )}
              <span className="relative z-10">{item}</span>
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-transparent focus-within:border-mint/30 transition-colors duration-150">
            <Search size={13} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-ink placeholder:text-slate-400 w-24 text-[13px]"
            />
          </div>

          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors duration-150">
            <Bell size={15} className="text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-mint" />
          </button>

          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-150">
            <Settings size={15} className="text-slate-500" />
          </button>

          <button className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors duration-150 border border-transparent hover:border-border">
            <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center text-[10px] font-bold text-mint">
              A
            </div>
            <span className="text-[13px] font-medium text-ink">Admin</span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  )
}
