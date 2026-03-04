# 🐳 Docker Development Environment - Terminal Portfolio

This guide explains how to set up and run the Interactive Terminal Portfolio using Docker with Docker Compose for local development.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:

| Tool | Version | Download | Verification Command |
|------|---------|----------|---------------------|
| **Docker** | 24.0+ | [docker.com](https://www.docker.com/products/docker-desktop/) | `docker --version` |
| **Docker Compose** | 2.20+ | Included with Docker Desktop | `docker compose version` |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | `git --version` |

### System Requirements
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 5GB minimum
- **OS**: macOS, Linux, or Windows 10/11 with WSL2

---

## 🚀 Quick Start (2 Commands)

```bash
# 1. Build and start development container with hot-reload
docker compose --profile dev up -d

# 2. Open in browser
# Visit http://localhost:3000
```

---

## 📁 Project Structure for Docker

```
terminal-portfolio/
├── 📄 Dockerfile              # Production build (multi-stage)
├── 📄 Dockerfile.dev          # Development image with hot-reload
├── 📄 docker-compose.yml      # Production compose config
├── 📄 docker-compose.dev.yml  # Development override config
├── 📄 docker-compose.full.yml # Unified config with profiles
├── 📄 .dockerignore           # Files excluded from Docker build
├── 📄 Makefile                # Simplified Docker commands
├── 📄 .env.example            # Environment variables template
└── 📁 src/                    # Source code (mounted for dev)
```

---

## 🔧 Detailed Setup Instructions

### Step 1: Clone/Copy the Project

```bash
# If cloning from a repository
git clone <repository-url> terminal-portfolio
cd terminal-portfolio

# Or if copying files, ensure all files are in the directory
```

### Step 2: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit if needed (optional - defaults work for local development)
nano .env
```

### Step 3: Build Docker Images

```bash
# Option A: Build for development
docker compose -f docker-compose.yml -f docker-compose.dev.yml build

# Option B: Using the Makefile (simpler)
make build-dev

# Option C: Using the unified compose file
docker compose -f docker-compose.full.yml build terminal-portfolio-dev
```

### Step 4: Run the Container

```bash
# Development mode (with hot-reload)
docker compose --profile dev up -d

# Or using Makefile
make up-dev
```

### Step 5: Access the Application

Open your browser and visit:
- **Local**: http://localhost:3000
- **Terminal Output**: `docker compose logs -f`

---

## 🎛️ Docker Commands Reference

### Using Makefile (Recommended)

| Command | Description |
|---------|-------------|
| `make build` | Build production image |
| `make build-dev` | Build development image |
| `make up` | Start production container |
| `make up-dev` | Start development container (hot-reload) |
| `make down` | Stop all containers |
| `make logs` | View container logs |
| `make logs-dev` | View development logs |
| `make shell` | Open shell in production container |
| `make shell-dev` | Open shell in development container |
| `make clean` | Remove containers and images |
| `make rebuild` | Rebuild and restart production |
| `make rebuild-dev` | Rebuild and restart development |
| `make help` | Show all available commands |

### Using Docker Compose Directly

```bash
# ==========================================
# DEVELOPMENT MODE (with hot-reload)
# ==========================================

# Start development container
docker compose --profile dev up -d

# View development logs
docker compose --profile dev logs -f terminal-portfolio-dev

# Stop development container
docker compose --profile dev down

# ==========================================
# PRODUCTION MODE
# ==========================================

# Start production container
docker compose up -d

# View production logs
docker compose logs -f

# Stop production container
docker compose down

# ==========================================
# UTILITY COMMANDS
# ==========================================

# List running containers
docker compose ps

# Open shell in container
docker compose exec terminal-portfolio-dev sh

# Rebuild without cache
docker compose build --no-cache

# Remove all related resources
docker compose down -v --rmi local
```

---

## 🔥 Hot-Reload in Docker

The development setup supports hot-reload for code changes:

### How It Works
1. Source files (`./src`, `./public`) are mounted as volumes
2. Next.js development server watches for file changes
3. Changes automatically reload in the browser

### Files That Trigger Hot-Reload
```
✅ src/**/*.tsx
✅ src/**/*.ts
✅ src/**/*.css
✅ public/**
❌ package.json (requires rebuild)
❌ node_modules (excluded from mount)
```

### If Hot-Reload Doesn't Work
```bash
# 1. Ensure polling is enabled (check .env)
WATCHPACK_POLLING=true
CHOKIDAR_USEPOLLING=true

# 2. Restart container
docker compose --profile dev restart

# 3. Check container logs
docker compose --profile dev logs terminal-portfolio-dev
```

---

## 🛠️ Development Workflow

### Typical Development Session

```bash
# 1. Start development container
make up-dev

# 2. View logs (optional)
make logs-dev

# 3. Make code changes in src/
# Changes auto-reload in browser

# 4. Open shell if needed
make shell-dev

# 5. Run lint or other commands inside container
bun run lint

# 6. Stop when done
make down
```

### Adding New Dependencies

```bash
# Option A: Rebuild container
make rebuild-dev

# Option B: Install inside container
docker compose exec terminal-portfolio-dev bun add <package>
```

---

## 🏗️ Production Deployment

### Build Production Image

```bash
# Build optimized production image
docker compose build terminal-portfolio

# Or using Makefile
make build
```

### Run Production Container

```bash
# Start production container
docker compose up -d terminal-portfolio

# Or using Makefile
make up
```

### Production Image Details
- **Base**: `oven/bun:1.3.4-alpine`
- **Size**: ~150MB (optimized)
- **Multi-stage build**: Yes
- **Non-root user**: Yes (security)
- **Health check**: Enabled

---

## 📊 Docker Compose Profiles

The project uses Docker Compose profiles for different environments:

| Profile | Service | Use Case |
|---------|---------|----------|
| (default) | `terminal-portfolio` | Production |
| `dev` | `terminal-portfolio-dev` | Development |

### Running Specific Profiles

```bash
# Production only
docker compose up -d

# Development only
docker compose --profile dev up -d

# Both (not recommended)
docker compose --profile dev up -d terminal-portfolio terminal-portfolio-dev
```

---

## 🔍 Debugging & Troubleshooting

### Check Container Status

```bash
# List all containers
docker compose ps

# Check container health
docker inspect terminal-portfolio-dev --format='{{.State.Health.Status}}'
```

### View Container Logs

```bash
# Follow logs
docker compose logs -f terminal-portfolio-dev

# Last 100 lines
docker compose logs --tail=100 terminal-portfolio-dev

# With timestamps
docker compose logs -f --timestamps terminal-portfolio-dev
```

### Access Container Shell

```bash
# Open shell
docker compose exec terminal-portfolio-dev sh

# Run single command
docker compose exec terminal-portfolio-dev bun run lint
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Port 3000 in use** | `lsof -i :3000` then `kill -9 <PID>` |
| **Container won't start** | `docker compose logs terminal-portfolio-dev` |
| **Hot-reload not working** | Check `WATCHPACK_POLLING=true` in .env |
| **Out of disk space** | `docker system prune -a` |
| **Build fails** | `docker compose build --no-cache` |
| **Permission denied** | Add user to docker group: `sudo usermod -aG docker $USER` |

### Reset Everything

```bash
# Stop and remove all containers, networks, volumes
docker compose down -v --rmi all

# Clean Docker system (use with caution)
docker system prune -a --volumes

# Rebuild from scratch
make build-dev && make up-dev
```

---

## 🌐 Environment Variables

### Required for Docker
```env
# Must be set for Docker networking
HOSTNAME="0.0.0.0"

# Required for hot-reload in containers
WATCHPACK_POLLING=true
CHOKIDAR_USEPOLLING=true
```

### Optional Configuration
```env
# Disable Next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# Custom port (default: 3000)
PORT=3000
```

---

## 📦 Image Details

### Production Image Layers

```
oven/bun:1.3.4-alpine (base)          ~50MB
├── Dependencies (node_modules)        ~100MB
├── Application code                   ~5MB
└── Standalone Next.js build          ~30MB
───────────────────────────────────────────
Total                                  ~185MB
```

### Development Image Layers

```
oven/bun:1.3.4-alpine (base)          ~50MB
├── Dependencies (with devDeps)        ~200MB
└── Application code (mounted)         external
───────────────────────────────────────────
Total                                  ~250MB
```

---

## 🚀 Advanced Configuration

### Custom Docker Network

```yaml
# In docker-compose.yml
networks:
  portfolio-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

### Resource Limits

```yaml
# Add to service in docker-compose.yml
services:
  terminal-portfolio-dev:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 512M
```

### Multiple Environments

```bash
# Development
docker compose --profile dev up -d

# Staging (with different compose file)
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d

# Production
docker compose up -d
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Deployment](https://nextjs.org/docs/app/building-your-application/deploying#docker-image)
- [Bun Docker Images](https://hub.docker.com/r/oven/bun)

---

## ✅ Quick Reference Card

```bash
# Start development
make up-dev

# View logs
make logs-dev

# Open shell
make shell-dev

# Stop all
make down

# Rebuild
make rebuild-dev

# Clean everything
make clean
```

---

**Happy Dockerizing! 🐳**
