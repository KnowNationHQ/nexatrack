import { chromium } from "playwright"

const BASE = process.env.BASE || "http://localhost:3000"
const VIEWPORT_DESKTOP = { width: 1280, height: 800 }
const VIEWPORT_MOBILE = { width: 375, height: 667 }

let passed = 0
let failed = 0

function assert(cond, msg) { if (cond) { passed++; console.log(`  ✓ ${msg}`) } else { failed++; console.log(`  ✗ ${msg}`) } }

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const browser = await chromium.launch({ headless: true })

try {
  // ---- desktop ----
  const desktop = await browser.newPage()
  await desktop.setViewportSize(VIEWPORT_DESKTOP)
  await desktop.goto(BASE, { waitUntil: "networkidle" })
  await sleep(2000) // let CDN resources settle

  const navLinksDesktop = await desktop.locator("#navbarCollapse .nav-link").all()
  assert(navLinksDesktop.length >= 4, `desktop: nav links exist (${navLinksDesktop.length})`)

  for (const link of navLinksDesktop) {
    const visible = await link.isVisible()
    assert(visible, `desktop: nav link "${await link.textContent()}" visible`)
  }

  // ---- mobile ----
  const mobile = await browser.newPage()
  await mobile.setViewportSize(VIEWPORT_MOBILE)
  await mobile.goto(BASE, { waitUntil: "networkidle" })
  await sleep(2000)

  const toggle = mobile.locator("#navbarToggle")
  assert(await toggle.isVisible(), "mobile: hamburger toggle visible")

  const collapse = mobile.locator("#navbarCollapse")
  const isHidden = await collapse.evaluate(el => {
    const style = window.getComputedStyle(el)
    return style.display === "none"
  })
  assert(isHidden, "mobile: nav hidden by default")

  await toggle.click()
  await sleep(500)
  const isOpen = await collapse.evaluate(el => {
    const style = window.getComputedStyle(el)
    return style.display !== "none"
  })
  assert(isOpen, "mobile: nav opens on toggle click")

  const firstLink = collapse.locator(".nav-link").first()
  await firstLink.click()
  await sleep(500)
  const isClosed = await collapse.evaluate(el => {
    const style = window.getComputedStyle(el)
    return style.display === "none"
  })
  assert(isClosed, "mobile: nav closes on link click")

  // ---- /about page ----
  await mobile.goto(BASE + "/about", { waitUntil: "networkidle" })
  await sleep(2000)
  const aboutCollapse = mobile.locator("#navbarCollapse")
  const aboutHidden = await aboutCollapse.evaluate(el => {
    const style = window.getComputedStyle(el)
    return style.display === "none"
  })
  assert(aboutHidden, "mobile /about: nav hidden by default")

  await mobile.locator("#navbarToggle").click()
  await sleep(500)
  const aboutOpen = await aboutCollapse.evaluate(el => {
    const style = window.getComputedStyle(el)
    return style.display !== "none"
  })
  assert(aboutOpen, "mobile /about: nav opens on toggle click")

  // ---- desktop /about ----
  const desktopAbout = await browser.newPage()
  await desktopAbout.setViewportSize(VIEWPORT_DESKTOP)
  await desktopAbout.goto(BASE + "/about", { waitUntil: "networkidle" })
  await sleep(2000)
  const aboutLinks = await desktopAbout.locator("#navbarCollapse .nav-link").all()
  for (const link of aboutLinks) {
    const visible = await link.isVisible()
    assert(visible, `desktop /about: nav link "${await link.textContent()}" visible`)
  }

  await desktopAbout.close()
  await desktop.close()
  await mobile.close()

  console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`)
} catch (err) {
  console.error("Test error:", err)
  failed++
} finally {
  await browser.close()
}

process.exit(failed > 0 ? 1 : 0)
