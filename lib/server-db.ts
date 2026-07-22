import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const ALLOWED = new Set([
  "parcels", "tracking_events", "delivery_types", "delivery_categories",
  "profiles", "wallets", "transactions", "invoices", "pickup_requests",
  "settings", "livechat_messages", "branches", "packaging_options",
  "delivery_charges", "faqs", "support_tickets", "subscribers",
  "categories", "blocked_emails", "portal_messages",
])

export function assertTable(table: string) {
  if (!ALLOWED.has(table)) throw new Error(`Table not allowed: ${table}`)
}
