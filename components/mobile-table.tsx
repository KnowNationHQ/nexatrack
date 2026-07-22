import { ReactNode } from "react"

interface Col {
  label: string
  key: string
  render?: (item: any) => ReactNode
}

export function MobileTable({ cols, data, onRowClick }: { cols: Col[]; data: any[]; onRowClick?: (item: any) => void }) {
  return (
    <div>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left" style={{borderColor:'var(--card-border)',color:'var(--text-muted)'}}>
              {cols.map((c) => <th key={c.key} className="pb-3 pr-4 font-medium">{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.id || i} className={`border-b hover:opacity-80 ${onRowClick ? "cursor-pointer" : ""}`} onClick={() => onRowClick?.(item)} style={{borderColor:'var(--card-border)',color:'var(--text-primary)'}}>
                {cols.map((c) => <td key={c.key} className="py-3 pr-4">{c.render ? c.render(item) : item[c.key] ?? "—"}</td>)}
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={cols.length} className="pt-4 text-center" style={{color:'var(--text-muted)'}}>No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="space-y-2 md:hidden">
        {data.map((item, i) => (
          <div key={item.id || i} className="rounded-lg border p-3 hover:opacity-80" onClick={() => onRowClick?.(item)} style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}}>
            {cols.map((c) => (
              <div key={c.key} className="flex items-center justify-between py-1">
                <span className="text-xs" style={{color:'var(--text-muted)'}}>{c.label}</span>
                <span className="text-sm" style={{color:'var(--text-primary)'}}>{c.render ? c.render(item) : item[c.key] ?? "—"}</span>
              </div>
            ))}
          </div>
        ))}
        {data.length === 0 && <p className="text-center py-4" style={{color:'var(--text-muted)'}}>No data</p>}
      </div>
    </div>
  )
}
