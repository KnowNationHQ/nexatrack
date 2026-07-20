### Task 2: Auto-Generate Tracking Numbers

**Files:**
- Modify: `supabase/functions/shipments-api/index.ts`

**Interfaces:**
- Consumes: `create-shipment` action receives `body.tracking_number` (nullable)
- Produces: auto-generated tracking number `NXT-YYYYNNNNN` when input is empty

- [ ] **Step 1: Add auto-generation logic in the edge function**

In `supabase/functions/shipments-api/index.ts`, modify the `create-shipment`
action handler. Before the insert, if `body.tracking_number` is falsy, generate:

```typescript
// Ponytail: sequential from existing max — fine until 100k shipments
if (!body.tracking_number) {
  const { data: maxRow } = await supabase
    .from('shipments')
    .select('tracking_number')
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle()
  let seq = 1
  if (maxRow?.tracking_number) {
    const parts = maxRow.tracking_number.split('-')
    seq = (parseInt(parts[1] || '0') % 100000) + 1
  }
  const year = new Date().getFullYear()
  body.tracking_number = `NXT-${year}${String(seq).padStart(5, '0')}`
}
```

Add this block right before the existing `const { data, error } = await
supabase.from('shipments').insert({...})` line.

Also add `shipper_country: body.shipper_country || null` and
`receiver_country: body.receiver_country || null` to the insert payload so
the dashboard fields aren't silently dropped.

- [ ] **Step 2: Deploy the updated edge function**

```bash
supabase functions deploy shipments-api
```

- [ ] **Step 3: Test via dashboard**

Open admin dashboard → Shipping → Create → leave tracking number blank →
submit → verify a tracking number like `NXT-202600001` appears.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: auto-generate tracking numbers (NXT-YYYYNNNNN)"
```
