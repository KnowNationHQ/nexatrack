-- Profiles: admin all, merchant/driver own
CREATE POLICY admin_all_profiles ON profiles FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY merchant_own_profile ON profiles FOR ALL TO authenticated
  USING (id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant')
  WITH CHECK (id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant');

CREATE POLICY driver_own_profile ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid() AND auth.jwt() ->> 'role' = 'driver');

-- Parcels
CREATE POLICY admin_all_parcels ON parcels FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY merchant_own_parcels ON parcels FOR ALL TO authenticated
  USING (merchant_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant')
  WITH CHECK (merchant_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant');

CREATE POLICY driver_assigned_parcels ON parcels FOR SELECT TO authenticated
  USING (driver_id = auth.uid() AND auth.jwt() ->> 'role' = 'driver');

CREATE POLICY driver_update_parcels ON parcels FOR UPDATE TO authenticated
  USING (driver_id = auth.uid() AND auth.jwt() ->> 'role' = 'driver')
  WITH CHECK (driver_id = auth.uid() AND auth.jwt() ->> 'role' = 'driver');

-- Tracking events: public can read, authenticated can insert
CREATE POLICY public_read_tracking ON tracking_events FOR SELECT
  USING (true);

CREATE POLICY auth_insert_tracking ON tracking_events FOR INSERT TO authenticated
  WITH CHECK (true);

-- Pickup requests
CREATE POLICY admin_all_pickups ON pickup_requests FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY merchant_own_pickups ON pickup_requests FOR ALL TO authenticated
  USING (merchant_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant')
  WITH CHECK (merchant_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant');

-- Wallets
CREATE POLICY admin_all_wallets ON wallets FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY merchant_own_wallet ON wallets FOR SELECT TO authenticated
  USING (merchant_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant');

-- Transactions
CREATE POLICY admin_all_transactions ON transactions FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY merchant_own_transactions ON transactions FOR SELECT TO authenticated
  USING (wallet_id IN (SELECT id FROM wallets WHERE merchant_id = auth.uid()) AND auth.jwt() ->> 'role' = 'merchant');

-- Invoices
CREATE POLICY admin_all_invoices ON invoices FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY merchant_own_invoices ON invoices FOR SELECT TO authenticated
  USING (merchant_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant');

-- Branches
CREATE POLICY admin_all_branches ON branches FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Support tickets
CREATE POLICY admin_all_tickets ON support_tickets FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY merchant_own_tickets ON support_tickets FOR ALL TO authenticated
  USING (merchant_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant')
  WITH CHECK (merchant_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant');

-- Ticket replies
CREATE POLICY admin_all_replies ON ticket_replies FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY merchant_own_replies ON ticket_replies FOR ALL TO authenticated
  USING (sender_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant')
  WITH CHECK (sender_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant');

-- Settings: admin only
CREATE POLICY admin_all_settings ON settings FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Content
CREATE POLICY admin_all_content ON delivery_categories FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_all_delivery_types ON delivery_types FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_all_charges ON delivery_charges FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_all_packaging ON packaging_options FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
