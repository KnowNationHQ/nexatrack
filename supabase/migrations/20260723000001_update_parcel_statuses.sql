ALTER TABLE parcels DROP CONSTRAINT IF EXISTS parcels_status_check;

ALTER TABLE parcels ADD CONSTRAINT parcels_status_check
  CHECK (status IN (
    'pending',
    'processing',
    'cargo_on_air',
    'on_transit',
    'cargo_on_transit',
    'custom_check',
    'on_customs_hold',
    'cargo_on_move',
    'arrived',
    'out_for_delivery',
    'on_hold'
  ));
