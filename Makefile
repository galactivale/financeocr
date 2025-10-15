# VaultCPA Docker Management Makefile

.PHONY: help build up down restart logs clean dev prod status health

# Default target
help: ## Show this help message
	@echo "VaultCPA Docker Management Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
dev: ## Start development environment
	docker-compose up --build

dev-detached: ## Start development environment in background
	docker-compose up -d --build

# Production commands
prod: ## Start production environment
	docker-compose -f docker-compose.prod.yml up -d --build

prod-build: ## Build production images
	docker-compose -f docker-compose.prod.yml build

# VPS commands
vps: ## Start VPS-optimized environment (1GB RAM)
	docker-compose -f docker-compose.vps.yml up -d --build

vps-build: ## Build VPS-optimized images
	docker-compose -f docker-compose.vps.yml build

vps-logs: ## View VPS service logs
	docker-compose -f docker-compose.vps.yml logs -f

vps-status: ## Check VPS service status
	docker-compose -f docker-compose.vps.yml ps

vps-down: ## Stop VPS services
	docker-compose -f docker-compose.vps.yml down

vps-cleanup: ## Clean up VPS resources
	docker-compose -f docker-compose.vps.yml down -v
	docker system prune -f

# Service management
up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

stop: ## Stop all services
	docker-compose stop

# Logs
logs: ## View all logs
	docker-compose logs -f

logs-frontend: ## View frontend logs
	docker-compose logs -f frontend

logs-backend: ## View backend logs
	docker-compose logs -f backend

logs-db: ## View database logs
	docker-compose logs -f postgres

# Status and health
status: ## Show service status
	docker-compose ps

health: ## Check service health
	@echo "Checking service health..."
	@echo "Frontend: $$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api/health || echo 'DOWN')"
	@echo "Backend: $$(curl -s -o /dev/null -w '%{http_code}' http://localhost:5000/health || echo 'DOWN')"
	@echo "Database: $$(docker-compose exec postgres pg_isready -U vaultcpa_user -d vaultcpa > /dev/null 2>&1 && echo 'UP' || echo 'DOWN')"

# Database commands
db-shell: ## Access database shell
	docker-compose exec postgres psql -U vaultcpa_user -d vaultcpa

db-migrate: ## Run database migrations
	docker-compose exec backend npm run migrate

db-seed: ## Seed database with sample data
	docker-compose exec backend npm run seed

db-reset: ## Reset database (⚠️ This will delete all data)
	docker-compose exec backend npm run seed:reset

# Build commands
build: ## Build all images
	docker-compose build

build-frontend: ## Build frontend image
	docker-compose build frontend

build-backend: ## Build backend image
	docker-compose build backend

# Cleanup commands
clean: ## Remove containers and networks
	docker-compose down --remove-orphans

clean-all: ## Remove everything (containers, networks, volumes, images)
	docker-compose down -v --remove-orphans
	docker system prune -f

clean-volumes: ## Remove all volumes (⚠️ This will delete all data)
	docker-compose down -v

# Development utilities
shell-frontend: ## Access frontend container shell
	docker-compose exec frontend sh

shell-backend: ## Access backend container shell
	docker-compose exec backend sh

install-frontend: ## Install frontend dependencies
	docker-compose exec frontend npm install

install-backend: ## Install backend dependencies
	docker-compose exec backend npm install

# Quick setup
setup: ## Initial setup (build and start)
	make build
	make up
	make db-seed
	@echo "Setup complete! Visit http://localhost:3000"

# Monitoring
monitor: ## Monitor resource usage
	docker stats vaultcpa-frontend vaultcpa-backend vaultcpa-postgres

# Backup and restore
backup-db: ## Backup database
	docker-compose exec postgres pg_dump -U vaultcpa_user vaultcpa > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db: ## Restore database from backup (usage: make restore-db BACKUP_FILE=backup.sql)
	docker-compose exec -T postgres psql -U vaultcpa_user -d vaultcpa < $(BACKUP_FILE)
