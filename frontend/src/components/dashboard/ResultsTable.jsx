import { Flag, Download } from 'lucide-react'

function ScoreBadge({ score }) {
  if (score > 70) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-mint-light text-mint-dark">
        <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block" />
        {score}
      </span>
    )
  }
  if (score >= 40) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
        {score}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
      {score}
    </span>
  )
}

function exportCSV(rows) {
  const header = 'Participant,Survey,Score,Category,Date'
  const lines = rows.map(
    (r) => `${r.participant},${r.survey},${r.score},${r.category},${r.date}`
  )
  const csv = [header, ...lines].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = 'results.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function ResultsTable({ results = [] }) {
  return (
    <div className="bg-white border border-border rounded-2xl shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <h3 className="text-sm font-semibold text-ink">Recent Results</h3>
        <button
          onClick={() => exportCSV(results)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink/90 transition-colors duration-150"
        >
          <Download size={12} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
              <th className="text-left px-5 py-2.5">Participant</th>
              <th className="text-left px-5 py-2.5">Survey</th>
              <th className="text-left px-5 py-2.5">Score</th>
              <th className="text-left px-5 py-2.5">Category</th>
              <th className="text-left px-5 py-2.5">Date</th>
              <th className="text-left px-5 py-2.5">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr
                key={r.id}
                className="border-t border-border hover:bg-surface-soft transition-colors duration-150"
              >
                <td className="px-5 py-3 font-medium text-ink">{r.participant}</td>
                <td className="px-5 py-3 text-slate-500">{r.survey}</td>
                <td className="px-5 py-3">
                  <ScoreBadge score={r.score} />
                </td>
                <td className="px-5 py-3 text-slate-500">{r.category}</td>
                <td className="px-5 py-3 text-slate-400 text-xs">{r.date}</td>
                <td className="px-5 py-3">
                  {r.hasOpenEnded && (
                    <button
                      className="p-1 rounded-md hover:bg-amber-50 transition-colors duration-150"
                      title="Manual review required"
                    >
                      <Flag size={13} className="text-amber-500" />
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
