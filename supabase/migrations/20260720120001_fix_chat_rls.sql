DROP POLICY IF EXISTS anon_insert_messages ON livechat_messages;
CREATE POLICY anon_insert_messages ON livechat_messages
  FOR INSERT TO anon
  WITH CHECK (true);
