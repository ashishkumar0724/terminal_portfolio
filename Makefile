# ============================================
# Makefile for Terminal Portfolio Docker Commands
# ============================================
#
# Usage:
#   make build        - Build production image
#   make build-dev    - Build development image
#   make up           - Start production container
#   make up-dev       - Start development container with hot-reload
#   make down         - Stop all containers
#   make logs         - View container logs
#   make shell        - Open shell in production container
#   make shell-dev    - Open shell in development container
#   make clean        - Remove containers, images, and volumes
#   make rebuild      - Rebuild and restart production
#   make rebuild-dev  - Rebuild and restart development
#   make help         - Show this help message
#
# ============================================

.PHONY: build build-dev up up-dev down logs shell shell-dev clean rebuild rebuild-dev help

# Default target
.DEFAULT_GOAL := help

# ==========================================
# BUILD COMMANDS
# ==========================================

build:
	@echo "🏗️  Building production image..."
	docker compose build terminal-portfolio

build-dev:
	@echo "🏗️  Building development image..."
	docker compose build terminal-portfolio-dev

build-all: build build-dev
	@echo "✅ All images built successfully!"

# ==========================================
# RUN COMMANDS
# ==========================================

up:
	@echo "🚀 Starting production container..."
	docker compose up -d terminal-portfolio
	@echo "✅ Terminal Portfolio running at http://localhost:3000"

up-dev:
	@echo "🚀 Starting development container with hot-reload..."
	docker compose --profile dev up -d terminal-portfolio-dev
	@echo "✅ Terminal Portfolio (dev) running at http://localhost:3000"
	@echo "📝 Watching for file changes..."

# ==========================================
# STOP COMMANDS
# ==========================================

down:
	@echo "🛑 Stopping all containers..."
	docker compose down
	@echo "✅ All containers stopped"

down-dev:
	@echo "🛑 Stopping development containers..."
	docker compose --profile dev down
	@echo "✅ Development containers stopped"

# ==========================================
# LOGS & DEBUGGING
# ==========================================

logs:
	@echo "📜 Showing logs (Ctrl+C to exit)..."
	docker compose logs -f

logs-dev:
	@echo "📜 Showing development logs (Ctrl+C to exit)..."
	docker compose --profile dev logs -f terminal-portfolio-dev

# ==========================================
# SHELL ACCESS
# ==========================================

shell:
	@echo "🐚 Opening shell in production container..."
	docker compose exec terminal-portfolio sh

shell-dev:
	@echo "🐚 Opening shell in development container..."
	docker compose exec terminal-portfolio-dev sh

# ==========================================
# CLEANUP
# ==========================================

clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker compose down -v --rmi local
	@echo "✅ Cleanup complete"

deep-clean:
	@echo "🧹 Deep cleaning all Docker resources..."
	docker compose down -v --rmi all
	docker system prune -f
	@echo "✅ Deep cleanup complete"

# ==========================================
# REBUILD COMMANDS
# ==========================================

rebuild: down build up
	@echo "✅ Production container rebuilt and restarted"

rebuild-dev: down build-dev up-dev
	@echo "✅ Development container rebuilt and restarted"

# ==========================================
# UTILITY COMMANDS
# ==========================================

ps:
	@echo "📋 Running containers:"
	docker compose ps

status: ps

# ==========================================
# HELP
# ==========================================

help:
	@echo ""
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║          Terminal Portfolio - Docker Commands              ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "BUILD COMMANDS:"
	@echo "  make build        Build production Docker image"
	@echo "  make build-dev    Build development Docker image"
	@echo "  make build-all    Build all images"
	@echo ""
	@echo "RUN COMMANDS:"
	@echo "  make up           Start production container"
	@echo "  make up-dev       Start development container (hot-reload)"
	@echo ""
	@echo "STOP COMMANDS:"
	@echo "  make down         Stop all containers"
	@echo "  make down-dev     Stop development containers"
	@echo ""
	@echo "DEBUGGING:"
	@echo "  make logs         View production logs"
	@echo "  make logs-dev     View development logs"
	@echo "  make shell        Open shell in production container"
	@echo "  make shell-dev    Open shell in development container"
	@echo "  make ps           Show running containers"
	@echo ""
	@echo "CLEANUP:"
	@echo "  make clean        Remove containers and images"
	@echo "  make deep-clean   Remove all Docker resources"
	@echo ""
	@echo "REBUILD:"
	@echo "  make rebuild      Rebuild and restart production"
	@echo "  make rebuild-dev  Rebuild and restart development"
	@echo ""
