# VaultCPA - Tax & Accounting Platform

A comprehensive tax and accounting platform built with Next.js, featuring a multi-role dashboard system and a robust MVC backend server.

## 🚀 Features

### Frontend (NextUI Dashboard)
- **Multi-Role Dashboard**: Managing Partner, Tax Manager, Staff Accountant, System Admin
- **Modern UI**: Built with NextUI components and Tailwind CSS
- **Interactive Maps**: US state nexus tracking with @mirawision/usa-map-react
- **Data Visualization**: Custom charts for analytics and reporting
- **Responsive Design**: Mobile-first approach with modern UX

### Backend (MVC Server)
- **MVC Architecture**: Clean separation with Express.js, Prisma ORM
- **Authentication**: JWT-based auth with role-based access control
- **Database**: PostgreSQL with comprehensive schema (40+ tables)
- **Security**: Rate limiting, CORS, input validation, password hashing
- **API**: RESTful endpoints with comprehensive error handling

### Database
- **PostgreSQL**: Multi-tenant architecture with organization isolation
- **Docker Setup**: Easy deployment with Docker Compose
- **PgAdmin**: Web-based database management interface
- **Comprehensive Schema**: Tax compliance, client management, audit trails

## 🏗️ Project Structure

```
nextui-dashboard/
├── app/                          # Next.js App Router
│   ├── (app)/                   # Main application routes
│   ├── dashboard/               # Role-based dashboards
│   │   ├── managing-partner/    # Executive dashboard
│   │   ├── tax-manager/         # Tax management dashboard
│   │   ├── staff-accountant/    # Staff work dashboard
│   │   └── system-admin/        # System administration
│   └── shared/                  # Shared components
├── components/                   # Reusable UI components
│   ├── auth/                    # Authentication components
│   ├── charts/                  # Data visualization
│   ├── home/                    # Dashboard cards
│   ├── layout/                  # Layout components
│   ├── navbar/                  # Navigation
│   └── sidebar/                 # Sidebar navigation
├── server/                      # MVC Backend Server
│   ├── src/
│   │   ├── app.js              # Main server entry point
│   │   ├── config/             # Database configuration
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Custom middleware
│   │   ├── routes/             # API endpoints
│   │   └── utils/              # Utility functions
│   ├── prisma/                 # Database schema
│   └── package.json            # Server dependencies
├── docker-compose.yml          # Database setup
├── vaultcpa_schema.sql         # Database schema
└── README.md                   # This file
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **UI Library**: NextUI (@nextui-org/react)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Maps**: @mirawision/usa-map-react
- **Language**: TypeScript

### Backend
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: express-validator
- **Logging**: Winston
- **Language**: JavaScript

### Database
- **Database**: PostgreSQL 15+
- **Management**: PgAdmin
- **Containerization**: Docker
- **Extensions**: uuid-ossp, pgcrypto

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/galactivale/financeocr.git
cd nextui-dashboard
```

### 2. Set Up Database
```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Or use the setup script
./setup-database.sh  # Linux/Mac
setup-database.bat   # Windows
```

### 3. Set Up Backend Server
```bash
cd server
npm install
cp env.example .env
# Edit .env with your configuration
npx prisma generate
npm run dev
```

### 4. Set Up Frontend
```bash
# From project root
npm install
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3080
- **Database Admin**: http://localhost:8080 (admin@vaultcpa.com / admin123)

## 📊 Database Setup

The application includes a comprehensive PostgreSQL database with:

### Core Tables
- **Organizations**: Multi-tenant management
- **Users**: Role-based access control
- **Clients**: Client information and risk assessment
- **Alerts**: System and compliance alerts
- **Tasks**: Workflow management
- **Documents**: Document management
- **Professional Decisions**: Audit trail

### Key Features
- **Multi-tenant Architecture**: Organization isolation
- **Role-based Access**: Managing Partner, Tax Manager, Staff Accountant, System Admin
- **Audit Trail**: Complete professional liability tracking
- **State Nexus Tracking**: Tax compliance monitoring
- **Integration Support**: Third-party service connections

## 🔐 Authentication

The platform supports role-based authentication:

### User Roles
- **Managing Partner**: Full access to all features
- **Tax Manager**: Tax management and compliance
- **Staff Accountant**: Client work and task management
- **System Admin**: System administration

### Authentication Flow
1. **Login** with organization slug, email, and password
2. **Receive** JWT access and refresh tokens
3. **Access** role-specific dashboard features
4. **Refresh** tokens automatically when needed

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile

### Core Resources
- `GET /api/organizations` - List organizations
- `GET /api/users` - List users
- `GET /api/clients` - List clients
- `GET /api/alerts` - List alerts
- `GET /api/tasks` - List tasks
- `GET /api/documents` - List documents

### System
- `GET /health` - Health check
- `GET /api` - API information

## 🐳 Docker Setup

### Database Only
```bash
docker-compose up -d postgres
```

### Full Stack (Coming Soon)
```bash
docker-compose up -d
```

## 🔧 Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd server
npm run dev          # Start with nodemon
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
```

### Database Development
```bash
cd server
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev # Create migration
npx prisma generate  # Generate Prisma client
```

## 📝 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3080
NEXT_PUBLIC_APP_NAME=VaultCPA
```

### Backend (server/.env)
```bash
NODE_ENV=development
PORT=3080
DATABASE_URL=postgresql://vaultcpa_user:password@localhost:5432/vaultcpa
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

### Production Checklist
1. **Environment Variables**: Set production values
2. **Database**: Use production PostgreSQL instance
3. **Security**: Use strong JWT secrets and HTTPS
4. **Monitoring**: Set up error tracking and logging
5. **Backup**: Configure database backups
6. **SSL**: Use HTTPS in production

### Docker Deployment
```bash
# Build and deploy with Docker
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring & Logging

### Health Checks
- **Frontend**: Built-in Next.js health monitoring
- **Backend**: `/health` endpoint with database status
- **Database**: Connection monitoring and query logging

### Logging
- **Frontend**: Browser console and error tracking
- **Backend**: Winston logging with file rotation
- **Database**: Query logging in development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the documentation in each component directory
2. Review the API documentation at `/api`
3. Check the database documentation in `README-Database.md`
4. Open an issue on GitHub

## 🔗 Links

- **Repository**: https://github.com/galactivale/financeocr
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database Admin**: http://localhost:8080

---

**VaultCPA** - Professional tax and accounting platform for the modern era. 🚀