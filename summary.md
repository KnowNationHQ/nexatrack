## Summary

### Fixed
- **In Transit page** (`app/admin/shipments/transit/page.tsx`): Changed filter from nonexistent `"in_transit"` status to `in: { status: TRANSIT_STATUSES }` with 6 real transit statuses. Added dynamic `STATUS_LABELS`/`STATUS_COLORS` badges.
- **API route** (`app/api/db/route.ts`): Added `in:` query operator support (destructure `inFilter`, apply `q.in(k, v as any[])`).
- **PDF download** (`app/admin/shipments/[id]/page.tsx`): 
  - Changed from dynamic `import("html2canvas")`/`import("jspdf")` (silently failing) to static top-level imports
  - Added error `toast()` in catch block (was empty `catch {}`)
  - Removed `navigator.share` path (desktop unreliable, requires user gesture)
  - Always downloads via `document.body.appendChild(a); a.click(); document.body.removeChild(a)` — anchor must be in DOM for download to register
  - `setTimeout(() => URL.revokeObjectURL(url), 5000)` — delay revoke to avoid race where blob URL is invalidated before browser starts download

### Not Fixed
- PDF button occasionally returns `receiptRef` null on first click (async component render timing) — guarded by early return, user needs to click again. Next.js build/deploy took ~60s each push.

### Build
- Auto-deploys to Vercel on `git push origin main`
- Chunk hash changes confirm new build is served
