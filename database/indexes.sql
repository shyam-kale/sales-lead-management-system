USE sales_lead_db;

-- Index for faster lead status filtering
CREATE INDEX idx_leads_status ON leads(status);

-- Index for searching leads by email
CREATE INDEX idx_leads_email ON leads(email);

-- Index for deal stage filtering
CREATE INDEX idx_deals_stage ON deals(stage);

-- Index for joining deals with leads
CREATE INDEX idx_deals_lead_id ON deals(lead_id);
