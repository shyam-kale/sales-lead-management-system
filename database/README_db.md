# Sales Lead System – Database

## Database Name
sales_lead_db

## Tables
- users
- leads
- deals

## Relationships
- One Lead → Many Deals
- Deals reference Leads using foreign keys

## Scripts
- schema.sql → Create tables
- seed_data.sql → Insert sample data
- indexes.sql → Performance indexes
- triggers.sql → Automatic lead status update
- views.sql → Reporting views
- stored_procedures.sql → Business logic
- backup_script.sql → Manual backup

## Notes
- MySQL Version: 8.x
- Engine: InnoDB
- Charset: utf8mb4
