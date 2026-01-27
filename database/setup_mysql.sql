-- Setup script for MySQL database
-- Run this script to create the database and insert sample data

-- Create database and use it
CREATE DATABASE IF NOT EXISTS sales_lead_db;
USE sales_lead_db;

-- Insert sample user
INSERT INTO users (username, email, password, role, created_at, updated_at) 
VALUES ('admin', 'admin@company.com', 'password123', 'ADMIN', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Get the user ID for foreign key references
SET @user_id = (SELECT id FROM users WHERE username = 'admin' LIMIT 1);

-- Insert sample user profile
INSERT INTO user_profiles (
    user_id, first_name, last_name, phone, title, department, location, bio,
    email_notifications, push_notifications, weekly_reports, marketing_emails,
    working_hours_start, working_hours_end, timezone, working_days,
    total_logins, created_at, updated_at
) VALUES (
    @user_id, 'John', 'Doe', '+1 (555) 123-4567', 'Sales Manager', 'Sales', 
    'New York, NY', 'Experienced sales professional with 5+ years in lead management and customer acquisition.',
    TRUE, FALSE, TRUE, FALSE,
    '09:00:00', '17:00:00', 'America/New_York', '["Monday","Tuesday","Wednesday","Thursday","Friday"]',
    342, NOW(), NOW()
) ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Insert sample system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, created_at, updated_at) VALUES
('app_name', 'Sales Lead Management System', 'string', 'Application name', NOW(), NOW()),
('default_theme', 'light', 'string', 'Default theme for new users', NOW(), NOW()),
('max_file_upload_size', '10485760', 'integer', 'Maximum file upload size in bytes', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Insert sample user settings
INSERT INTO user_settings (user_id, setting_key, setting_value, setting_type, created_at, updated_at) VALUES
(@user_id, 'appName', 'Sales Lead Management System', 'string', NOW(), NOW()),
(@user_id, 'theme', 'light', 'string', NOW(), NOW()),
(@user_id, 'language', 'en', 'string', NOW(), NOW()),
(@user_id, 'timezone', 'UTC', 'string', NOW(), NOW()),
(@user_id, 'defaultView', 'dashboard', 'string', NOW(), NOW()),
(@user_id, 'refreshInterval', '30', 'integer', NOW(), NOW()),
(@user_id, 'showNotifications', 'true', 'boolean', NOW(), NOW()),
(@user_id, 'autoSave', 'true', 'boolean', NOW(), NOW()),
(@user_id, 'leadStatuses', '["NEW","CONTACTED","QUALIFIED"]', 'json', NOW(), NOW()),
(@user_id, 'defaultLeadStatus', 'NEW', 'string', NOW(), NOW()),
(@user_id, 'leadAutoAssign', 'false', 'boolean', NOW(), NOW()),
(@user_id, 'leadNotifications', 'true', 'boolean', NOW(), NOW()),
(@user_id, 'dealStages', '["NEW","PROPOSAL","QUALIFIED","CLOSED"]', 'json', NOW(), NOW()),
(@user_id, 'defaultDealStage', 'NEW', 'string', NOW(), NOW()),
(@user_id, 'dealAutoAssign', 'false', 'boolean', NOW(), NOW()),
(@user_id, 'dealNotifications', 'true', 'boolean', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Insert sample leads
INSERT INTO leads (name, email, phone, company, status, source, assigned_to, notes, score, created_at, updated_at) VALUES
('Alice Johnson', 'alice.johnson@techcorp.com', '+1 (555) 234-5678', 'TechCorp Inc.', 'NEW', 'Website', @user_id, 'Interested in enterprise solution', 85, NOW(), NOW()),
('Bob Smith', 'bob.smith@innovate.com', '+1 (555) 345-6789', 'Innovate LLC', 'CONTACTED', 'Referral', @user_id, 'Follow up scheduled for next week', 70, NOW(), NOW()),
('Carol Davis', 'carol.davis@startup.io', '+1 (555) 456-7890', 'Startup.io', 'QUALIFIED', 'LinkedIn', @user_id, 'Ready for demo presentation', 95, NOW(), NOW()),
('David Wilson', 'david.wilson@bigcorp.com', '+1 (555) 567-8901', 'BigCorp', 'NEW', 'Cold Call', @user_id, 'Initial contact made', 60, NOW(), NOW()),
('Eva Brown', 'eva.brown@solutions.net', '+1 (555) 678-9012', 'Solutions.net', 'CONTACTED', 'Trade Show', @user_id, 'Requested pricing information', 75, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Get lead IDs for deals
SET @lead1_id = (SELECT id FROM leads WHERE email = 'alice.johnson@techcorp.com' LIMIT 1);
SET @lead2_id = (SELECT id FROM leads WHERE email = 'bob.smith@innovate.com' LIMIT 1);
SET @lead3_id = (SELECT id FROM leads WHERE email = 'carol.davis@startup.io' LIMIT 1);
SET @lead4_id = (SELECT id FROM leads WHERE email = 'david.wilson@bigcorp.com' LIMIT 1);
SET @lead5_id = (SELECT id FROM leads WHERE email = 'eva.brown@solutions.net' LIMIT 1);

-- Insert sample deals
INSERT INTO deals (title, description, amount, stage, probability, expected_close_date, lead_id, assigned_to, notes, created_at, updated_at) VALUES
('TechCorp Enterprise License', 'Annual enterprise software license for 500 users', 125000.00, 'PROPOSAL', 75, DATE_ADD(CURDATE(), INTERVAL 30 DAY), @lead1_id, @user_id, 'Proposal sent, awaiting decision', NOW(), NOW()),
('Innovate Consulting Package', 'Six-month consulting engagement', 85000.00, 'QUALIFIED', 60, DATE_ADD(CURDATE(), INTERVAL 45 DAY), @lead2_id, @user_id, 'Budget approved, finalizing scope', NOW(), NOW()),
('Startup.io Implementation', 'Custom implementation and training', 45000.00, 'CLOSED', 100, CURDATE(), @lead3_id, @user_id, 'Deal closed successfully', NOW(), NOW()),
('BigCorp Pilot Program', 'Three-month pilot program', 25000.00, 'NEW', 30, DATE_ADD(CURDATE(), INTERVAL 60 DAY), @lead4_id, @user_id, 'Initial discussions ongoing', NOW(), NOW()),
('Solutions.net Integration', 'API integration and setup', 35000.00, 'PROPOSAL', 50, DATE_ADD(CURDATE(), INTERVAL 21 DAY), @lead5_id, @user_id, 'Technical requirements being reviewed', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Insert sample activities
INSERT INTO activities (activity_type, title, description, lead_id, deal_id, user_id, activity_date, created_at) VALUES
('CALL', 'Initial Contact Call', 'Made first contact with prospect', @lead1_id, NULL, @user_id, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
('EMAIL', 'Proposal Sent', 'Sent detailed proposal document', @lead1_id, (SELECT id FROM deals WHERE title = 'TechCorp Enterprise License' LIMIT 1), @user_id, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
('MEETING', 'Demo Presentation', 'Conducted product demonstration', @lead3_id, NULL, @user_id, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
('CALL', 'Follow-up Call', 'Discussed pricing and next steps', @lead2_id, NULL, @user_id, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
('EMAIL', 'Contract Signed', 'Received signed contract', @lead3_id, (SELECT id FROM deals WHERE title = 'Startup.io Implementation' LIMIT 1), @user_id, NOW(), NOW())
ON DUPLICATE KEY UPDATE created_at = NOW();

-- Insert sample analytics data
INSERT INTO analytics_data (metric_name, metric_value, metric_type, period_start, period_end, user_id, metadata, created_at) VALUES
('leads_generated', 156, 'count', DATE_SUB(CURDATE(), INTERVAL 90 DAY), CURDATE(), @user_id, '{"source": "quarterly_report"}', NOW()),
('deals_closed', 12, 'count', DATE_SUB(CURDATE(), INTERVAL 30 DAY), CURDATE(), @user_id, '{"source": "monthly_report"}', NOW()),
('total_revenue', 245000.00, 'currency', DATE_SUB(CURDATE(), INTERVAL 365 DAY), CURDATE(), @user_id, '{"source": "annual_report"}', NOW()),
('conversion_rate', 18.5, 'percentage', DATE_SUB(CURDATE(), INTERVAL 90 DAY), CURDATE(), @user_id, '{"source": "quarterly_report"}', NOW()),
('avg_deal_size', 20416.67, 'currency', DATE_SUB(CURDATE(), INTERVAL 90 DAY), CURDATE(), @user_id, '{"source": "quarterly_report"}', NOW())
ON DUPLICATE KEY UPDATE created_at = NOW();

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, notification_type, is_read, action_url, created_at) VALUES
(@user_id, 'New Lead Assigned', 'You have been assigned a new lead: Alice Johnson', 'LEAD_ASSIGNMENT', FALSE, '/leads/1', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(@user_id, 'Deal Update Required', 'Please update the status of TechCorp Enterprise License deal', 'DEAL_UPDATE', FALSE, '/deals/1', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(@user_id, 'Weekly Report Ready', 'Your weekly performance report is now available', 'REPORT', TRUE, '/reports/weekly', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE created_at = NOW();

COMMIT;

-- Display summary
SELECT 'Database setup completed successfully!' as Status;
SELECT COUNT(*) as 'Total Users' FROM users;
SELECT COUNT(*) as 'Total Leads' FROM leads;
SELECT COUNT(*) as 'Total Deals' FROM deals;
SELECT COUNT(*) as 'Total Activities' FROM activities;
SELECT COUNT(*) as 'Total User Settings' FROM user_settings;