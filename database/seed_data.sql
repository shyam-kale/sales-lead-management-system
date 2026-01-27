USE sales_lead_db;

-- ----------------------------
-- USERS
-- ----------------------------
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@sales.com', 'admin123', 'ADMIN'),
('john_doe', 'john@sales.com', 'password123', 'SALES_EXECUTIVE');

-- ----------------------------
-- LEADS
-- ----------------------------
INSERT INTO leads (name, email, phone, status) VALUES
('Acme Corp', 'contact@acme.com', '1234567890', 'NEW'),
('Beta Ltd', 'sales@beta.com', '9876543210', 'CONTACTED'),
('Gamma Inc', 'info@gamma.com', '5556667777', 'QUALIFIED');

-- ----------------------------
-- DEALS
-- ----------------------------
INSERT INTO deals (title, amount, stage, lead_id) VALUES
('Acme Initial Deal', 5000.00, 'PROPOSAL', 1),
('Beta Expansion Deal', 12000.00, 'QUALIFIED', 2),
('Gamma Enterprise Deal', 25000.00, 'NEW', 3);
