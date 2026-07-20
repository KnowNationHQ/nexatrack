CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'FL',
  phone TEXT,
  email TEXT,
  contact_person TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  manager_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
