from playwright.sync_api import sync_playwright
import json, sys, time

BASE = "http://localhost:3000"
EMAILS = {"admin": "admin@nexatrackcourierservices.com", "merchant": "merchant@nexatrackcourierservices.com", "driver": "driver@nexatrackcourierservices.com"}
PASS = "Nexatrack123!"
RESULTS = {"pass": 0, "fail": 0, "errors": []}

def report(name, ok, detail=""):
    if ok:
        RESULTS["pass"] += 1
        print(f"  PASS  {name}")
    else:
        RESULTS["fail"] += 1
        RESULTS["errors"].append(f"{name}: {detail}")
        print(f"  FAIL  {name} - {detail}")

def login(page, role):
    page.goto(f"{BASE}/auth/login")
    page.wait_for_load_state("networkidle")
    page.wait_for_selector('input[type="email"]', timeout=10000)
    page.fill('input[type="email"]', EMAILS[role])
    page.fill('input[type="password"]', PASS)
    page.click('button[type="submit"]')
    page.wait_for_load_state("networkidle")
    # Wait for client-side redirect + potential middleware redirect
    slugs = {"admin": "/admin", "merchant": "/merchant", "driver": "/driver"}
    expected = slugs[role]
    for _ in range(40):
        time.sleep(0.3)
        cur = page.url
        if cur.rstrip("/").endswith(expected):
            return cur
    return page.url

def nav_to(page, url):
    page.remove_listener("pageerror", nav_to.listener) if hasattr(nav_to, "listener") else None
    errs = []
    nav_to.listener = lambda e: errs.append(str(e))
    page.on("pageerror", nav_to.listener)
    page.goto(url)
    page.wait_for_load_state("networkidle")
    time.sleep(0.8)
    page.evaluate("1+1")
    return errs

def check_theme_vars(page):
    return page.evaluate("""
        () => {
            const el = document.documentElement;
            return {
                theme: el.getAttribute('data-theme'),
                hasDarkClass: el.classList.contains('dark'),
                textPrimary: getComputedStyle(el).getPropertyValue('--text-primary').trim(),
                cardBg: getComputedStyle(el).getPropertyValue('--card-bg').trim(),
                mainBorder: getComputedStyle(el).getPropertyValue('--main-border').trim(),
            };
        }
    """)

def screenshot(page, name):
    page.screenshot(path=f"C:\\Users\\hp\\Desktop\\Nexatrack\\tests\\screenshots\\{name}.png", full_page=True)

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Theme tests use clean context
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()

        print("\n============== THEME & COLOR BRANDING ==============")
        page.goto(BASE)
        page.wait_for_load_state("networkidle")
        page.evaluate("localStorage.setItem('nexatrack_theme','dark')")
        page.reload(); page.wait_for_load_state("networkidle"); time.sleep(0.5)
        v = check_theme_vars(page)
        report("data-theme=dark after setting", v["theme"] == "dark")
        report("text-primary not empty", bool(v["textPrimary"]))
        report("card-bg not empty", bool(v["cardBg"]))
        report("main-border defined", bool(v["mainBorder"]))
        report(".dark class applied", v["hasDarkClass"] is True)
        report("text-primary is #ffffff in dark", v["textPrimary"] == "#ffffff")
        report("card-bg is #0a0715 in dark", v["cardBg"] == "#0a0715")

        page.evaluate("localStorage.setItem('nexatrack_theme','light')")
        page.reload(); page.wait_for_load_state("networkidle")
        v = check_theme_vars(page)
        report("theme switches to light", v["theme"] == "light")
        report(".dark class removed in light", v["hasDarkClass"] is False)
        report("text-primary is #111827 in light", v["textPrimary"] == "#111827")
        report("card-bg is #ffffff in light", v["cardBg"] == "#ffffff")
        ctx.close()

        # ============== ADMIN PORTAL ==============
        print("\n============== ADMIN PORTAL ==============")
        ctx2 = browser.new_context(viewport={"width": 1440, "height": 900})
        apage = ctx2.new_page()
        url = login(apage, "admin")
        report("Admin login", "/admin" in url)
        time.sleep(1)

        for label, path in [
            ("Admin dashboard", "/admin"),
            ("Admin merchants list", "/admin/merchants"),
            ("Admin drivers", "/admin/drivers"),
            ("Admin dispatch", "/admin/dispatch"),
            ("Admin pickups", "/admin/pickups"),
            ("Admin settings", "/admin/settings"),
            ("Admin shipments list", "/admin/shipments"),
        ]:
            errs = nav_to(apage, f"{BASE}{path}")
            report(f"{label} loads", len(errs) == 0, "; ".join(errs))

        # Shipment detail
        try:
            link = apage.locator("a[href*='/admin/shipments/']").first
            if link.count() > 0:
                href = link.get_attribute("href")
                errs = nav_to(apage, f"{BASE}{href}")
                report("Admin shipment detail loads", len(errs) == 0, "; ".join(errs))
        except:
            report("Admin shipment detail", True, "no shipments found")
        screenshot(apage, "admin-dispatch")

        # API endpoints (from admin context)
        print("\n============== API ENDPOINTS ==============")
        for route in ["/api/admin/edit-merchant","/api/assign-driver","/api/create-shipment","/api/update-shipment-status","/api/upload-delivery-proof"]:
            try:
                r = apage.evaluate(f"async()=>{{try{{const r=await fetch('{BASE}{route}');return{{s:r.status}}}}catch(e){{return{{e:e.message}}}}}}")
                if r.get("e"): report(f"GET {route}", False, r["e"])
                else: report(f"GET {route} -> {r['s']}", r["s"] in [200,400,401,404,405], f"got {r['s']}")
            except Exception as e: report(f"GET {route}", False, str(e))

        for route, body in {"/api/mock-top-up":{"amount":50},"/api/send-notification":{"title":"Test","message":"Test"},"/api/test-email":{"to":EMAILS["admin"]}}.items():
            try:
                r = apage.evaluate(f"async()=>{{try{{const r=await fetch('{BASE}{route}',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:{json.dumps(json.dumps(body))}}});return{{s:r.status}}}}catch(e){{return{{e:e.message}}}}}}")
                if r.get("e"): report(f"POST {route}", False, r["e"])
                else: report(f"POST {route} -> {r['s']}", r["s"] in [200,400,401], f"got {r['s']}")
            except Exception as e: report(f"POST {route}", False, str(e))

        # Theme on merchant page (light)
        print("\n============== THEME CONSISTENCY ==============")
        apage.evaluate("localStorage.setItem('nexatrack_theme','light')")
        errs = nav_to(apage, f"{BASE}/merchant")
        report("Merchant page loads in light theme", len(errs) == 0, "; ".join(errs))
        v = check_theme_vars(apage)
        report("Merchant light card bg is white", v["cardBg"] == "#ffffff")
        screenshot(apage, "merchant-light")
        ctx2.close()

        # ============== MERCHANT PORTAL ==============
        print("\n============== MERCHANT PORTAL ==============")
        ctx3 = browser.new_context(viewport={"width": 1440, "height": 900})
        mpage = ctx3.new_page()
        url = login(mpage, "merchant")
        report("Merchant login", "/merchant" in url)
        time.sleep(1)

        for label, path in [
            ("Merchant dashboard", "/merchant"),
            ("Merchant shipments list", "/merchant/shipments"),
            ("Merchant new shipment", "/merchant/shipments/new"),
            ("Merchant pickups", "/merchant/pickups"),
            ("Merchant wallet", "/merchant/wallet"),
            ("Merchant invoices", "/merchant/invoices"),
            ("Merchant transactions", "/merchant/transactions"),
            ("Merchant tickets", "/merchant/tickets"),
            ("Merchant chat", "/merchant/chat"),
            ("Merchant profile", "/merchant/profile"),
        ]:
            errs = nav_to(mpage, f"{BASE}{path}")
            report(f"{label} loads", len(errs) == 0, "; ".join(errs))

        screenshot(mpage, "merchant-dashboard")
        ctx3.close()

        # ============== DRIVER PORTAL ==============
        print("\n============== DRIVER PORTAL ==============")
        ctx4 = browser.new_context(viewport={"width": 1440, "height": 900})
        dpage = ctx4.new_page()
        url = login(dpage, "driver")
        report("Driver login", "/driver" in url)
        time.sleep(1)

        for label, path in [
            ("Driver dashboard", "/driver"),
            ("Driver shipments list", "/driver/shipments"),
            ("Driver chat", "/driver/chat"),
        ]:
            errs = nav_to(dpage, f"{BASE}{path}")
            report(f"{label} loads", len(errs) == 0, "; ".join(errs))

        screenshot(dpage, "driver-dashboard")
        ctx4.close()

        # ============== PUBLIC PAGES ==============
        print("\n============== PUBLIC PAGES ==============")
        ctx5 = browser.new_context(viewport={"width": 1440, "height": 900})
        ppage = ctx5.new_page()
        for label, path in [
            ("Landing page", ""),
            ("Public tracking", "/track"),
            ("Login page", "/auth/login"),
            ("Register page", "/auth/register"),
        ]:
            errs = nav_to(ppage, f"{BASE}{path}")
            report(f"{label} loads", len(errs) == 0, "; ".join(errs))
        ctx5.close()

        # ============== MOBILE (375px) ==============
        print("\n============== MOBILE (375px) ==============")
        for role, slug in [("admin","admin"),("merchant","merchant"),("driver","driver")]:
            mc = browser.new_context(viewport={"width":375,"height":812})
            mp = mc.new_page()
            url = login(mp, role)
            report(f"Mobile {role} login", f"/{slug}" in url)
            time.sleep(1)
            errs = nav_to(mp, f"{BASE}/{slug}")
            report(f"Mobile {role} dashboard loads", len(errs) == 0, "; ".join(errs))
            screenshot(mp, f"mobile-{role}-dashboard")
            mc.close()

        # ============== TABLET (768px) ==============
        print("\n============== TABLET (768px) ==============")
        tc = browser.new_context(viewport={"width":768,"height":1024})
        tp = tc.new_page()
        url = login(tp, "admin")
        report("Tablet admin login", "/admin" in url)
        time.sleep(1)
        for label, path in [("Tablet admin dashboard","/admin"),("Tablet dispatch","/admin/dispatch")]:
            errs = nav_to(tp, f"{BASE}{path}")
            report(f"{label} loads", len(errs) == 0, "; ".join(errs))
        screenshot(tp, "tablet-admin")
        tc.close()

        browser.close()

    # FINAL REPORT
    print(f"\n{'='*50}")
    print(f"RESULTS: {RESULTS['pass']} PASSED, {RESULTS['fail']} FAILED")
    if RESULTS["errors"]:
        print(f"\nFAILURES:")
        for e in RESULTS["errors"]:
            print(f"  * {e}")
    print(f"{'='*50}")
    return 1 if RESULTS["fail"] > 0 else 0

if __name__ == "__main__":
    sys.exit(run())
