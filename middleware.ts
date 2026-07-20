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

  const protectedPaths = ["/admin", "/merchant", "/driver"]
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (user && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/admin/:path*", "/merchant/:path*", "/driver/:path*", "/auth/:path*"],
}
