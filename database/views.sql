USE sales_lead_db;

-- View to see lead + deal summary
CREATE OR REPLACE VIEW lead_deal_summary AS
SELECT 
    l.id AS lead_id,
    l.name AS lead_name,
    l.email,
    l.status AS lead_status,
    d.id AS deal_id,
    d.title AS deal_title,
    d.amount,
    d.stage AS deal_stage
FROM leads l
LEFT JOIN deals d ON l.id = d.lead_id;
