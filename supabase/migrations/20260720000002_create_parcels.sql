CREATE TABLE IF NOT EXISTS parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT UNIQUE NOT NULL,
  merchant_id UUID REFERENCES profiles(id),
  driver_id UUID REFERENCES profiles(id),
  branch_id UUID,
  sender_name TEXT NOT NULL,
  sender_phone TEXT,
  sender_address TEXT,
  receiver_name TEXT NOT NULL,
  receiver_phone TEXT,
  receiver_address TEXT,
  origin_city TEXT,
  destination_city TEXT,
  weight NUMERIC(10,2),
  dimensions TEXT,
  category_id UUID,
  delivery_type_id UUID,
  delivery_charge NUMERIC(10,2) DEFAULT 0,
  cod_amount NUMERIC(10,2) DEFAULT 0,
  selling_price NUMERIC(10,2) DEFAULT 0,
  vat_amount NUMERIC(10,2) DEFAULT 0,
  cod_charge NUMERIC(10,2) DEFAULT 0,
  liquid_fragile_charge NUMERIC(10,2) DEFAULT 0,
  packaging_charge NUMERIC(10,2) DEFAULT 0,
  current_payable NUMERIC(10,2) DEFAULT 0,
  total_charge NUMERIC(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'cod', 'processing')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'pickup_assign', 'picked_up', 'received_warehouse', 'delivery_man_assign', 'in_transit', 'out_for_delivery', 'partial_delivered', 'delivered', 'return_assign_to_merchant', 'return_received_by_merchant', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'high')),
  packaging_id UUID,
  notes TEXT,
  barcode_url TEXT,
  invoice_no TEXT,
  pickup_phone TEXT,
  pickup_address TEXT,
  pickup_lat NUMERIC(10,7),
  pickup_long NUMERIC(10,7),
  receiver_lat NUMERIC(10,7),
  receiver_long NUMERIC(10,7),
  pod_photo_url TEXT,
  pod_signature_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  photo_url TEXT,
  event_time TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES profiles(id),
  address TEXT NOT NULL,
  city TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'picked', 'cancelled')),
  driver_id UUID REFERENCES profiles(id),
  parcel_count INT DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;
