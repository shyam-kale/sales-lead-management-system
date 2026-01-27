USE sales_lead_db;

DELIMITER $$

-- Get all deals for a given lead
CREATE PROCEDURE get_deals_by_lead(IN p_lead_id BIGINT)
BEGIN
    SELECT *
    FROM deals
    WHERE lead_id = p_lead_id;
END$$

-- Get total deal value by stage
CREATE PROCEDURE get_total_deal_amount_by_stage(IN p_stage VARCHAR(50))
BEGIN
    SELECT 
        stage,
        SUM(amount) AS total_amount
    FROM deals
    WHERE stage = p_stage
    GROUP BY stage;
END$$

DELIMITER ;
