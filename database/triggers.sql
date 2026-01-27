USE sales_lead_db;

-- Automatically update lead status when a deal is WON
DELIMITER $$

CREATE TRIGGER trg_update_lead_status_after_deal
AFTER INSERT ON deals
FOR EACH ROW
BEGIN
    IF NEW.stage = 'WON' THEN
        UPDATE leads
        SET status = 'CONVERTED'
        WHERE id = NEW.lead_id;
    END IF;
END$$

DELIMITER ;
