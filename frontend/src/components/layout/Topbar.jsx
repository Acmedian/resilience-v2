import { motion } from 'framer-motion'
import { Search, Bell, Settings, ChevronDown } from 'lucide-react'

const NAV_ITEMS = ['Overview', 'Cohorts', 'Screenings', 'Patients', 'Reports']

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
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0F1715', border: '1px solid rgba(45,212,160,0.2)' }}>
            <BrainIcon />
          </div>
          <span className="font-bold text-white text-[15px] tracking-tight">Resilience</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wide" style={{ background: 'rgba(45,212,160,0.12)', color: '#2DD4A0' }}>
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
              style={{ color: activeNav === item ? '#fff' : 'rgba(255,255,255,0.4)' }}
            >
              {activeNav === item && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'rgba(45,212,160,0.15)', border: '1px solid rgba(45,212,160,0.25)', zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item}</span>
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-150"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Search size={13} style={{ color: 'rgba(255,255,255,0.3)' }} className="shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-24 text-[13px]"
              style={{ color: '#fff' }}
            />
          </div>

          <button
            className="relative p-2 rounded-lg transition-colors duration-150"
            style={{ background: 'rgba(255,255,255,0.04)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <Bell size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-mint" />
          </button>

          <button
            className="p-2 rounded-lg transition-colors duration-150"
            style={{ background: 'rgba(255,255,255,0.04)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <Settings size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
          </button>

          <button
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl transition-colors duration-150"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(45,212,160,0.15)', color: '#2DD4A0' }}>
              A
            </div>
            <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Admin</span>
            <ChevronDown size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
          </button>
        </div>
      </div>
    </header>
  )
}
