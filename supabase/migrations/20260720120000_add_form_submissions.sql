CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('contact', 'quote', 'newsletter')),
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted BOOLEAN NOT NULL DEFAULT false,
  shipment_id UUID REFERENCES shipments(id) ON DELETE SET NULL
);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS anon_insert_form_submissions ON form_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS auth_select_form_submissions ON form_submissions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY IF NOT EXISTS auth_update_form_submissions ON form_submissions
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);