import { useState } from 'react'
import Topbar from '../components/layout/Topbar'
import AIPanel from '../components/dashboard/AIPanel'

/* ── Card background helpers ────────────────────────────────────────────────
 * The 4 small cards sit in a 2×2 grid. Each card's radial glow faces INWARD
 * (toward the shared corner of all 4 cards), so the glows converge into one
 * continuous circular halo at the centre of the 2×2 block.
 *
 *   Active Patients  (col2 row1) → glow at bottom-right  (100% 100%)
 *   Surveys Completed(col3 row1) → glow at bottom-left   (0%   100%)
 *   High Risk Flags  (col2 row2) → glow at top-right     (100% 0%)
 *   Survey Particip. (col3 row2) → glow at top-left      (0%   0%)
 */
const BG = {
  activePatients: [
    'repeating-radial-gradient(circle at 100% 104%,rgba(45,212,160,0.07) 0 1.5px,transparent 1.5px 24px)',
    'radial-gradient(55% 50% at 100% 100%,rgba(45,212,160,0.44),transparent 55%)',
    'radial-gradient(120% 110% at 105% 92%,rgba(45,212,160,0.20),transparent 55%)',
    'radial-gradient(90% 90% at 108% -12%,rgba(45,212,160,0.13),transparent 48%)',
    '#0A1628',
  ].join(','),
  surveys: [
    'repeating-radial-gradient(circle at 0% 104%,rgba(45,212,160,0.07) 0 1.5px,transparent 1.5px 24px)',
    'radial-gradient(55% 50% at 0% 100%,rgba(45,212,160,0.44),transparent 55%)',
    'radial-gradient(120% 110% at -5% 92%,rgba(45,212,160,0.20),transparent 55%)',
    'radial-gradient(90% 90% at -8% -12%,rgba(45,212,160,0.13),transparent 48%)',
    '#0A1628',
  ].join(','),
  highRisk: [
    'repeating-radial-gradient(circle at 100% -4%,rgba(45,212,160,0.07) 0 1.5px,transparent 1.5px 24px)',
    'radial-gradient(55% 50% at 100% 0%,rgba(45,212,160,0.40),transparent 55%)',
    'radial-gradient(120% 110% at 105% 8%,rgba(45,212,160,0.18),transparent 55%)',
    'radial-gradient(90% 90% at 108% 112%,rgba(45,212,160,0.12),transparent 48%)',
    '#0A1628',
  ].join(','),
  participation: [
    'repeating-radial-gradient(circle at 0% -4%,rgba(45,212,160,0.07) 0 1.5px,transparent 1.5px 24px)',
    'radial-gradient(55% 50% at 0% 0%,rgba(45,212,160,0.44),transparent 55%)',
    'radial-gradient(120% 110% at -5% 8%,rgba(45,212,160,0.20),transparent 55%)',
    'radial-gradient(90% 90% at -8% 112%,rgba(45,212,160,0.13),transparent 48%)',
    '#0A1628',
  ].join(','),
}

const SMALL_CARD_BASE = {
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 20,
  padding: 22,
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.06)',
  boxShadow: '0 1px 2px rgba(10,22,40,0.18),0 16px 32px -8px rgba(10,22,40,0.42)',
  transition: 'transform .25s cubic-bezier(.4,0,.2,1),box-shadow .25s cubic-bezier(.4,0,.2,1)',
}
const HOVER_IN  = { transform: 'translateY(-4px)', boxShadow: '0 2px 6px rgba(10,22,40,0.22),0 30px 52px -12px rgba(10,22,40,0.55)' }
const HOVER_OUT = { transform: '', boxShadow: SMALL_CARD_BASE.boxShadow }

/* scale 50-90 → 0-100% */
const toBarPct = score => ((score - 50) / 40) * 100

/* ── Animated cohort bar ─────────────────────────────────────────────────── */
function CohortBar({ score, barGradient, sheenDelay, growDuration, tipColor, tipShadow }) {
  const pct = toBarPct(score)
  return (
    <div style={{ position: 'relative', height: 46, borderRadius: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
      {/* threshold dashed line — 75 on scale 50-90 = 62.5% */}
      <span style={{ position: 'absolute', left: '62.5%', top: 0, bottom: 0, width: 0, borderLeft: '2px dashed rgba(255,255,255,0.3)', zIndex: 3 }} />
      {/* filled gradient bar with grow-in animation */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 13, background: barGradient, boxShadow: '0 0 28px rgba(45,212,160,0.45),inset 0 1px 0 rgba(255,255,255,0.18)', transformOrigin: 'left center', animation: `growbar ${growDuration} cubic-bezier(.2,.7,.2,1) both` }}>
        {/* sheen highlight */}
        <span style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 46, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)', animation: `barsheen 3.6s ease-in-out ${sheenDelay} infinite` }} />
      </div>
      {/* glowing tip marker */}
      <span style={{ position: 'absolute', left: `${pct}%`, top: -3, bottom: -3, width: 3, transform: 'translateX(-50%)', background: tipColor, borderRadius: 3, boxShadow: tipShadow, zIndex: 2 }} />
      {/* score overlaid inside bar on right */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 16, zIndex: 2 }}>
        <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 8px rgba(10,22,40,0.6)' }}>{score}</span>
      </div>
    </div>
  )
}

const COHORTS = [
  { num: 1, initials: 'CB', name: 'CBT Program',       sub: '82 patients',  score: 78.6, trend: '8.2', isLeading: true,
    avatarBg: 'rgba(45,212,160,0.16)', avatarColor: '#2DD4A0', avatarBorder: '1px solid rgba(45,212,160,0.3)', avatarGlow: '0 0 18px rgba(45,212,160,0.35)',
    badgeBg: '#2DD4A0', badgeColor: '#06352a',
    barGradient: 'linear-gradient(90deg,rgba(45,212,160,0.14),rgba(45,212,160,0.42) 55%,rgba(45,212,160,0.9))',
    tipColor: '#EAFFF7', tipShadow: '0 0 14px 3px rgba(45,212,160,0.9)', sheenDelay: '0s', growDuration: '1.1s' },
  { num: 2, initials: 'MG', name: 'Mindfulness Group', sub: '64 patients',  score: 74.1, trend: '3.1', isLeading: false,
    avatarBg: 'rgba(255,255,255,0.06)', avatarColor: 'rgba(255,255,255,0.8)', avatarBorder: '1px solid rgba(255,255,255,0.08)', avatarGlow: 'none',
    badgeBg: '#1a2942', badgeColor: 'rgba(255,255,255,0.7)',
    barGradient: 'linear-gradient(90deg,rgba(45,212,160,0.1),rgba(45,212,160,0.32) 60%,rgba(45,212,160,0.7))',
    tipColor: '#CFFCEC', tipShadow: '0 0 12px 2px rgba(45,212,160,0.7)', sheenDelay: '0.6s', growDuration: '1.2s' },
  { num: 3, initials: 'SG', name: 'Self-Guided',       sub: '102 patients', score: 71.2, trend: '1.8', isLeading: false,
    avatarBg: 'rgba(255,255,255,0.06)', avatarColor: 'rgba(255,255,255,0.8)', avatarBorder: '1px solid rgba(255,255,255,0.08)', avatarGlow: 'none',
    badgeBg: '#1a2942', badgeColor: 'rgba(255,255,255,0.7)',
    barGradient: 'linear-gradient(90deg,rgba(45,212,160,0.08),rgba(45,212,160,0.26) 60%,rgba(45,212,160,0.58))',
    tipColor: '#B6F5E1', tipShadow: '0 0 10px 2px rgba(45,212,160,0.6)', sheenDelay: '1.2s', growDuration: '1.3s' },
]

const PERIODS = ['Week', 'Month', 'Quarter']

export default function AdminDashboard() {
  const [period,      setPeriod]      = useState('Week')
  const [aiCollapsed, setAiCollapsed] = useState(false)
  const [activeNav,   setActiveNav]   = useState('Overview')

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'radial-gradient(900px 520px at 100% -8%,rgba(45,212,160,0.07),transparent 60%),radial-gradient(820px 600px at -12% 112%,rgba(10,22,40,0.05),transparent 55%),#F4F7F9', color: '#0A1628' }}>

      {/* decorative dot grid */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(16,24,40,0.05) 1px,transparent 1px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(120% 100% at 50% 30%,#000,transparent 92%)', WebkitMaskImage: 'radial-gradient(120% 100% at 50% 30%,#000,transparent 92%)' }} />

      <Topbar activeNav={activeNav} onNavChange={setActiveNav} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1500, margin: '0 auto', padding: '34px 32px 64px' }}>

        {/* ── Header row ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#0A1628' }}>Analytics Overview</h1>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, color: '#0A1628', background: 'rgba(45,212,160,0.14)', padding: '4px 9px', borderRadius: 7 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DD4A0', animation: 'onlinepulse 2.4s infinite', flexShrink: 0 }} />
                Live
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: '#667085', fontWeight: 500 }}>Patient resilience monitoring · Northside Practice · Updated 6 min ago</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Period switcher */}
            <div style={{ display: 'flex', background: '#fff', border: '1px solid rgba(16,24,40,0.08)', borderRadius: 11, padding: 3, boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
              {PERIODS.map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  style={{ fontSize: 12.5, fontWeight: period === p ? 600 : 500, color: period === p ? '#0A1628' : '#667085', padding: '6px 13px', borderRadius: 8, background: period === p ? 'rgba(16,24,40,0.05)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}
                >{p}</button>
              ))}
            </div>
            {/* Export */}
            <button
              style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 16px', border: 'none', borderRadius: 11, background: '#0A1628', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 1px 2px rgba(16,24,40,0.04),0 8px 16px -6px rgba(16,24,40,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 4px rgba(16,24,40,0.06),0 14px 24px -8px rgba(16,24,40,0.4)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 2px rgba(16,24,40,0.04),0 8px 16px -6px rgba(16,24,40,0.3)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
              Export
            </button>
          </div>
        </div>

        {/* ── Main flex: grid + AI panel ── */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'stretch', minWidth: 1320 }}>

          {/* ── 3-col stat grid ── */}
          <div style={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: '1.45fr 1fr 1fr', gap: 24, alignContent: 'start' }}>

            {/* HERO — Avg Resilience Score, col 1, rows 1+2 */}
            <div
              style={{ gridColumn: 1, gridRow: '1 / span 2', position: 'relative', overflow: 'hidden', borderRadius: 24, padding: 32, color: '#fff', background: 'radial-gradient(120% 90% at 92% 8%,rgba(45,212,160,0.30),transparent 46%),radial-gradient(90% 80% at 105% 105%,rgba(45,212,160,0.16),transparent 42%),radial-gradient(70% 70% at -8% -8%,rgba(45,212,160,0.07),transparent 55%),#0A1628', boxShadow: '0 1px 2px rgba(10,22,40,0.2),0 26px 50px -12px rgba(10,22,40,0.55)', transition: 'transform .25s cubic-bezier(.4,0,.2,1),box-shadow .25s cubic-bezier(.4,0,.2,1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(10,22,40,0.25),0 38px 64px -16px rgba(10,22,40,0.65)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 2px rgba(10,22,40,0.2),0 26px 50px -12px rgba(10,22,40,0.55)' }}
            >
              {/* animated mesh drift overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 50% at 88% 12%,rgba(45,212,160,0.22),transparent 50%)', animation: 'meshdrift 9s ease-in-out infinite', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.66)', letterSpacing: '0.01em' }}>Avg Resilience Score</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#2DD4A0', background: 'rgba(45,212,160,0.14)', padding: '5px 9px', borderRadius: 8, fontVariantNumeric: 'tabular-nums' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 15l7-7 7 7"/></svg>
                    +2.3
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 18 }}>
                  <span style={{ fontSize: 84, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>73.4</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.42)', letterSpacing: '-0.02em' }}>/100</span>
                </div>
                <span style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500, maxWidth: 240 }}>
                  Practice-wide composite across 9 resilience dimensions, up from 71.1 last week.
                </span>
                {/* sparkline */}
                <div style={{ marginTop: 'auto', paddingTop: 26 }}>
                  <svg width="100%" height="84" viewBox="0 0 320 84" preserveAspectRatio="none" style={{ display: 'block' }}>
                    <defs>
                      <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2DD4A0" stopOpacity="0.32"/>
                        <stop offset="100%" stopColor="#2DD4A0" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,62 L40,58 L80,60 L120,46 L160,50 L200,34 L240,30 L280,20 L320,12 L320,84 L0,84 Z" fill="url(#heroFill)"/>
                    <path d="M0,62 L40,58 L80,60 L120,46 L160,50 L200,34 L240,30 L280,20 L320,12" fill="none" stroke="#2DD4A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="320" cy="12" r="4.5" fill="#2DD4A0" stroke="#0A1628" strokeWidth="2.5"/>
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10.5, fontWeight: 600, color: 'rgba(255,255,255,0.34)', fontVariantNumeric: 'tabular-nums' }}>
                    <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Patients — col 2, row 1 */}
            <div style={{ ...SMALL_CARD_BASE, gridColumn: 2, gridRow: 1, background: BG.activePatients }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, HOVER_IN)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, HOVER_OUT)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.66)', marginBottom: 14 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>Active Patients</span>
              </div>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: '#fff' }}>248</div>
              <div style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                <span style={{ color: '#2DD4A0', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DD4A0', flexShrink: 0 }}/>12 new
                </span>
                <span style={{ color: 'rgba(255,255,255,0.5)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', flexShrink: 0 }}/>34 inactive
                </span>
              </div>
            </div>

            {/* Surveys Completed — col 3, row 1 */}
            <div style={{ ...SMALL_CARD_BASE, gridColumn: 3, gridRow: 1, background: BG.surveys }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, HOVER_IN)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, HOVER_OUT)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.66)', marginBottom: 14 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>Surveys Completed</span>
              </div>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: '#fff' }}>1,847</div>
              <svg width="100%" height="30" viewBox="0 0 120 30" preserveAspectRatio="none" style={{ display: 'block', marginTop: 14 }}>
                <defs>
                  <linearGradient id="surveyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2DD4A0" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#2DD4A0" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0,24 L20,22 L40,23 L60,16 L80,18 L100,10 L120,7 L120,30 L0,30 Z" fill="url(#surveyFill)"/>
                <path d="M0,24 L20,22 L40,23 L60,16 L80,18 L100,10 L120,7" fill="none" stroke="#2DD4A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* High Risk Flags — col 2, row 2 */}
            <div style={{ ...SMALL_CARD_BASE, gridColumn: 2, gridRow: 2, background: BG.highRisk }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, HOVER_IN)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, HOVER_OUT)}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#F04438,rgba(240,68,56,0.2))' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.66)', marginBottom: 14 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>High Risk Flags</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: '#FF6B5E', fontVariantNumeric: 'tabular-nums' }}>14</span>
              </div>
              <div style={{ marginTop: 14 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#F04438', background: 'rgba(240,68,56,0.10)', padding: '5px 9px', borderRadius: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F04438', flexShrink: 0 }}/>3 critical — needs review
                </span>
              </div>
            </div>

            {/* Survey Participation — col 3, row 2 */}
            <div style={{ ...SMALL_CARD_BASE, gridColumn: 3, gridRow: 2, background: BG.participation, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, HOVER_IN)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, HOVER_OUT)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.66)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14"/></svg>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>Survey Participation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                <div style={{ position: 'relative', width: 66, height: 66, flexShrink: 0 }}>
                  <svg width="66" height="66" viewBox="0 0 66 66">
                    <circle cx="33" cy="33" r="28" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="7"/>
                    <circle cx="33" cy="33" r="28" fill="none" stroke="#2DD4A0" strokeWidth="7" strokeLinecap="round" strokeDasharray="175.9" strokeDashoffset="15.5" transform="rotate(-90 33 33)"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: '#fff' }}>91.2<span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>%</span></div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginTop: 5 }}>226 of 248 responded</div>
                </div>
              </div>
            </div>

            {/* ── Resilience by Cohort — full width, row 3 ── */}
            <div style={{ gridColumn: '1 / span 3', gridRow: 3, position: 'relative', overflow: 'hidden', borderRadius: 22, padding: '28px 30px 26px', color: '#fff', background: 'repeating-radial-gradient(circle at 100% 0%,rgba(45,212,160,0.05) 0 1.5px,transparent 1.5px 26px),radial-gradient(60% 85% at 100% 0%,rgba(45,212,160,0.22),transparent 55%),radial-gradient(55% 70% at 0% 100%,rgba(45,212,160,0.10),transparent 55%),#0A1628', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 1px 2px rgba(10,22,40,0.2),0 26px 50px -12px rgba(10,22,40,0.5)' }}>

              {/* Header */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>Resilience by Cohort</h2>
                  <p style={{ margin: '5px 0 0', fontSize: 12.5, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>This week's composite by care program, measured against the healthy threshold</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ width: 13, height: 11, borderRadius: 3, background: 'linear-gradient(90deg,rgba(45,212,160,0.5),#2DD4A0)', flexShrink: 0 }}/>This week
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ width: 0, height: 13, borderLeft: '2px dashed rgba(255,255,255,0.35)', flexShrink: 0 }}/>Healthy ≥ 75
                  </div>
                </div>
              </div>

              {/* Cohort rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {COHORTS.map(c => (
                  <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 96px', alignItems: 'center', gap: 22 }}>
                    {/* Avatar + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ position: 'relative', width: 42, height: 42, borderRadius: 12, background: c.avatarBg, color: c.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, border: c.avatarBorder, boxShadow: c.avatarGlow, flexShrink: 0 }}>
                        {c.initials}
                        <span style={{ position: 'absolute', top: -7, right: -7, width: 19, height: 19, borderRadius: '50%', background: c.badgeBg, color: c.badgeColor, fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0A1628' }}>{c.num}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em' }}>{c.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
                          {c.isLeading && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2DD4A0' }}>★ Leading</span>}
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{c.sub}</span>
                        </div>
                      </div>
                    </div>
                    {/* Animated bar */}
                    <CohortBar score={c.score} barGradient={c.barGradient} tipColor={c.tipColor} tipShadow={c.tipShadow} sheenDelay={c.sheenDelay} growDuration={c.growDuration} />
                    {/* Trend */}
                    <div style={{ justifySelf: 'end', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 800, color: '#2DD4A0', fontVariantNumeric: 'tabular-nums' }}>▲ {c.trend}</div>
                      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 2 }}>vs last wk</div>
                    </div>
                  </div>
                ))}

                {/* Scale axis */}
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 96px', gap: 22, marginTop: 6 }}>
                  <div/>
                  <div style={{ position: 'relative', height: 18, borderTop: '1px solid rgba(255,255,255,0.09)' }}>
                    <span style={{ position: 'absolute', left: 0,      top: 5, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.32)', fontVariantNumeric: 'tabular-nums' }}>50</span>
                    <span style={{ position: 'absolute', left: '25%',  top: 5, transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.32)', fontVariantNumeric: 'tabular-nums' }}>60</span>
                    <span style={{ position: 'absolute', left: '50%',  top: 5, transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.32)', fontVariantNumeric: 'tabular-nums' }}>70</span>
                    <span style={{ position: 'absolute', left: '62.5%',top: 5, transform: 'translateX(-50%)', fontSize: 10, fontWeight: 800, color: 'rgba(45,212,160,0.8)', fontVariantNumeric: 'tabular-nums' }}>75</span>
                    <span style={{ position: 'absolute', left: '75%',  top: 5, transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.32)', fontVariantNumeric: 'tabular-nums' }}>80</span>
                    <span style={{ position: 'absolute', right: 0,     top: 5, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.32)', fontVariantNumeric: 'tabular-nums' }}>90</span>
                  </div>
                  <div/>
                </div>
              </div>
            </div>

          </div>{/* end grid */}

          {/* ── AI Panel ── */}
          <AIPanel collapsed={aiCollapsed} onToggle={() => setAiCollapsed(v => !v)} />

        </div>{/* end main flex */}
      </div>
    </div>
  )
}
