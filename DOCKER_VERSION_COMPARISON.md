# Docker Version Comparison Guide

## Local Machine (Windows/WSL2)
- **Docker Version**: 28.4.0
- **Docker Compose**: v2.39.2-desktop.1
- **OS**: Docker Desktop on WSL2
- **Architecture**: x86_64
- **Kernel**: 5.15.167.4-microsoft-standard-WSL2

## Server Check Commands

Run these on your VPS to compare:

```bash
# Check Docker version
docker --version
docker version

# Check Docker Compose version
docker compose version
# OR if using older version:
docker-compose --version

# Check Docker info
docker info | grep -E "Operating System|Architecture|Kernel|OSType"

# Check if BuildKit is enabled
echo "DOCKER_BUILDKIT: ${DOCKER_BUILDKIT:-not set}"
echo "COMPOSE_DOCKER_CLI_BUILD: ${COMPOSE_DOCKER_CLI_BUILD:-not set}"

# Check BuildKit support
docker buildx version
```

## Common Issues

### 1. BuildKit Not Enabled
The Dockerfile uses `# syntax=docker/dockerfile:1.4` and `--mount=type=cache` which require BuildKit.

**Fix on server:**
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
# Or add to ~/.bashrc:
echo 'export DOCKER_BUILDKIT=1' >> ~/.bashrc
echo 'export COMPOSE_DOCKER_CLI_BUILD=1' >> ~/.bashrc
```

### 2. Older Docker Version
If server has Docker < 20.10, BuildKit features won't work.

**Check version:**
```bash
docker --version
```

**Minimum required**: Docker 20.10+ for BuildKit support

### 3. Architecture Differences
If server is ARM (like AWS Graviton), you might need different base images.

**Check architecture:**
```bash
docker info | grep Architecture
uname -m
```

### 4. Docker Compose Version
Older `docker-compose` (v1) doesn't support BuildKit the same way.

**Use Docker Compose v2:**
```bash
# Use 'docker compose' (v2) instead of 'docker-compose' (v1)
docker compose build
```

## Quick Server Check Script

Run `check-docker-version.sh` on the server:
```bash
chmod +x check-docker-version.sh
./check-docker-version.sh
```

