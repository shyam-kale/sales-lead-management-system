CREATE DATABASE IF NOT EXISTS sales_lead_db;
USE sales_lead_db;

-- ----------------------------
-- USERS TABLE
-- ----------------------------
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- USER PROFILES TABLE
-- ----------------------------
CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    title VARCHAR(100),
    department VARCHAR(100),
    location VARCHAR(200),
    bio TEXT,
    avatar_url VARCHAR(500),
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    weekly_reports BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    working_hours_start TIME DEFAULT '09:00:00',
    working_hours_end TIME DEFAULT '17:00:00',
    timezone VARCHAR(100) DEFAULT 'UTC',
    working_days JSON,
    last_login DATETIME,
    total_logins INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ----------------------------
-- SYSTEM SETTINGS TABLE
-- ----------------------------
CREATE TABLE system_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- USER SETTINGS TABLE
-- ----------------------------
CREATE TABLE user_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_settings_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    UNIQUE KEY unique_user_setting (user_id, setting_key)
);

-- ----------------------------
-- LEADS TABLE (Enhanced)
-- ----------------------------
CREATE TABLE leads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(50),
    company VARCHAR(200),
    status VARCHAR(50) DEFAULT 'NEW',
    source VARCHAR(100),
    assigned_to BIGINT,
    notes TEXT,
    score INT DEFAULT 0,
    last_contacted DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lead_assigned_user
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ----------------------------
-- DEALS TABLE (Enhanced)
-- ----------------------------
CREATE TABLE deals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    amount DECIMAL(12,2),
    stage VARCHAR(50) DEFAULT 'NEW',
    probability INT DEFAULT 0,
    expected_close_date DATE,
    actual_close_date DATE,
    lead_id BIGINT NOT NULL,
    assigned_to BIGINT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_deal_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_deal_assigned_user
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ----------------------------
-- ACTIVITIES TABLE (For tracking interactions)
-- ----------------------------
CREATE TABLE activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    lead_id BIGINT,
    deal_id BIGINT,
    user_id BIGINT,
    activity_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_lead
        FOREIGN KEY (lead_id)
        REFERENCES leads(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_activity_deal
        FOREIGN KEY (deal_id)
        REFERENCES deals(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ----------------------------
-- ANALYTICS DATA TABLE
-- ----------------------------
CREATE TABLE analytics_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_type VARCHAR(50),
    period_start DATE,
    period_end DATE,
    user_id BIGINT,
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_analytics_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    INDEX idx_analytics_metric (metric_name, period_start, period_end),
    INDEX idx_analytics_user (user_id, metric_name)
);

-- ----------------------------
-- REPORTS TABLE
-- ----------------------------
CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(200) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    report_config JSON,
    report_data JSON,
    generated_by BIGINT,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_scheduled BOOLEAN DEFAULT FALSE,
    schedule_config JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_report_user
        FOREIGN KEY (generated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ----------------------------
-- NOTIFICATIONS TABLE
-- ----------------------------
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    INDEX idx_notifications_user_unread (user_id, is_read, created_at)
);

-- ----------------------------
-- CUSTOM FIELDS TABLE (For extensibility)
-- ----------------------------
CREATE TABLE custom_fields (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_value TEXT,
    field_type VARCHAR(50) DEFAULT 'string',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_custom_fields_entity (entity_type, entity_id),
    INDEX idx_custom_fields_name (field_name)
);

-- ----------------------------
-- AUDIT LOG TABLE
-- ----------------------------
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    INDEX idx_audit_user_action (user_id, action, created_at),
    INDEX idx_audit_entity (entity_type, entity_id)
);
