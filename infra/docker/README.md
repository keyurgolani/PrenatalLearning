# Docker Configuration

This directory contains all Docker-related configuration files for the Prenatal Learning Hub application.

## Structure

```
infra/docker/
├── Dockerfile.web           # Frontend React app (multi-stage build with nginx)
├── Dockerfile.server        # Backend Express API (multi-stage build)
├── docker-compose.yml       # Production compose (uses published images)
├── docker-compose.dev.yml   # Development compose (builds from source)
├── nginx.conf               # Nginx configuration for frontend
├── .env.example             # Environment variables template
└── .env                     # Local environment config (git-ignored)
```

## Quick Start

### Development

```bash
# From project root
pnpm run docker:dev

# Or with detached mode
pnpm run docker:dev:detach
```

### Production

```bash
# From project root
pnpm run docker:prod

# Or with detached mode
pnpm run docker:prod:detach
```

## Building Images Manually

```bash
# Build frontend image
docker build -f infra/docker/Dockerfile.web -t prenatal-learning:latest .

# Build backend image
docker build -f infra/docker/Dockerfile.server -t prenatal-learning-backend:latest ./apps/server
```

## Services

| Service  | Port  | Description                    |
| -------- | ----- | ------------------------------ |
| Frontend | 8080  | React app served via nginx     |
| Backend  | 3001  | Express API server             |
| MongoDB  | 27017 | Database (internal by default) |

## Environment Variables

Copy `.env.example` to `.env` in this directory (`infra/docker/`) and configure:

### Required (change in production!)

| Variable                     | Description                | Default    |
| ---------------------------- | -------------------------- | ---------- |
| `JWT_SECRET`                 | Secret key for JWT signing | -          |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB admin username     | `admin`    |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB admin password     | `password` |

### Optional

| Variable                     | Description                  | Default                 |
| ---------------------------- | ---------------------------- | ----------------------- |
| `FRONTEND_PORT`              | Frontend port                | `8080`                  |
| `BACKEND_PORT`               | Backend API port             | `3001`                  |
| `MONGODB_PORT`               | MongoDB port                 | `27017`                 |
| `JWT_EXPIRES_IN`             | JWT token expiration         | `7d`                    |
| `JWT_REMEMBER_ME_EXPIRES_IN` | Remember me token expiration | `30d`                   |
| `CORS_ORIGIN`                | Allowed CORS origin          | `http://localhost:8080` |

## Multi-Stage Builds

Both Dockerfiles use multi-stage builds for optimization:

### Web (Dockerfile.web)

1. **build**: Installs dependencies and builds the React app with Vite
2. **production**: Serves static files with nginx

### Server (Dockerfile.server)

1. **development**: Full dev environment with hot-reload (tsx watch)
2. **build**: Compiles TypeScript to JavaScript
3. **production**: Minimal runtime with only production dependencies

## Health Checks

Both services include health checks:

- Frontend: `GET /` on port 80
- Backend: `GET /api/health` on port 3001
