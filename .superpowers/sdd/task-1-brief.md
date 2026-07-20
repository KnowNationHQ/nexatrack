### Task 1: RLS Lockdown

**Files:**
- Modify: `shipments` table RLS (via Supabase migration)

**Interfaces:**
- Consumes: existing `shipments` table with `anon_select_shipments` policy
- Produces: locked-down `shipments` table where anon cannot list all rows

- [ ] **Step 1: Drop the insecure anon policy**

Run in Supabase SQL editor:
```sql
DROP POLICY IF EXISTS anon_select_shipments ON shipments;
```

- [ ] **Step 2: Create restrictive anon policy**

```sql
CREATE POLICY anon_select_shipments ON shipments
  FOR SELECT TO anon
  USING (false);
```

Public tracking queries go through the edge function (service role) — anon
doesn't need direct SELECT access.

- [ ] **Step 3: Verify**

```sql
-- Should return 0 rows when run as anon
SELECT * FROM shipments LIMIT 1;
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: lock down anon shipments RLS to prevent enumeration"
```
