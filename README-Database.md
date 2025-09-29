# VaultCPA Database Setup

This guide will help you set up the VaultCPA PostgreSQL database using Docker.

## Prerequisites

- Docker and Docker Compose installed
- At least 2GB of available RAM
- Ports 5432 and 8080 available on your system

## Quick Start

1. **Run the setup script:**
   ```bash
   chmod +x setup-database.sh
   ./setup-database.sh
   ```

2. **Access the database:**
   - **Direct connection:** `postgresql://vaultcpa_user:vaultcpa_secure_password_2024@localhost:5432/vaultcpa`
   - **PgAdmin:** http://localhost:8080 (admin@vaultcpa.com / admin123)

## Manual Setup

If you prefer to set up manually:

1. **Start the database:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Start PgAdmin (optional):**
   ```bash
   docker-compose up -d pgadmin
   ```

3. **Check status:**
   ```bash
   docker-compose ps
   ```

## Database Information

### Connection Details
- **Host:** localhost
- **Port:** 5432
- **Database:** vaultcpa
- **Username:** vaultcpa_user
- **Password:** vaultcpa_secure_password_2024

### Additional Users
- **Read-only user:** vaultcpa_readonly / readonly_password_2024
- **Test database:** vaultcpa_test

### PgAdmin Access
- **URL:** http://localhost:8080
- **Email:** admin@vaultcpa.com
- **Password:** admin123

## Database Schema

The database includes the following main entities:

### Core Tables
- `organizations` - Multi-tenant organization management
- `users` - User accounts with role-based access
- `clients` - Client information and risk assessment
- `client_states` - State-specific nexus tracking
- `alerts` - System and compliance alerts
- `tasks` - Workflow and task management
- `documents` - Document management
- `professional_decisions` - Audit trail for professional decisions

### Supporting Tables
- `client_communications` - Communication history
- `compliance_standards` - Regulatory compliance tracking
- `integrations` - Third-party service integrations
- `performance_metrics` - Analytics and reporting
- `audit_log` - System-wide audit trail

## Useful Commands

### Docker Commands
```bash
# View logs
docker-compose logs -f postgres

# Stop all services
docker-compose down

# Restart database
docker-compose restart postgres

# Access database shell
docker-compose exec postgres psql -U vaultcpa_user -d vaultcpa

# Backup database
docker-compose exec postgres pg_dump -U vaultcpa_user vaultcpa > backup.sql

# Restore database
docker-compose exec -T postgres psql -U vaultcpa_user -d vaultcpa < backup.sql
```

### Database Queries
```sql
-- Check database health
SELECT * FROM health_check();

-- View all organizations
SELECT * FROM organizations;

-- View active clients
SELECT * FROM v_active_clients_summary;

-- View user workload
SELECT * FROM v_user_workload;

-- Check recent activity
SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 10;
```

## Environment Variables

Copy `env.example` to `.env` and update the values:

```bash
cp env.example .env
```

Key variables:
- `DATABASE_URL` - Main database connection string
- `TEST_DATABASE_URL` - Test database connection
- `READONLY_DATABASE_URL` - Read-only user connection

## Security Notes

- Change default passwords in production
- Use environment variables for sensitive data
- Enable SSL/TLS for production connections
- Regularly backup your database
- Monitor database logs for security events

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using port 5432
   lsof -i :5432
   # Stop the conflicting service or change the port in docker-compose.yml
   ```

2. **Permission denied:**
   ```bash
   # Make scripts executable
   chmod +x setup-database.sh
   chmod +x init-db.sh
   ```

3. **Database connection failed:**
   ```bash
   # Check if container is running
   docker-compose ps
   # Check logs
   docker-compose logs postgres
   ```

4. **Schema not loaded:**
   ```bash
   # Check if schema file exists
   ls -la vaultcpa_schema.sql
   # Restart with fresh data
   docker-compose down -v
   docker-compose up -d
   ```

### Reset Database

To completely reset the database:

```bash
# Stop and remove all data
docker-compose down -v

# Remove any existing volumes
docker volume rm nextui-dashboard_postgres_data nextui-dashboard_pgadmin_data

# Start fresh
./setup-database.sh
```

## Production Considerations

For production deployment:

1. **Use strong passwords**
2. **Enable SSL/TLS**
3. **Set up regular backups**
4. **Configure monitoring**
5. **Use environment-specific configurations**
6. **Implement connection pooling**
7. **Set up database replication for high availability**

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs postgres`
2. Verify Docker is running: `docker --version`
3. Check port availability: `netstat -tulpn | grep :5432`
4. Review the schema file: `vaultcpa_schema.sql`

## Schema Documentation

The complete database schema is documented in `vaultcpa_schema.sql`. Key features:

- **Multi-tenant architecture** with organization isolation
- **Role-based access control** with fine-grained permissions
- **Comprehensive audit trail** for professional liability
- **State-specific nexus tracking** for tax compliance
- **Integration support** for third-party services
- **Performance optimization** with proper indexing
- **Data integrity** with constraints and triggers

