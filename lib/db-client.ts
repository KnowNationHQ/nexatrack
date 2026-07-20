export async function db<T = any>(table: string, action: string, opts: Record<string, any> = {}): Promise<T> {
  const res = await fetch("/api/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, action, ...opts }),
  })
  const data = await res.json()
  if (data?.error) throw new Error(data.error)
  return data
}
