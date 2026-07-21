import { createServerClient } from "@supabase/ssr"
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  let role = "merchant"
  try {
    const res = await fetch(`${url}/rest/v1/profiles?select=role&id=eq.${user.id}&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (res.ok) {
      const rows = await res.json()
      if (rows?.[0]?.role) role = rows[0].role
    }
  } catch {}
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
