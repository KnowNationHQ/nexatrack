import { NextResponse } from "next/server"
import { createAdminClient, assertTable } from "@/lib/server-db"

const supabase = createAdminClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { table, action, data, columns, eq, order, limit, single, neq, isNull, onConflict, in: inFilter } = body
    assertTable(table)

    if (action === "select") {
      let q = supabase.from(table).select(columns || "*", { count: body.count || undefined, head: body.head || false })
      if (eq) for (const [k, v] of Object.entries(eq)) q = q.eq(k, v)
      if (inFilter) for (const [k, v] of Object.entries(inFilter)) q = q.in(k, v as any[])
      if (neq) {
        const pairs: { col: string; val: any }[] = Array.isArray(neq) ? neq : Object.entries(neq as Record<string, any>).map(([k, v]) => ({ col: k, val: v }))
        for (const { col, val } of pairs) q = q.neq(col, val)
      }
      if (isNull) for (const c of isNull) q = q.is(c, null)
      if (order) for (const { column, ascending } of (Array.isArray(order) ? order : [order])) q = q.order(column, { ascending })
      if (limit) q = q.limit(limit)
      if (single) { const { data: d, error } = await q.single(); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json(d) }
      if (body.count && body.head) { const { count, error } = await q; if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json({ count }) }
      const { data: d, error } = await q
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json(d || [])
    }

    if (action === "insert") { const { data: d, error } = await supabase.from(table).insert(data).select(); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json(d) }
    if (action === "upsert") { const { data: d, error } = await supabase.from(table).upsert(data, { onConflict, ignoreDuplicates: false }).select(); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json(d) }
    if (action === "update") { let q = supabase.from(table).update(data); if (eq) for (const [k, v] of Object.entries(eq)) q = q.eq(k, v); const { data: d, error } = await q.select(); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json(d) }
    if (action === "delete") { let q = supabase.from(table).delete(); if (eq) for (const [k, v] of Object.entries(eq)) q = q.eq(k, v); const { error } = await q; if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json({ success: true }) }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
