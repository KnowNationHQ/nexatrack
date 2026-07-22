from playwright.sync_api import sync_playwright
import time, sys, json

BASE = "https://nexatrackcourierservices.com"
EMAILS = {"admin":"admin@nexatrackcourierservices.com","merchant":"merchant@nexatrackcourierservices.com","driver":"driver@nexatrackcourierservices.com"}
PASS = "Nexatrack123!"
ok = 0; fail = 0

def check(name, cond, detail=""):
    global ok, fail
    if cond: ok+=1; print(f"  PASS  {name}")
    else: fail+=1; print(f"  FAIL  {name} - {detail}")

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    # ── Public pages ──
    ctx = b.new_context(viewport={"width":1440,"height":900})
    page = ctx.new_page()

    print("\n======== PUBLIC PAGES ========")
    for path, label in [("","Landing"),("/track","Tracking"),("/auth/login","Login"),("/auth/register","Register")]:
        r = page.goto(f"{BASE}{path}", wait_until="networkidle")
        check(f"{label} page loads", r.status < 400, str(r.status))
        page.screenshot(path=f"C:\\Users\\hp\\Desktop\\Nexatrack\\tests\\screenshots\\prod-{label.lower()}.png", full_page=True)

    # ── Theme check ──
    print("\n======== THEME ========")
    page.evaluate("localStorage.setItem('nexatrack_theme','dark')")
    page.reload(wait_until="networkidle"); time.sleep(1)
    theme = page.evaluate("document.documentElement.getAttribute('data-theme')")
    hasDark = page.evaluate("document.documentElement.classList.contains('dark')")
    check("data-theme=dark", theme == "dark")
    check(".dark class present", hasDark)

    page.evaluate("localStorage.setItem('nexatrack_theme','light')")
    page.reload(wait_until="networkidle"); time.sleep(1)
    theme = page.evaluate("document.documentElement.getAttribute('data-theme')")
    hasDark = page.evaluate("document.documentElement.classList.contains('dark')")
    check("data-theme=light", theme == "light")
    check(".dark class absent", not hasDark)

    # ── Login redirects ──
    print("\n======== LOGIN REDIRECTS ========")
    for role, slug, email in [("admin","admin",EMAILS["admin"]),("merchant","merchant",EMAILS["merchant"]),("driver","driver",EMAILS["driver"])]:
        cx = b.new_context(viewport={"width":1440,"height":900})
        pg = cx.new_page()
        pg.goto(f"{BASE}/auth/login", wait_until="networkidle")
        try:
            pg.wait_for_selector('input[type="email"]', timeout=15000)
            pg.fill('input[type="email"]', email)
            pg.fill('input[type="password"]', PASS)
            pg.click('button[type="submit"]')
            pg.wait_for_load_state("networkidle")
            time.sleep(4)
            final = pg.url
            check(f"{role} login lands on /{slug}", f"/{slug}" in final, f"got {final}")
            pg.screenshot(path=f"C:\\Users\\hp\\Desktop\\Nexatrack\\tests\\screenshots\\prod-{role}-after-login.png", full_page=True)
        except Exception as e:
            check(f"{role} login form", False, str(e)[:80])
        cx.close(); time.sleep(0.5)

    # ── Authenticated pages ──
    print("\n======== AUTH PAGES ========")
    # Login as admin first
    ctx2 = b.new_context(viewport={"width":1440,"height":900})
    ap = ctx2.new_page()
    ap.goto(f"{BASE}/auth/login", wait_until="networkidle")
    ap.wait_for_selector('input[type="email"]', timeout=15000)
    ap.fill('input[type="email"]', EMAILS["admin"])
    ap.fill('input[type="password"]', PASS)
    ap.click('button[type="submit"]')
    ap.wait_for_load_state("networkidle")
    time.sleep(5)

    for path, label in [("/admin","Admin dashboard"),("/admin/merchants","Admin merchants"),("/admin/drivers","Admin drivers"),("/admin/dispatch","Admin dispatch"),("/admin/pickups","Admin pickups"),("/admin/settings","Admin settings"),("/admin/shipments","Admin shipments")]:
        r = ap.goto(f"{BASE}{path}", wait_until="networkidle")
        check(f"{label} loads", r.status < 400, str(r.status))
        ap.screenshot(path=f"C:\\Users\\hp\\Desktop\\Nexatrack\\tests\\screenshots\\prod-{label.lower().replace(' ','-')}.png", full_page=True)
    ctx2.close()

    # Merchant pages
    ctx3 = b.new_context(viewport={"width":1440,"height":900})
    mp = ctx3.new_page()
    mp.goto(f"{BASE}/auth/login", wait_until="networkidle")
    mp.wait_for_selector('input[type="email"]', timeout=15000)
    mp.fill('input[type="email"]', EMAILS["merchant"])
    mp.fill('input[type="password"]', PASS)
    mp.click('button[type="submit"]')
    mp.wait_for_load_state("networkidle")
    time.sleep(5)

    for path, label in [("/merchant","Merchant dashboard"),("/merchant/shipments","M shipments"),("/merchant/shipments/new","M new shipment"),("/merchant/pickups","M pickups"),("/merchant/wallet","M wallet"),("/merchant/invoices","M invoices"),("/merchant/transactions","M transactions"),("/merchant/tickets","M tickets"),("/merchant/chat","M chat"),("/merchant/profile","M profile")]:
        r = mp.goto(f"{BASE}{path}", wait_until="networkidle")
        check(f"{label} loads", r.status < 400, str(r.status))
    ctx3.close()

    # Driver pages
    ctx4 = b.new_context(viewport={"width":1440,"height":900})
    dp = ctx4.new_page()
    dp.goto(f"{BASE}/auth/login", wait_until="networkidle")
    dp.wait_for_selector('input[type="email"]', timeout=15000)
    dp.fill('input[type="email"]', EMAILS["driver"])
    dp.fill('input[type="password"]', PASS)
    dp.click('button[type="submit"]')
    dp.wait_for_load_state("networkidle")
    time.sleep(5)

    for path, label in [("/driver","Driver dashboard"),("/driver/shipments","D shipments"),("/driver/chat","D chat")]:
        r = dp.goto(f"{BASE}{path}", wait_until="networkidle")
        check(f"{label} loads", r.status < 400, str(r.status))
    ctx4.close()

    # ── API endpoints ──
    print("\n======== API ========")
    a = b.new_context(viewport={"width":1440,"height":900})
    p2 = a.new_page()
    p2.goto(f"{BASE}/auth/login", wait_until="networkidle")
    p2.wait_for_selector('input[type="email"]', timeout=15000)
    p2.fill('input[type="email"]', EMAILS["admin"])
    p2.fill('input[type="password"]', PASS)
    p2.click('button[type="submit"]')
    p2.wait_for_load_state("networkidle")
    time.sleep(5)

    for route in ["/api/admin/edit-merchant","/api/assign-driver","/api/update-shipment-status","/api/upload-delivery-proof"]:
        r = p2.evaluate(f"async()=>{{try{{const r=await fetch('{BASE}{route}',{{signal:AbortSignal.timeout(15000)}});return r.status}}catch(e){{return-1}}}}")
        check(f"GET {route.split('/')[-1]} -> {r}", r in [200,400,401,404,405], f"got {r}")

    for route, body in [("/api/mock-top-up",{"amount":50})]:
        r = p2.evaluate(f"async()=>{{try{{const r=await fetch('{BASE}{route}',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:{json.dumps(json.dumps(body))},signal:AbortSignal.timeout(15000)}});return r.status}}catch(e){{return-1}}}}")
        check(f"POST {route.split('/')[-1]} -> {r}", r in [200,400,401], f"got {r}")

    a.close()

    # ── Mobile ──
    print("\n======== MOBILE ========")
    mc = b.new_context(viewport={"width":375,"height":812})
    m = mc.new_page()
    m.goto(f"{BASE}/", wait_until="networkidle")
    check("Mobile landing loads", m.url == f"{BASE}/")
    m.screenshot(path=f"C:\\Users\\hp\\Desktop\\Nexatrack\\tests\\screenshots\\prod-mobile-landing.png", full_page=True)
    mc.close()

    b.close()

print(f"\n{'='*40}")
print(f"RESULTS: {ok} PASSED, {fail} FAILED")
sys.exit(1 if fail else 0)
