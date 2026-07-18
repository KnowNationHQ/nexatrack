import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } }
)

async function logAudit(staffEmail: string, act: string, tbl: string, recordId: string, details: any) {
  await supabase.from('audit_log').insert({ staff_email: staffEmail, action: act, table_name: tbl, record_id: recordId, details }).maybeSingle()
}

const CRUD_TABLES = ['customers','drivers','staff','recipients','pre_alerts','locker_packages','pickups','consolidations','settings','countries','states','cities']

function tableFor(action: string): string | null {
  for (const t of CRUD_TABLES) {
    if (action === 'list-' + t || action === 'get-' + t || action === 'create-' + t || action === 'update-' + t || action === 'delete-' + t) return t
  }
  return null
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const url = new URL(req.url)
  const action = url.searchParams.get('action') || ''
  const authHeader = req.headers.get('authorization') || ''
  const isAuthed = authHeader.startsWith('Bearer ')

  try {
    // ── Existing shipment actions ──
    if (action === 'list') {
      const search = url.searchParams.get('search') || ''
      let query = supabase.from('shipments').select('*').order('updated_at', { ascending: false })
      if (search) {
        query = query.or(`tracking_number.ilike.%${search}%,shipper_name.ilike.%${search}%,receiver_name.ilike.%${search}%`)
      }
      const { data, error } = await query
      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'get') {
      const tn = url.searchParams.get('tracking') || ''
      const { data, error } = await supabase.from('shipments').select('*').eq('tracking_number', tn).single()
      if (error) throw error
      if (data) {
        const { data: events } = await supabase.from('tracking_events').select('*').eq('shipment_id', data.id).order('event_time', { ascending: false })
        data.tracking_events = events || []
      }
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'events') {
      const sid = url.searchParams.get('shipment_id') || ''
      const { data, error } = await supabase.from('tracking_events').select('*').eq('shipment_id', sid).order('event_time', { ascending: false })
      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'create-shipment') {
      const body = await req.json()
      const { data, error } = await supabase.from('shipments').insert({
        tracking_number: body.tracking_number?.toUpperCase(),
        status: body.status || 'pending',
        estimated_delivery: body.estimated_delivery || null,
        service_type: body.service_type || null,
        reference_number: body.reference_number || null,
        package_count: body.package_count || 1,
        shipper_name: body.shipper_name || null,
        shipper_company: body.shipper_company || null,
        shipper_email: body.shipper_email || null,
        shipper_phone: body.shipper_phone || null,
        shipper_address: body.shipper_address || null,
        shipper_city: body.shipper_city || null,
        shipper_state: body.shipper_state || null,
        shipper_zip: body.shipper_zip || null,
        receiver_name: body.receiver_name || null,
        receiver_company: body.receiver_company || null,
        receiver_email: body.receiver_email || null,
        receiver_phone: body.receiver_phone || null,
        receiver_address: body.receiver_address || null,
        receiver_city: body.receiver_city || null,
        receiver_state: body.receiver_state || null,
        receiver_zip: body.receiver_zip || null,
        weight: body.weight || null,
        weight_unit: body.weight_unit || 'lb',
        length: body.length || null,
        width: body.width || null,
        height: body.height || null,
        declared_value: body.declared_value || null,
        special_instructions: body.special_instructions || null
      }).select().single()
      if (error) throw error
      return new Response(JSON.stringify(data), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'update-shipment') {
      const body = await req.json()
      const { data, error } = await supabase.from('shipments').update({
        shipper_city: body.shipper_city ?? undefined,
        receiver_city: body.receiver_city ?? undefined,
        shipper_state: body.shipper_state ?? undefined,
        receiver_state: body.receiver_state ?? undefined,
        shipper_zip: body.shipper_zip ?? undefined,
        receiver_zip: body.receiver_zip ?? undefined,
        status: body.status ?? undefined,
        estimated_delivery: body.estimated_delivery ?? undefined,
        current_location: body.current_location ?? undefined,
        notes: body.notes ?? undefined,
        updated_at: new Date().toISOString()
      }).eq('id', body.id).select().single()
      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'delete-shipment') {
      const body = await req.json()
      await supabase.from('tracking_events').delete().eq('shipment_id', body.id)
      const { error } = await supabase.from('shipments').delete().eq('id', body.id)
      if (error) throw error
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'create-event') {
      const body = await req.json()
      const { error } = await supabase.from('tracking_events').insert({
        shipment_id: body.shipment_id,
        title: body.title,
        description: body.description || null,
        location: body.location || null,
        lat: body.lat || null,
        lng: body.lng || null,
        event_time: body.event_time || new Date().toISOString()
      })
      if (error) throw error
      if (body.update_status) {
        await supabase.from('shipments').update({ status: body.update_status, updated_at: new Date().toISOString() }).eq('id', body.shipment_id)
      }
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'delete-event') {
      const body = await req.json()
      const { error } = await supabase.from('tracking_events').delete().eq('id', body.id)
      if (error) throw error
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // ── Generic CRUD for all new tables ──
    const table = tableFor(action)
    if (table) {
      // Public read for countries/states/cities
      if ((table === 'countries' || table === 'states' || table === 'cities') && (action.startsWith('list-') || action.startsWith('get-'))) {
        // ok
      } else if (!isAuthed) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      const staffEmail = isAuthed ? (JSON.parse(atob(authHeader.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).email || 'unknown') : 'anon'

      const SEARCH_COLUMNS: Record<string, string[]> = {
        staff: ['first_name', 'last_name', 'email', 'phone'],
        customers: ['first_name', 'last_name', 'email', 'phone', 'company'],
        drivers: ['first_name', 'last_name', 'email', 'phone'],
        recipients: ['name', 'email', 'phone', 'company'],
        pre_alerts: ['tracking_number', 'reference_number'],
        locker_packages: ['tracking_number', 'locker_number', 'access_code'],
        pickups: ['reference_number', 'pickup_address', 'status'],
        consolidations: ['reference_number', 'destination'],
        settings: ['name', 'value']
      }
      if (action === 'list-' + table) {
        let query = supabase.from(table).select('*').order('created_at', { ascending: false })
        const search = url.searchParams.get('search')
        const filter = url.searchParams.get('filter')
        if (search) {
          const cols = SEARCH_COLUMNS[table]
          if (cols) {
            const orClause = cols.map(c => `${c}.ilike.%${search}%`).join(',')
            query = query.or(orClause)
          }
        }
        if (filter) {
          if (table === 'settings') query = query.eq('category', filter)
          else query = query.eq('status', filter)
        }
        if (table === 'states') {
          const cid = url.searchParams.get('country_id')
          if (cid) query = query.eq('country_id', cid).order('name')
        }
        if (table === 'cities') {
          const sid = url.searchParams.get('state_id')
          if (sid) query = query.eq('state_id', sid).order('name')
        }
        const { data, error } = await query
        if (error) throw error
        return new Response(JSON.stringify(data || []), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      if (action === 'get-' + table) {
        const id = url.searchParams.get('id') || ''
        const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
        if (error) throw error
        return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      if (action === 'create-' + table) {
        const body = await req.json()
        const { data, error } = await supabase.from(table).insert(body).select().single()
        if (error) throw error
        await logAudit(staffEmail, 'create', table, data.id, body)
        return new Response(JSON.stringify(data), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      if (action === 'update-' + table) {
        const body = await req.json()
        const id = body.id
        delete body.id
        const { data, error } = await supabase.from(table).update(body).eq('id', id).select().single()
        if (error) throw error
        await logAudit(staffEmail, 'update', table, id, body)
        return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      if (action === 'delete-' + table) {
        const body = await req.json()
        const { error } = await supabase.from(table).delete().eq('id', body.id)
        if (error) throw error
        await logAudit(staffEmail, 'delete', table, body.id, {})
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
    }

    // ── Dashboard stats ──
    if (action === 'dashboard-stats') {
      const [shipments, pickupsT, preAlerts, lockers] = await Promise.all([
        supabase.from('shipments').select('id', { count: 'exact', head: true }).in('status', ['in_transit','out_for_delivery','pending']),
        supabase.from('pickups').select('id', { count: 'exact', head: true }).eq('status', 'pending').gte('scheduled_date', new Date().toISOString().slice(0,10)),
        supabase.from('pre_alerts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('locker_packages').select('id', { count: 'exact', head: true }).eq('status', 'received'),
      ])
      return new Response(JSON.stringify({
        active_shipments: shipments.count || 0,
        todays_pickups: pickupsT.count || 0,
        pending_pre_alerts: preAlerts.count || 0,
        lockers_occupied: lockers.count || 0
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // ── Audit log ──
    if (action === 'audit-log') {
      const { data, error } = await supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(100)
      if (error) throw error
      return new Response(JSON.stringify(data || []), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ error: 'Unknown action: ' + action }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
