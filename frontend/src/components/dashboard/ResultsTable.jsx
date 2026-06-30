import { Flag, Download } from 'lucide-react'

function ScoreBadge({ score }) {
  if (score > 70) {
    return (
      <span
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
        style={{ background: 'rgba(45,212,160,0.12)', color: '#2DD4A0' }}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#2DD4A0' }} />
        {score}
      </span>
    )
  }
  if (score >= 40) {
    return (
      <span
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
        style={{ background: 'rgba(240,180,41,0.12)', color: '#F0B429' }}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#F0B429' }} />
        {score}
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
      style={{ background: 'rgba(229,83,75,0.12)', color: '#E5534B' }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#E5534B' }} />
      {score}
    </span>
  )
}

function exportCSV(rows) {
  const header = 'Patient,Screening,Score,Category,Date'
  const lines = rows.map(
    (r) => `${r.patient},${r.screening},${r.score},${r.category},${r.date}`
  )
  const csv = [header, ...lines].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = 'screening-results.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function ResultsTable({ results = [] }) {
  return (
    <div className="glass-card overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: '1px solid rgba(45,212,160,0.08)' }}
      >
        <h3 className="text-sm font-semibold text-white">Recent Results</h3>
        <button
          onClick={() => exportCSV(results)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{ background: 'rgba(45,212,160,0.12)', color: '#2DD4A0' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(45,212,160,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(45,212,160,0.12)'}
        >
          <Download size={12} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th className="text-left px-5 py-2.5 label-eyebrow">Patient</th>
              <th className="text-left px-5 py-2.5 label-eyebrow">Screening</th>
              <th className="text-left px-5 py-2.5 label-eyebrow">Score</th>
              <th className="text-left px-5 py-2.5 label-eyebrow">Category</th>
              <th className="text-left px-5 py-2.5 label-eyebrow">Date</th>
              <th className="text-left px-5 py-2.5 label-eyebrow">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr
                key={r.id}
                className="transition-colors duration-150"
                style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td className="px-5 py-3 font-medium text-white">{r.patient}</td>
                <td className="px-5 py-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{r.screening}</td>
                <td className="px-5 py-3">
                  <ScoreBadge score={r.score} />
                </td>
                <td className="px-5 py-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{r.category}</td>
                <td className="px-5 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{r.date}</td>
                <td className="px-5 py-3">
                  {r.hasOpenEnded && (
                    <button
                      className="p-1 rounded-md transition-colors duration-150"
                      title="Manual review required"
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,180,41,0.12)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Flag size={13} style={{ color: '#F0B429' }} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
