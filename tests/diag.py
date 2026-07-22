from playwright.sync_api import sync_playwright
import time, json

BASE = "https://nexatrackcourierservices.com"
EMAILS = {"admin":"admin@nexatrackcourierservices.com","merchant":"merchant@nexatrackcourierservices.com","driver":"driver@nexatrackcourierservices.com"}
PASS = "Nexatrack123!"

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width":1440,"height":900})
    page = ctx.new_page()

    # Check new API routes + login behavior
    page.goto(f"{BASE}/auth/login", wait_until="networkidle")
    page.wait_for_selector('input[type="email"]', timeout=15000)
    page.fill('input[type="email"]', EMAILS["admin"])
    page.fill('input[type="password"]', PASS)

    # Listen for navigation
    page.on("response", lambda r: print(f"  {r.status} {r.url[:80]}"))

    page.click('button[type="submit"]')
    page.wait_for_timeout(8000)
    print(f"\nFinal URL: {page.url}")

    # Check if /api/send-notification exists
    r = page.evaluate("async()=>{try{const r=await fetch('https://nexatrackcourierservices.com/api/send-notification',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:'T',message:'M'}),signal:AbortSignal.timeout(15000)});return r.status}catch(e){return -1}}")
    print(f"POST /api/send-notification -> {r}")

    b.close()
