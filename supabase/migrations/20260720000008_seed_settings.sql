INSERT INTO settings (category, name, value)
SELECT 'general', 'brand', '"Nexatrack"'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'general' AND name = 'brand');

INSERT INTO settings (category, name, value)
SELECT 'general', 'phone', '"+1 (506) 501-4402"'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'general' AND name = 'phone');

INSERT INTO settings (category, name, value)
SELECT 'general', 'email', '"info@nexatrack.com"'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'general' AND name = 'email');

INSERT INTO settings (category, name, value)
SELECT 'general', 'address', '"Citrus Park, FL 11950 Sheldon Road, Tampa 33626"'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'general' AND name = 'address');

INSERT INTO settings (category, name, value)
SELECT 'general', 'whatsapp', '"+15065014402"'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'general' AND name = 'whatsapp');

INSERT INTO settings (category, name, value)
SELECT 'general', 'tracking_prefix', '"NXT"'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'general' AND name = 'tracking_prefix');

INSERT INTO settings (category, name, value)
SELECT 'general', 'invoice_prefix', '"INV"'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'general' AND name = 'invoice_prefix');

INSERT INTO settings (category, name, value)
SELECT 'email', 'provider', '"smtp"'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'email' AND name = 'provider');

INSERT INTO settings (category, name, value)
SELECT 'email', 'host', '""'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'email' AND name = 'host');

INSERT INTO settings (category, name, value)
SELECT 'email', 'port', '465'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'email' AND name = 'port');

INSERT INTO settings (category, name, value)
SELECT 'email', 'username', '""'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'email' AND name = 'username');

INSERT INTO settings (category, name, value)
SELECT 'email', 'password', '""'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'email' AND name = 'password');

INSERT INTO settings (category, name, value)
SELECT 'email', 'encryption', '"ssl"'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'email' AND name = 'encryption');

INSERT INTO settings (category, name, value)
SELECT 'email', 'enabled', 'false'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = 'email' AND name = 'enabled');
