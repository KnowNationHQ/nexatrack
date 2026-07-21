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
            <tr className="border-b border-[#1a1725] text-left text-gray-400">
              {cols.map((c) => <th key={c.key} className="pb-3 pr-4 font-medium">{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.id || i} className={`border-b border-[#1a1725] text-white hover:bg-[#1a1725]/50 ${onRowClick ? "cursor-pointer" : ""}`} onClick={() => onRowClick?.(item)}>
                {cols.map((c) => <td key={c.key} className="py-3 pr-4">{c.render ? c.render(item) : item[c.key] ?? "—"}</td>)}
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={cols.length} className="pt-4 text-center text-gray-500">No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="space-y-2 md:hidden">
        {data.map((item, i) => (
          <div key={item.id || i} className="rounded-lg border border-[#1a1725] bg-[#0a0715] p-3" onClick={() => onRowClick?.(item)}>
            {cols.map((c) => (
              <div key={c.key} className="flex items-center justify-between py-1">
                <span className="text-xs text-gray-500">{c.label}</span>
                <span className="text-sm text-white">{c.render ? c.render(item) : item[c.key] ?? "—"}</span>
              </div>
            ))}
          </div>
        ))}
        {data.length === 0 && <p className="text-center text-gray-500 py-4">No data</p>}
      </div>
    </div>
  )
}
