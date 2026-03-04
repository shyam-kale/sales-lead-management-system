-- Sample Tasks for Sales Lead System
-- These are real-world tasks that sales teams need to complete

USE sales_lead_db;

-- Get user and lead IDs
SET @user_id = (SELECT id FROM users WHERE username = 'admin' LIMIT 1);
SET @lead1_id = (SELECT id FROM leads WHERE email = 'priya.deshmukh@techcorp.in' LIMIT 1);
SET @lead2_id = (SELECT id FROM leads WHERE email = 'rahul.patil@innovate.in' LIMIT 1);
SET @lead3_id = (SELECT id FROM leads WHERE email = 'sneha.kulkarni@startup.in' LIMIT 1);
SET @deal1_id = (SELECT id FROM deals WHERE title = 'TechCorp Enterprise License' LIMIT 1);
SET @deal2_id = (SELECT id FROM deals WHERE title = 'Innovate Consulting Package' LIMIT 1);

-- Insert real-world tasks
INSERT INTO tasks (title, description, status, priority, lead_id, deal_id, assigned_to, due_date, created_at, updated_at) VALUES

-- URGENT TASKS - Need immediate attention
('Call Priya Deshmukh - Hot Lead', 'Follow up on enterprise solution inquiry. She requested pricing yesterday. Score: 85. HIGH PRIORITY!', 'PENDING', 'URGENT', @lead1_id, NULL, @user_id, DATE_ADD(NOW(), INTERVAL 2 HOUR), NOW(), NOW()),

('Send Proposal to TechCorp', 'Prepare and send detailed proposal for 500-user enterprise license. Include pricing tiers and implementation timeline.', 'IN_PROGRESS', 'URGENT', @lead1_id, @deal1_id, @user_id, DATE_ADD(NOW(), INTERVAL 1 DAY), NOW(), NOW()),

('Schedule Demo for Sneha Kulkarni', 'Book 30-min product demo. She is qualified and ready. Conversion probability: 95%', 'PENDING', 'HIGH', @lead3_id, NULL, @user_id, DATE_ADD(NOW(), INTERVAL 3 HOUR), NOW(), NOW()),

-- HIGH PRIORITY TASKS
('Follow-up Email to Rahul Patil', 'Send follow-up email with case studies and ROI calculator. He showed interest in consulting package.', 'PENDING', 'HIGH', @lead2_id, @deal2_id, @user_id, DATE_ADD(NOW(), INTERVAL 1 DAY), NOW(), NOW()),

('Prepare Contract for Startup Deal', 'Draft contract for Startup Implementation deal. Deal value: ₹45,000. Expected close: Today', 'IN_PROGRESS', 'HIGH', @lead3_id, (SELECT id FROM deals WHERE title = 'Startup Implementation' LIMIT 1), @user_id, DATE_ADD(NOW(), INTERVAL 4 HOUR), NOW(), NOW()),

('Call Warm Leads - Weekly Touchpoint', 'Call all warm leads (score 60-79) for weekly check-in. Update status and notes.', 'PENDING', 'HIGH', NULL, NULL, @user_id, DATE_ADD(NOW(), INTERVAL 2 DAY), NOW(), NOW()),

-- MEDIUM PRIORITY TASKS
('Update CRM Data - Lead Scoring', 'Review and update lead scores based on recent interactions. Identify new hot leads.', 'PENDING', 'MEDIUM', NULL, NULL, @user_id, DATE_ADD(NOW(), INTERVAL 3 DAY), NOW(), NOW()),

('Send Newsletter to All Leads', 'Send monthly newsletter with product updates and success stories to all leads.', 'PENDING', 'MEDIUM', NULL, NULL, @user_id, DATE_ADD(NOW(), INTERVAL 5 DAY), NOW(), NOW()),

('Prepare Weekly Sales Report', 'Compile weekly sales report: leads generated, deals closed, revenue, conversion rates.', 'PENDING', 'MEDIUM', NULL, NULL, @user_id, DATE_ADD(NOW(), INTERVAL 7 DAY), NOW(), NOW()),

('Research Competitor Pricing', 'Research competitor pricing for enterprise solutions. Update our pricing strategy.', 'PENDING', 'MEDIUM', NULL, NULL, @user_id, DATE_ADD(NOW(), INTERVAL 10 DAY), NOW(), NOW()),

-- LOW PRIORITY TASKS
('Clean Up Old Leads', 'Archive or delete leads with no activity in last 90 days. Keep database clean.', 'PENDING', 'LOW', NULL, NULL, @user_id, DATE_ADD(NOW(), INTERVAL 14 DAY), NOW(), NOW()),

('Update LinkedIn Profile', 'Update LinkedIn profile with recent achievements and testimonials.', 'PENDING', 'LOW', NULL, NULL, @user_id, DATE_ADD(NOW(), INTERVAL 20 DAY), NOW(), NOW()),

-- COMPLETED TASKS (for reference)
('Initial Contact - Priya Deshmukh', 'Made first contact via email. She responded positively and requested more information.', 'COMPLETED', 'HIGH', @lead1_id, NULL, @user_id, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

('Send Welcome Email to New Leads', 'Sent automated welcome email to all new leads from this week.', 'COMPLETED', 'MEDIUM', NULL, NULL, @user_id, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());

-- Sample activities for completed tasks
INSERT INTO activities (activity_type, title, description, lead_id, deal_id, user_id, activity_date, created_at) VALUES
('CALL', 'Initial Contact Call - Priya Deshmukh', 'Called Priya to discuss enterprise solution. Very interested. Requested pricing and demo.', @lead1_id, NULL, @user_id, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
('EMAIL', 'Sent Proposal - TechCorp', 'Sent detailed proposal with pricing tiers. Awaiting response.', @lead1_id, @deal1_id, @user_id, DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW()),
('MEETING', 'Demo Scheduled - Sneha Kulkarni', 'Scheduled product demo for tomorrow at 2 PM. She is very interested.', @lead3_id, NULL, @user_id, DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),
('CALL', 'Follow-up Call - Rahul Patil', 'Discussed consulting package. He needs to check budget. Follow up next week.', @lead2_id, @deal2_id, @user_id, DATE_SUB(NOW(), INTERVAL 3 HOUR), NOW());

COMMIT;

SELECT 'Sample tasks and activities created successfully!' as Status;
SELECT COUNT(*) as 'Total Tasks' FROM tasks;
SELECT COUNT(*) as 'Pending Tasks' FROM tasks WHERE status = 'PENDING';
SELECT COUNT(*) as 'Urgent Tasks' FROM tasks WHERE priority = 'URGENT';
