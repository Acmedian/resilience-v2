import { motion } from 'framer-motion'
import { Search, Bell, Settings, ChevronDown } from 'lucide-react'

const NAV_ITEMS = ['Overview', 'Cohorts', 'Screenings', 'Reports']

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
    <header
      className="sticky top-0 z-50"
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-center gap-4 px-5 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: '#0D1E1A' }}
          >
            <BrainIcon />
          </div>
          <span className="font-bold text-[15px] tracking-tight" style={{ color: '#0F172A' }}>
            Resilience
          </span>
        </div>

        {/* Center nav */}
        <nav className="flex items-center gap-0.5 flex-1 justify-center">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => onNavChange(item)}
              className="relative px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors duration-150 whitespace-nowrap"
              style={{ color: activeNav === item ? '#FFFFFF' : '#6B7280' }}
            >
              {activeNav === item && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: '#0F172A', zIndex: -1 }}
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: '#F3F4F6' }}
          >
            <Search size={13} style={{ color: '#9CA3AF' }} className="shrink-0" />
            <input
              type="text"
              placeholder="Search patients..."
              className="bg-transparent outline-none w-28 text-[13px]"
              style={{ color: '#374151' }}
            />
          </div>

          <button
            className="relative p-2 rounded-lg transition-colors duration-150"
            style={{ background: '#F3F4F6' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'}
            onMouseLeave={e => e.currentTarget.style.background = '#F3F4F6'}
          >
            <Bell size={15} style={{ color: '#9CA3AF' }} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-mint" />
          </button>

          <button
            className="p-2 rounded-lg transition-colors duration-150"
            style={{ background: '#F3F4F6' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'}
            onMouseLeave={e => e.currentTarget.style.background = '#F3F4F6'}
          >
            <Settings size={15} style={{ color: '#9CA3AF' }} />
          </button>

          <button
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl transition-colors duration-150"
            style={{ background: '#F3F4F6' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'}
            onMouseLeave={e => e.currentTarget.style.background = '#F3F4F6'}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: '#0F172A', color: '#FFFFFF' }}
            >
              MK
            </div>
            <ChevronDown size={12} style={{ color: '#9CA3AF' }} />
          </button>
        </div>
      </div>
    </header>
  )
}
