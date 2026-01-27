# Sales Lead Management System

A modern, full-stack Sales Lead & Deal Pipeline Management system with advanced analytics, user management, and a beautiful 2026-style UI.

## 🚀 Features

### 📊 **Dashboard & Analytics**
- Real-time performance metrics with growth indicators
- Interactive charts and trend analysis
- Customizable date ranges and filters
- Export capabilities (CSV, JSON, PDF)
- Advanced funnel analysis and conversion tracking

### 👥 **Lead Management**
- Complete lead lifecycle management
- Lead scoring and assignment
- Status tracking (NEW, CONTACTED, QUALIFIED)
- Activity logging and notes
- Bulk operations and search

### 💼 **Deal Pipeline**
- Visual deal pipeline with stages
- Revenue tracking and forecasting
- Probability-based deal management
- Deal-to-lead relationship tracking
- Performance analytics

### 📈 **Advanced Analytics**
- Performance overview with KPIs
- Sales funnel visualization
- Trend analysis with customizable charts
- Lead velocity and deal velocity metrics
- Conversion rate optimization insights

### 📄 **Reports & Insights**
- Executive summary reports
- Detailed lead and deal reports
- Customizable report generation
- Multiple export formats
- Scheduled reporting (planned)

### ⚙️ **Settings & Configuration**
- User-specific settings management
- Customizable lead statuses and deal stages
- Theme and language preferences
- Working hours and timezone settings
- Email and notification preferences

### 👤 **User Profile Management**
- Complete user profiles with avatars
- Personal information management
- Activity tracking and login history
- Performance metrics display
- Preference management

### 🎨 **Modern UI/UX**
- 2026-style design with glassmorphism effects
- Animated gradients and modern aesthetics
- Responsive design for all devices
- Dark/light theme support
- Smooth animations and transitions

## 🛠 Tech Stack

### Backend
- **Java 17** - Modern Java features
- **Spring Boot 3.1.5** - Latest Spring framework
- **Spring Data JPA** - Database abstraction
- **MySQL 8.0** - Persistent data storage
- **Maven** - Dependency management

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Modern CSS** - Glassmorphism, gradients, animations
- **Responsive Design** - Mobile-first approach

### Database
- **MySQL 8.0** - Production-ready database
- **Advanced Schema** - Users, profiles, settings, activities
- **Relationships** - Proper foreign keys and constraints
- **JSON Support** - Flexible data storage

## 📁 Project Structure

```
sales-lead-management/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/com/sales/
│   │   ├── User.java          # User entity
│   │   ├── UserProfile.java   # User profile entity
│   │   ├── UserSetting.java   # User settings entity
│   │   ├── Lead.java          # Enhanced lead entity
│   │   ├── Deal.java          # Enhanced deal entity
│   │   ├── Activity.java      # Activity tracking
│   │   ├── *Controller.java   # REST controllers
│   │   ├── *Repository.java   # Data repositories
│   │   └── SalesApp.java      # Main application
│   ├── src/main/resources/
│   │   └── application.properties # Database config
│   └── pom.xml                # Maven dependencies
├── frontend/                   # React Application
│   ├── src/
│   │   ├── App.jsx            # Main app with 7 navigation items
│   │   ├── App.css            # Modern 2026-style CSS
│   │   ├── Dashboard.jsx      # Advanced dashboard
│   │   ├── DashboardStats.jsx # Statistics with growth indicators
│   │   ├── DashboardCharts.jsx# Interactive charts
│   │   ├── Analytics.jsx      # Advanced analytics page
│   │   ├── Reports.jsx        # Report generation
│   │   ├── Settings.jsx       # Settings management
│   │   ├── Profile.jsx        # User profile management
│   │   ├── LeadList.jsx       # Lead management
│   │   ├── DealPipeline.jsx   # Deal pipeline
│   │   ├── api.js             # Enhanced API service
│   │   └── main.jsx           # App entry point
│   ├── package.json           # Dependencies
│   └── vite.config.js         # Vite configuration
├── database/                   # Database Scripts
│   ├── schema.sql             # Complete database schema
│   ├── setup_mysql.sql        # Sample data setup
│   ├── seed_data.sql          # Additional sample data
│   └── README_db.md           # Database documentation
├── docker-compose.yml         # Container orchestration
├── run.sh                     # Quick start script
├── MYSQL_SETUP.md            # MySQL setup guide
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher

### Option 1: Automatic Setup (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd sales-lead-management

# Run the setup script
./run.sh
```

### Option 2: Manual Setup

#### 1. Database Setup
```bash
# Start MySQL service
# Create database and tables
mysql -u root -p < database/schema.sql
mysql -u root -p < database/setup_mysql.sql
```

#### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 🌐 Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8081/api
- **Database**: localhost:3306/sales_lead_db

## 📊 Application Features

### Navigation
The application includes 7 main sections:
1. **📊 Dashboard** - Overview with metrics and charts
2. **👥 Leads** - Lead management and tracking
3. **💼 Deals** - Deal pipeline and revenue tracking
4. **📈 Analytics** - Advanced analytics and insights
5. **📄 Reports** - Report generation and export
6. **⚙️ Settings** - Application and user settings
7. **👤 Profile** - User profile and preferences

### Key Capabilities
- ✅ **Real-time Data** - All data persisted in MySQL
- ✅ **Modern UI** - 2026-style design with animations
- ✅ **Responsive** - Works on desktop, tablet, and mobile
- ✅ **User Management** - Complete profile and settings
- ✅ **Analytics** - Advanced reporting and insights
- ✅ **Export** - Multiple export formats
- ✅ **Search & Filter** - Advanced filtering capabilities
- ✅ **Activity Tracking** - Complete audit trail

## 🔧 Configuration

### Database Configuration
Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sales_lead_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sales_lead_db
DB_USER=root
DB_PASSWORD=your_password

# Application
SERVER_PORT=8081
FRONTEND_PORT=5173
```

## 📱 API Endpoints

### Core Entities
- `GET/POST/PUT/DELETE /api/leads` - Lead management
- `GET/POST/PUT/DELETE /api/deals` - Deal management
- `GET/PUT /api/profile` - User profile
- `GET/PUT /api/settings` - User settings

### Analytics & Reporting
- `GET /api/analytics` - Analytics data
- `POST /api/reports` - Generate reports
- `GET /api/activities` - Activity tracking

### Utilities
- `GET /api/health` - Health check
- `GET /api/metrics` - System metrics

## 🎨 UI/UX Features

### Modern Design Elements
- **Glassmorphism Effects** - Translucent cards with blur
- **Animated Gradients** - Dynamic background animations
- **Smooth Transitions** - 60fps animations
- **Modern Typography** - Clean, readable fonts
- **Color Psychology** - Carefully chosen color palette

### Responsive Design
- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Perfect tablet experience
- **Desktop Enhanced** - Full desktop functionality
- **Cross-browser** - Works on all modern browsers

## 🔒 Security Features

- **Input Validation** - Server-side validation
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Proper cross-origin setup
- **Error Handling** - Graceful error management

## 📈 Performance

### Backend Optimizations
- **Connection Pooling** - HikariCP for database connections
- **JPA Optimizations** - Efficient database queries
- **Caching** - Strategic caching implementation
- **Lazy Loading** - Optimized data loading

### Frontend Optimizations
- **Vite Build** - Fast development and production builds
- **Code Splitting** - Optimized bundle sizes
- **Lazy Loading** - Component-level lazy loading
- **Memoization** - React optimization techniques

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Production Build
```bash
# Backend
cd backend
mvn clean package

# Frontend
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues
- **Database Connection**: Check MySQL service and credentials
- **Port Conflicts**: Ensure ports 3306, 8081, 5173 are available
- **Build Errors**: Verify Java 17 and Node.js versions

### Getting Help
- Check the `MYSQL_SETUP.md` for database setup
- Review application logs for error details
- Ensure all prerequisites are installed

## 🎯 Roadmap

### Upcoming Features
- [ ] **Real-time Notifications** - WebSocket integration
- [ ] **Advanced Reporting** - More report types
- [ ] **Email Integration** - Automated email campaigns
- [ ] **Mobile App** - React Native application
- [ ] **AI Insights** - Machine learning predictions
- [ ] **Multi-tenant** - Support for multiple organizations

---

**Built with ❤️ using modern technologies and best practices**
