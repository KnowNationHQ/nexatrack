CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'merchant' CHECK (role IN ('admin', 'merchant', 'driver')),
  avatar TEXT,
  branch_id UUID,
  business_name TEXT,
  unique_id TEXT,
  opening_balance NUMERIC(12,2) DEFAULT 0,
  vat NUMERIC(5,2) DEFAULT 0,
  cod_charges JSONB DEFAULT '{}',
  nid TEXT,
  trade_license TEXT,
  address TEXT,
  payment_period_days INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
