# VaultCPA Server

A comprehensive MVC backend server for the VaultCPA tax and accounting platform, built with Node.js, Express.js, and PostgreSQL.

## 🚀 Features

- **MVC Architecture**: Clean separation of concerns with Models, Views (API responses), and Controllers
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Database Integration**: PostgreSQL with Prisma ORM for type-safe database operations
- **Security**: Helmet, CORS, rate limiting, input validation, and password hashing
- **Logging**: Comprehensive logging with Winston
- **Error Handling**: Centralized error handling with detailed error responses
- **API Documentation**: RESTful API with clear endpoint structure

## 📁 Project Structure

```
server/
├── src/
│   ├── app.js                 # Main application entry point
│   ├── config/
│   │   └── database.js        # Database configuration and helpers
│   ├── controllers/           # Business logic controllers
│   │   └── authController.js  # Authentication controller
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # Authentication middleware
│   │   ├── errorHandler.js   # Error handling middleware
│   │   ├── notFound.js       # 404 handler
│   │   └── validation.js     # Request validation middleware
│   ├── routes/               # API route definitions
│   │   ├── auth.js          # Authentication routes
│   │   ├── organizations.js # Organization routes
│   │   ├── users.js         # User routes
│   │   ├── clients.js       # Client routes
│   │   ├── alerts.js        # Alert routes
│   │   ├── tasks.js         # Task routes
│   │   ├── documents.js     # Document routes
│   │   ├── decisions.js     # Decision routes
│   │   ├── compliance.js    # Compliance routes
│   │   ├── integrations.js  # Integration routes
│   │   └── analytics.js     # Analytics routes
│   └── utils/
│       └── logger.js         # Logging utility
├── prisma/
│   └── schema.prisma         # Database schema definition
├── logs/                     # Log files (created automatically)
├── package.json              # Dependencies and scripts
├── env.example              # Environment variables template
└── README.md                # This file
```

## 🛠️ Installation

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Server Configuration
NODE_ENV=development
PORT=3080
HOST=localhost

# Database
DATABASE_URL=postgresql://vaultcpa_user:vaultcpa_secure_password_2024@localhost:5432/vaultcpa

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Database Setup

The server connects to the PostgreSQL database set up in the main project. Ensure the database is running:

```bash
# From the main project directory
docker-compose up -d postgres
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Core Resources
- `GET /api/organizations` - List organizations
- `GET /api/users` - List users
- `GET /api/clients` - List clients
- `GET /api/alerts` - List alerts
- `GET /api/tasks` - List tasks
- `GET /api/documents` - List documents
- `GET /api/decisions` - List decisions
- `GET /api/compliance` - List compliance items
- `GET /api/integrations` - List integrations
- `GET /api/analytics` - Get analytics data

### System
- `GET /health` - Health check
- `GET /api` - API information

## 🔐 Authentication

The API uses JWT-based authentication:

1. **Login** to get access and refresh tokens
2. **Include** the access token in the `Authorization` header:
   ```
   Authorization: Bearer <access_token>
   ```
3. **Refresh** tokens when they expire

### User Roles

- `managing-partner` - Full access to all features
- `tax-manager` - Tax management and compliance features
- `staff-accountant` - Client work and task management
- `system-admin` - System administration and configuration

## 🗄️ Database

The server uses Prisma ORM with PostgreSQL. Key features:

- **Type-safe** database operations
- **Automatic** migrations
- **Connection** pooling
- **Transaction** support
- **Query** optimization

### Database Operations

```javascript
// Example: Get user with organization
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    organization: true,
    userPermissions: true,
  },
});
```

## 📝 Logging

Comprehensive logging with Winston:

- **Console** output for development
- **File** logging for production
- **Request** logging with timing
- **Error** tracking and stack traces
- **Structured** JSON logs

Log files are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## 🚨 Error Handling

Centralized error handling with:

- **Validation** errors with field details
- **Database** errors with proper HTTP status codes
- **Authentication** errors with clear messages
- **Rate limiting** with appropriate responses
- **Development** vs **production** error details

## 🔒 Security Features

- **Helmet** for security headers
- **CORS** configuration
- **Rate limiting** to prevent abuse
- **Input validation** with express-validator
- **Password hashing** with bcrypt
- **JWT** token authentication
- **SQL injection** protection via Prisma
- **XSS** protection

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3080/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0"
}
```

### Database Health

The server automatically checks database connectivity and logs connection status.

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**: Set production values
2. **Database**: Use production PostgreSQL instance
3. **Security**: Use strong JWT secrets
4. **Logging**: Configure log rotation
5. **Monitoring**: Set up error tracking
6. **SSL**: Use HTTPS in production
7. **Rate Limiting**: Adjust limits for production load

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3080
CMD ["npm", "start"]
```

## 🤝 Development

### Adding New Routes

1. **Create controller** in `src/controllers/`
2. **Create routes** in `src/routes/`
3. **Add middleware** for authentication/validation
4. **Update app.js** to include new routes
5. **Add tests** for new functionality

### Database Changes

1. **Update schema** in `prisma/schema.prisma`
2. **Create migration**: `npx prisma migrate dev`
3. **Update Prisma client**: `npx prisma generate`
4. **Test changes** thoroughly

## 📞 Support

For issues and questions:

1. Check the logs in `logs/` directory
2. Verify database connection
3. Check environment variables
4. Review API documentation
5. Test with health check endpoint

## 📄 License

MIT License - see LICENSE file for details.
