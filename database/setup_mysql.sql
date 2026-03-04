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
    @user_id, 'Rajesh', 'Patil', '+91 98765 43210', 'Sales Manager', 'Sales', 
    'Mumbai, Maharashtra', 'Experienced sales professional with 5+ years in lead management.',
    TRUE, FALSE, TRUE, FALSE,
    '09:00:00', '17:00:00', 'Asia/Kolkata', '["Monday","Tuesday","Wednesday","Thursday","Friday"]',
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
(@user_id, 'timezone', 'Asia/Kolkata', 'string', NOW(), NOW()),
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

-- Insert Maharashtrian leads
INSERT INTO leads (name, email, phone, company, status, source, assigned_to, notes, score, created_at, updated_at) VALUES
('Priya Deshmukh', 'priya.deshmukh@techcorp.in', '+91 98765 43210', 'TechCorp Pune', 'NEW', 'Website', @user_id, 'Interested in enterprise solution', 85, NOW(), NOW()),
('Rahul Patil', 'rahul.patil@innovate.in', '+91 98765 43211', 'Innovate Mumbai', 'CONTACTED', 'Referral', @user_id, 'Follow up scheduled', 70, NOW(), NOW()),
('Sneha Kulkarni', 'sneha.kulkarni@startup.in', '+91 98765 43212', 'Startup Nagpur', 'QUALIFIED', 'LinkedIn', @user_id, 'Ready for demo', 95, NOW(), NOW()),
('Amit Joshi', 'amit.joshi@bigcorp.in', '+91 98765 43213', 'BigCorp Nashik', 'NEW', 'Cold Call', @user_id, 'Initial contact made', 60, NOW(), NOW()),
('Pooja Sharma', 'pooja.sharma@solutions.in', '+91 98765 43214', 'Solutions Aurangabad', 'CONTACTED', 'Trade Show', @user_id, 'Requested pricing', 75, NOW(), NOW()),
('Vikram Pawar', 'vikram.pawar@enterprises.in', '+91 98765 43215', 'Enterprises Kolhapur', 'NEW', 'Website', @user_id, 'Looking for CRM', 80, NOW(), NOW()),
('Anjali Bhosale', 'anjali.bhosale@techsol.in', '+91 98765 43216', 'TechSol Solapur', 'QUALIFIED', 'Referral', @user_id, 'Budget approved', 90, NOW(), NOW()),
('Sanjay Jadhav', 'sanjay.jadhav@infotech.in', '+91 98765 43217', 'Infotech Satara', 'CONTACTED', 'Email Campaign', @user_id, 'Interested in demo', 65, NOW(), NOW()),
('Manisha Shinde', 'manisha.shinde@digital.in', '+91 98765 43218', 'Digital Sangli', 'NEW', 'LinkedIn', @user_id, 'Initial inquiry', 70, NOW(), NOW()),
('Rajesh Kale', 'rajesh.kale@systems.in', '+91 98765 43219', 'Systems Ahmednagar', 'QUALIFIED', 'Website', @user_id, 'Ready to close', 95, NOW(), NOW()),
('Kavita Desai', 'kavita.desai@solutions.in', '+91 98765 43220', 'Solutions Thane', 'NEW', 'Referral', @user_id, 'New inquiry', 55, NOW(), NOW()),
('Suresh Mane', 'suresh.mane@tech.in', '+91 98765 43221', 'Tech Latur', 'CONTACTED', 'Website', @user_id, 'Follow up needed', 68, NOW(), NOW()),
('Deepak Rao', 'deepak.rao@corp.in', '+91 98765 43222', 'Corp Nanded', 'QUALIFIED', 'LinkedIn', @user_id, 'High potential', 88, NOW(), NOW()),
('Swati Ghosh', 'swati.ghosh@enterprises.in', '+91 98765 43223', 'Enterprises Jalgaon', 'NEW', 'Cold Call', @user_id, 'Initial discussion', 62, NOW(), NOW()),
('Nitin Wagh', 'nitin.wagh@digital.in', '+91 98765 43224', 'Digital Akola', 'CONTACTED', 'Trade Show', @user_id, 'Proposal sent', 77, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Get lead IDs for deals
SET @lead1_id = (SELECT id FROM leads WHERE email = 'priya.deshmukh@techcorp.in' LIMIT 1);
SET @lead2_id = (SELECT id FROM leads WHERE email = 'rahul.patil@innovate.in' LIMIT 1);
SET @lead3_id = (SELECT id FROM leads WHERE email = 'sneha.kulkarni@startup.in' LIMIT 1);
SET @lead4_id = (SELECT id FROM leads WHERE email = 'amit.joshi@bigcorp.in' LIMIT 1);
SET @lead5_id = (SELECT id FROM leads WHERE email = 'pooja.sharma@solutions.in' LIMIT 1);

-- Insert sample deals
INSERT INTO deals (title, description, amount, stage, probability, expected_close_date, lead_id, assigned_to, notes, created_at, updated_at) VALUES
('TechCorp Enterprise License', 'Annual enterprise software license', 125000.00, 'PROPOSAL', 75, DATE_ADD(CURDATE(), INTERVAL 30 DAY), @lead1_id, @user_id, 'Proposal sent', NOW(), NOW()),
('Innovate Consulting Package', 'Six-month consulting engagement', 85000.00, 'QUALIFIED', 60, DATE_ADD(CURDATE(), INTERVAL 45 DAY), @lead2_id, @user_id, 'Budget approved', NOW(), NOW()),
('Startup Implementation', 'Custom implementation and training', 45000.00, 'CLOSED', 100, CURDATE(), @lead3_id, @user_id, 'Deal closed', NOW(), NOW()),
('BigCorp Pilot Program', 'Three-month pilot program', 25000.00, 'NEW', 30, DATE_ADD(CURDATE(), INTERVAL 60 DAY), @lead4_id, @user_id, 'Initial discussions', NOW(), NOW()),
('Solutions Integration', 'API integration and setup', 35000.00, 'PROPOSAL', 50, DATE_ADD(CURDATE(), INTERVAL 21 DAY), @lead5_id, @user_id, 'Technical review', NOW(), NOW())
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