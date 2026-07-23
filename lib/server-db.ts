import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        fetch: (url, opts) =>
          fetch(url, { ...opts, cache: "no-store" }),
      },
    }
  )
}

const ALLOWED = new Set([
  "parcels", "tracking_events", "delivery_types", "delivery_categories",
  "profiles", "wallets", "transactions", "invoices", "pickup_requests",
  "settings", "branches", "packaging_options",
  "delivery_charges", "faqs", "support_tickets", "subscribers",
  "categories", "blocked_emails",
])

export function assertTable(table: string) {
  if (!ALLOWED.has(table)) throw new Error(`Table not allowed: ${table}`)
}
