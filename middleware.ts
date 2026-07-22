import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

const locales = ["en", "es", "fr"]
const defaultLocale = "en"

function getLocale(pathname: string): { locale: string; rest: string } {
  for (const l of locales) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) {
      return { locale: l, rest: pathname.slice(l.length + 1) || "/" }
    }
  }
  return { locale: defaultLocale, rest: pathname }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { locale, rest } = getLocale(pathname)

  let res: NextResponse

  request.cookies.set("NEXT_LOCALE", locale)

  if (locale !== defaultLocale) {
    const url = new URL(rest, request.url)
    url.search = request.nextUrl.search
    res = NextResponse.rewrite(url)
    res.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 31536000, sameSite: "lax" })
  } else {
    res = NextResponse.next()
    res.cookies.set("NEXT_LOCALE", defaultLocale, { path: "/", maxAge: 31536000, sameSite: "lax" })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies: { name: string; value: string }[]) => {
          cookies.forEach((c) => request.cookies.set(c.name, c.value))
          cookies.forEach((c) => res.cookies.set(c.name, c.value))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const lc = request.cookies.get("NEXT_LOCALE")?.value || defaultLocale

  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register"
  const isProtected = /^\/(admin|merchant|driver)(\/.*)?$/.test(pathname)

  if (!user) {
    if (isProtected && !isAuthPage) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    return res
  }

  const role = user.app_metadata?.role || "merchant"
  const dashboards: Record<string, string> = { admin: "/admin", merchant: "/merchant", driver: "/driver" }
  const dashboard = dashboards[role] || "/merchant"

  if (isAuthPage) {
    return NextResponse.redirect(new URL(dashboard, request.url))
  }

  if (rest !== "/" && pathname !== `/${role}` && !pathname.startsWith(`/${role}/`)) {
    return NextResponse.redirect(new URL(dashboard, request.url))
  }

  return res
}

export const config = { matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"] }
