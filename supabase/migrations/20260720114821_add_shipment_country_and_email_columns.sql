ALTER TABLE shipments ADD COLUMN IF NOT EXISTS shipper_country text;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_country text;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS shipper_email text;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_email text;
