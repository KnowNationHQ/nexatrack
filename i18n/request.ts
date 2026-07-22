import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale) {
    try {
      const { cookies } = await import("next/headers")
      const cookieStore = await cookies()
      locale = cookieStore.get("NEXT_LOCALE")?.value
    } catch {
      locale = "en"
    }
  }
  if (!locale || !["en", "es", "fr"].includes(locale)) locale = "en"

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
