# MySQL Setup Guide for Sales Lead Management System

This guide will help you set up the application to use MySQL database instead of the in-memory H2 database.

## Prerequisites

1. **MySQL Server** - Install MySQL 8.0 or later
2. **Java 17** - Already installed
3. **Maven** - Already installed
4. **Node.js** - Already installed

## Step 1: Install and Configure MySQL

### Windows (using MySQL Installer)
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Install MySQL Server 8.0 with default settings
3. Set root password (leave empty for development or use a simple password)
4. Start MySQL service

### Alternative: Using XAMPP
1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP
3. Start Apache and MySQL services from XAMPP Control Panel

## Step 2: Create Database and Tables

1. **Open MySQL Command Line** or use phpMyAdmin (if using XAMPP)

2. **Run the schema creation script:**
   ```sql
   source database/schema.sql
   ```
   
   Or copy and paste the contents of `database/schema.sql` into your MySQL client.

3. **Run the setup script with sample data:**
   ```sql
   source database/setup_mysql.sql
   ```
   
   Or copy and paste the contents of `database/setup_mysql.sql` into your MySQL client.

## Step 3: Update Database Configuration

The application is already configured to use MySQL. The configuration is in:
`backend/src/main/resources/application.properties`

**Current MySQL configuration:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sales_lead_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

**If you set a MySQL root password, update the password:**
```properties
spring.datasource.password=your_mysql_password
```

## Step 4: Start the Application

1. **Start the Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   
   Or use the full Maven path:
   ```bash
   C:\Users\shyam\scoop\apps\maven\current\bin\mvn spring-boot:run
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## Step 5: Verify the Setup

1. **Check Backend:** Visit http://localhost:8081/api/leads
   - Should return JSON data with sample leads

2. **Check Frontend:** Visit http://localhost:5173
   - Should load the application with data from MySQL

3. **Test Features:**
   - Navigate to different sections (Dashboard, Leads, Deals, Analytics, Reports, Settings, Profile)
   - All data should be persisted in MySQL
   - Settings and Profile changes should be saved to the database

## Database Features Now Available

### ✅ **Data Persistence**
- All leads, deals, and user data stored in MySQL
- No more data loss on page refresh

### ✅ **User Profiles**
- Personal information (name, title, department, etc.)
- Preferences (notifications, working hours)
- Activity tracking (login history)

### ✅ **Settings Management**
- Application settings stored per user
- Customizable lead statuses and deal stages
- Theme and language preferences

### ✅ **Enhanced Data Model**
- User assignments for leads and deals
- Activity tracking and audit logs
- Custom fields support
- Analytics data storage

### ✅ **API Endpoints**
- `/api/profile` - User profile management
- `/api/settings` - User settings management
- `/api/activities` - Activity tracking
- All existing lead and deal endpoints enhanced

## Troubleshooting

### MySQL Connection Issues
1. **Check MySQL is running:**
   - Windows: Check Services or XAMPP Control Panel
   - Verify MySQL is listening on port 3306

2. **Check credentials:**
   - Default username: `root`
   - Default password: empty (or what you set during installation)

3. **Check database exists:**
   ```sql
   SHOW DATABASES;
   USE sales_lead_db;
   SHOW TABLES;
   ```

### Backend Startup Issues
1. **Check logs for database connection errors**
2. **Verify MySQL JDBC driver is included** (already in pom.xml)
3. **Check application.properties configuration**

### Data Not Loading
1. **Verify sample data was inserted:**
   ```sql
   SELECT COUNT(*) FROM leads;
   SELECT COUNT(*) FROM deals;
   ```

2. **Check API endpoints directly:**
   - http://localhost:8081/api/leads
   - http://localhost:8081/api/deals

## Sample Data Included

The setup script includes:
- **1 Admin User** with full profile
- **5 Sample Leads** with different statuses
- **5 Sample Deals** in various stages
- **Default Settings** for the application
- **Sample Activities** and notifications
- **Analytics Data** for reporting

## Next Steps

With MySQL now configured, you can:
1. **Add more users** through the database
2. **Customize settings** through the Settings page
3. **Update your profile** through the Profile page
4. **Add real leads and deals** - they'll be saved permanently
5. **Generate reports** with persistent data
6. **Track activities** and user interactions

All changes made through the frontend will now be permanently stored in MySQL!