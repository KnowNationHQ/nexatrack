import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies: { name: string; value: string }[]) => {
          cookies.forEach((c) => request.cookies.set(c.name, c.value))
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (!user) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/merchant") || pathname.startsWith("/driver")) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    return supabaseResponse
  }

  const adminDb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
  const { data: profile } = await adminDb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = profile?.role || "merchant"
  const roleDashboards: Record<string, string> = {
    admin: "/admin",
    merchant: "/merchant",
    driver: "/driver",
  }
  const dashboard = roleDashboards[role] || "/merchant"

  if (pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL(dashboard, request.url))
  }

  const allowedPrefix = `/${role}`
  if (!pathname.startsWith(allowedPrefix)) {
    return NextResponse.redirect(new URL(dashboard, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/admin/:path*", "/merchant/:path*", "/driver/:path*", "/auth/:path*"],
}
