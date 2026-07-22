from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    def role_screenshots(role, email, slug):
        ctx = b.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()

        # Login
        page.goto("http://localhost:3000/auth/login")
        page.wait_for_load_state("networkidle")
        page.fill('input[type="email"]', email)
        page.fill('input[type="password"]', "Nexatrack123!")
        page.click('button[type="submit"]')
        page.wait_for_load_state("networkidle")
        time.sleep(3)

        # Dark theme
        page.evaluate('localStorage.setItem("nexatrack_theme","dark")')
        page.goto(f"http://localhost:3000/{slug}")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=f"tests/screenshots/{role}-dark.png", full_page=True)

        # Light theme
        page.evaluate('localStorage.setItem("nexatrack_theme","light")')
        page.reload()
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=f"tests/screenshots/{role}-light.png", full_page=True)

        ctx.close()

    # Login page dark
    ctx0 = b.new_context(viewport={"width": 1440, "height": 900})
    p0 = ctx0.new_page()
    p0.goto("http://localhost:3000/auth/login")
    p0.wait_for_load_state("networkidle")
    p0.evaluate('localStorage.setItem("nexatrack_theme","dark")')
    p0.reload()
    p0.wait_for_load_state("networkidle")
    p0.screenshot(path="tests/screenshots/login-dark.png", full_page=True)
    ctx0.close()

    # Admin screenshots
    role_screenshots("admin-dashboard", "admin@nexatrackcourierservices.com", "admin")

    # Dispatch
    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    p = ctx.new_page()
    p.goto("http://localhost:3000/auth/login")
    p.wait_for_load_state("networkidle")
    p.fill('input[type="email"]', "admin@nexatrackcourierservices.com")
    p.fill('input[type="password"]', "Nexatrack123!")
    p.click('button[type="submit"]')
    p.wait_for_load_state("networkidle")
    time.sleep(3)
    p.evaluate('localStorage.setItem("nexatrack_theme","dark")')
    p.goto("http://localhost:3000/admin/dispatch")
    p.wait_for_load_state("networkidle")
    time.sleep(1)
    p.screenshot(path="tests/screenshots/admin-dispatch-dark.png", full_page=True)
    ctx.close()

    # Merchant screenshots
    role_screenshots("merchant", "merchant@nexatrackcourierservices.com", "merchant")

    # Driver screenshots
    role_screenshots("driver", "driver@nexatrackcourierservices.com", "driver")

    # Tracking
    ctx2 = b.new_context(viewport={"width": 1440, "height": 900})
    p2 = ctx2.new_page()
    p2.goto("http://localhost:3000/track")
    p2.wait_for_load_state("networkidle")
    p2.evaluate('localStorage.setItem("nexatrack_theme","dark")')
    p2.reload()
    p2.wait_for_load_state("networkidle")
    p2.screenshot(path="tests/screenshots/tracking-dark.png", full_page=True)

    p2.evaluate('localStorage.setItem("nexatrack_theme","light")')
    p2.reload()
    p2.wait_for_load_state("networkidle")
    p2.screenshot(path="tests/screenshots/tracking-light.png", full_page=True)
    ctx2.close()

    # Mobile
    for role, email, slug in [
        ("mobile-admin", "admin@nexatrackcourierservices.com", "admin"),
        ("mobile-merchant", "merchant@nexatrackcourierservices.com", "merchant"),
        ("mobile-driver", "driver@nexatrackcourierservices.com", "driver"),
    ]:
        mc = b.new_context(viewport={"width": 375, "height": 812})
        mp = mc.new_page()
        mp.goto("http://localhost:3000/auth/login")
        mp.wait_for_load_state("networkidle")
        mp.fill('input[type="email"]', email)
        mp.fill('input[type="password"]', "Nexatrack123!")
        mp.click('button[type="submit"]')
        mp.wait_for_load_state("networkidle")
        time.sleep(3)
        mp.evaluate('localStorage.setItem("nexatrack_theme","dark")')
        mp.goto(f"http://localhost:3000/{slug}")
        mp.wait_for_load_state("networkidle")
        time.sleep(1)
        mp.screenshot(path=f"tests/screenshots/{role}-dark.png", full_page=True)

        mp.evaluate('localStorage.setItem("nexatrack_theme","light")')
        mp.reload()
        mp.wait_for_load_state("networkidle")
        time.sleep(1)
        mp.screenshot(path=f"tests/screenshots/{role}-light.png", full_page=True)
        mc.close()

    print("All screenshots saved!")
    b.close()
