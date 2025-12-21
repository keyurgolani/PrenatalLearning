# Prenatal Learning Hub

A beautiful, interactive web application designed to help expectant parents bond with their baby through educational stories, activities, and exercises during pregnancy.

**🌐 Live Demo: [prenatal.keyurgolani.photography](https://prenatal.keyurgolani.photography)**

## Features

### Learning & Content

- **Educational Stories**: Curated collection of stories across multiple categories including alphabet, numbers, colors, shapes, animals, and more
- **Interactive Exercises**: Engaging activities to stimulate prenatal learning and bonding
- **Learning Paths**: Structured journeys organized by trimester with personalized recommendations
- **Progress Tracking**: Track completed stories with cloud sync for logged-in users

### User Experience

- **Two-Row Header**: Primary header with navigation, secondary header with due date, stats, and controls
- **Reading Mode**: Distraction-free reading with floating control bar (theme, font size, kick logging)
- **Responsive Design**: Beautiful gradient UI that works on all devices
- **Theme Support**: Multiple themes with light/dark mode options

### Journaling & Tracking

- **Journal**: Calendar-based journal with mood tracking, text entries, and voice notes
- **Kick Counter**: Track baby movements with daily statistics and time-of-day patterns
- **Streak Tracking**: Maintain learning streaks with visual indicators

### Account Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Cloud Sync**: All data synced across devices for logged-in users
- **Guest Mode**: Full functionality without account (data stored locally)
- **Data Migration**: Guest data automatically migrates when you create an account

## Tech Stack

### Frontend

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Vitest** - Unit testing framework

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Document database
- **JWT** - Authentication

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+ (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/keyurgolani/PrenatalLearning.git
   cd PrenatalLearning
   ```

2. Install pnpm (if not already installed):

   ```bash
   corepack enable
   corepack prepare pnpm@9.15.0 --activate
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

#### Frontend Development

| Command                  | Description                       |
| ------------------------ | --------------------------------- |
| `pnpm run dev`           | Start frontend development server |
| `pnpm run build`         | Build frontend for production     |
| `pnpm run preview`       | Preview production build          |
| `pnpm run lint`          | Run ESLint                        |
| `pnpm run lint:fix`      | Run ESLint with auto-fix          |
| `pnpm run typecheck`     | Run TypeScript type checking      |
| `pnpm run test`          | Run tests once                    |
| `pnpm run test:watch`    | Run tests in watch mode           |
| `pnpm run test:coverage` | Run tests with coverage report    |

#### Backend Development

| Command                      | Description                      |
| ---------------------------- | -------------------------------- |
| `pnpm run dev:server`        | Start backend development server |
| `pnpm run build:server`      | Build backend for production     |
| `pnpm run start:server`      | Start production backend         |
| `pnpm run test:server`       | Run backend tests                |
| `pnpm run test:watch:server` | Run backend tests in watch mode  |
| `pnpm run lint:server`       | Run backend ESLint               |
| `pnpm run typecheck:server`  | Run backend TypeScript checking  |

#### Workspace Commands

| Command                       | Description                       |
| ----------------------------- | --------------------------------- |
| `pnpm run dev:all`            | Start all dev servers in parallel |
| `pnpm run build:all`          | Build all packages in workspace   |
| `pnpm run lint:all`           | Lint all packages in workspace    |
| `pnpm run lint:fix`           | Fix lint issues in all packages   |
| `pnpm run test:all`           | Run tests in all packages         |
| `pnpm run typecheck:all`      | Type check all packages           |
| `pnpm run clean`              | Clean all node_modules and dist   |
| `pnpm run generate:manifests` | Generate audio/image manifests    |

#### Docker - Stack Management

| Command                                | Description                          |
| -------------------------------------- | ------------------------------------ |
| `pnpm run docker:dev`                  | Start full stack (dev build)         |
| `pnpm run docker:dev:detach`           | Start full stack in background       |
| `pnpm run docker:dev:down`             | Stop dev environment                 |
| `pnpm run docker:dev:rebuild`          | Rebuild and restart frontend+backend |
| `pnpm run docker:dev:rebuild:frontend` | Rebuild frontend only                |
| `pnpm run docker:dev:rebuild:backend`  | Rebuild backend only                 |
| `pnpm run docker:prod`                 | Start production environment         |
| `pnpm run docker:prod:detach`          | Start production in background       |
| `pnpm run docker:prod:down`            | Stop production environment          |
| `pnpm run docker:status`               | Show container status                |

#### Docker - Logs & Debugging

| Command                         | Description               |
| ------------------------------- | ------------------------- |
| `pnpm run docker:logs`          | Follow all container logs |
| `pnpm run docker:logs:frontend` | Follow frontend logs      |
| `pnpm run docker:logs:backend`  | Follow backend logs       |
| `pnpm run docker:logs:db`       | Follow MongoDB logs       |

#### Docker - Service Management

| Command                            | Description                     |
| ---------------------------------- | ------------------------------- |
| `pnpm run docker:restart`          | Restart all containers          |
| `pnpm run docker:restart:frontend` | Restart frontend container      |
| `pnpm run docker:restart:backend`  | Restart backend container       |
| `pnpm run docker:restart:db`       | Restart MongoDB container       |
| `pnpm run docker:shell:backend`    | Open shell in backend container |
| `pnpm run docker:shell:db`         | Open MongoDB shell              |
| `pnpm run docker:db:status`        | Check MongoDB connection status |

#### Docker - Cleanup

| Command                         | Description                              |
| ------------------------------- | ---------------------------------------- |
| `pnpm run docker:clean`         | Remove containers, volumes, local images |
| `pnpm run docker:clean:volumes` | Remove containers and volumes only       |
| `pnpm run docker:clean:all`     | Remove everything including all images   |

#### Kubernetes

| Command                     | Description                        |
| --------------------------- | ---------------------------------- |
| `pnpm run k8s:dev:build`    | Build local images for dev cluster |
| `pnpm run k8s:dev:apply`    | Deploy to dev namespace            |
| `pnpm run k8s:dev:delete`   | Remove dev deployment              |
| `pnpm run k8s:dev:status`   | Check dev deployment status        |
| `pnpm run k8s:prod:preview` | Preview production manifests       |
| `pnpm run k8s:prod:apply`   | Deploy to production namespace     |
| `pnpm run k8s:prod:delete`  | Remove production deployment       |
| `pnpm run k8s:prod:status`  | Check production deployment status |

## Docker Deployment

The application runs as a full stack with frontend, backend API, and MongoDB database.

### Quick Start with Docker Compose

1. Copy the environment template and configure:

   ```bash
   cp .env.example .env
   # Edit .env and set a secure JWT_SECRET
   ```

2. Start the full stack:

   ```bash
   # Development (builds from source)
   pnpm run docker:dev

   # Production (uses pre-built images)
   pnpm run docker:prod
   ```

3. Open [http://localhost:8080](http://localhost:8080) in your browser

### Services

| Service  | Port  | Description                    |
| -------- | ----- | ------------------------------ |
| Frontend | 8080  | React app served via nginx     |
| Backend  | 3001  | Express API server             |
| MongoDB  | 27017 | Database (internal by default) |

### Environment Variables

See `.env.example` for all available configuration options:

#### Required (change in production!)

| Variable                     | Description                | Default    |
| ---------------------------- | -------------------------- | ---------- |
| `JWT_SECRET`                 | Secret key for JWT signing | -          |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB admin username     | `admin`    |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB admin password     | `password` |

#### Optional

| Variable                       | Description                  | Default                 |
| ------------------------------ | ---------------------------- | ----------------------- |
| `FRONTEND_PORT`                | Frontend port                | `8080`                  |
| `BACKEND_PORT`                 | Backend API port             | `3001`                  |
| `MONGODB_PORT`                 | MongoDB port                 | `27017`                 |
| `JWT_EXPIRES_IN`               | JWT token expiration         | `7d`                    |
| `JWT_REMEMBER_ME_EXPIRES_IN`   | Remember me token expiration | `30d`                   |
| `CORS_ORIGIN`                  | Allowed CORS origin          | `http://localhost:8080` |
| `RATE_LIMIT_WINDOW_MS`         | Rate limit window (ms)       | `60000`                 |
| `RATE_LIMIT_MAX_REQUESTS`      | Max requests per window      | `100`                   |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | Max auth requests per window | `5`                     |

### Build Individual Images

```bash
# Frontend only
docker build -f infra/docker/Dockerfile.web -t prenatal-learning .

# Backend only
docker build -f infra/docker/Dockerfile.server -t prenatal-learning-backend ./apps/server
```

## Kubernetes Deployment

The application can be deployed to Kubernetes using Kustomize overlays for different environments.

### Prerequisites

- kubectl configured with cluster access
- Kustomize (built into kubectl v1.14+)
- Docker (for building dev images)

### Development Environment

Dev uses locally built images for faster iteration:

```bash
# Build local images
pnpm run k8s:dev:build

# Deploy to cluster
pnpm run k8s:dev:apply

# Port forward to access the app
kubectl port-forward svc/dev-frontend 8080:80 -n prenatal-learning-dev

# Open http://localhost:8080
```

### Production Environment

Production uses published images from Docker Hub (`keyurgolani/prenatal-learning:latest`).

Before deploying:

1. Update `infra/k8s/overlays/prod/secrets.yaml` with secure credentials
2. Update `infra/k8s/overlays/prod/configmap-patch.yaml` with your domain
3. Update `infra/k8s/overlays/prod/ingress.yaml` with your domain and TLS settings

```bash
# Preview manifests
pnpm run k8s:prod:preview

# Deploy to cluster
pnpm run k8s:prod:apply
```

### Environment Differences

| Feature         | Development                     | Production                                         |
| --------------- | ------------------------------- | -------------------------------------------------- |
| Images          | Local (`prenatal-learning:dev`) | Published (`keyurgolani/prenatal-learning:latest`) |
| Replicas        | 1                               | 2                                                  |
| MongoDB Storage | 1Gi                             | 10Gi                                               |
| Ingress         | No                              | Yes                                                |

See `infra/k8s/README.md` for detailed Kubernetes deployment documentation.

## Project Structure

```
├── apps/                     # Application packages
│   ├── web/                  # Frontend React application
│   │   ├── src/              # Source code
│   │   │   ├── components/   # React components
│   │   │   ├── contexts/     # React context providers
│   │   │   ├── data/         # Story and category data
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   ├── services/     # API and service utilities
│   │   │   ├── types/        # TypeScript type definitions
│   │   │   └── utils/        # Helper utilities
│   │   ├── public/           # Static assets (images, audio)
│   │   └── package.json      # Web app dependencies
│   └── server/               # Backend Express API
│       ├── config/           # Server configuration
│       ├── middleware/       # Express middleware
│       ├── models/           # MongoDB models
│       ├── routes/           # API route handlers
│       ├── validators/       # Zod validation schemas
│       ├── utils/            # Server utilities
│       └── package.json      # Server dependencies
├── infra/                    # Infrastructure configuration
│   ├── docker/               # Docker configuration
│   │   ├── Dockerfile.web    # Frontend Dockerfile
│   │   ├── Dockerfile.server # Backend Dockerfile
│   │   ├── docker-compose.yml
│   │   ├── docker-compose.dev.yml
│   │   └── nginx.conf
│   └── k8s/                  # Kubernetes manifests
│       ├── base/             # Base Kustomize configs
│       └── overlays/         # Environment-specific overlays
├── scripts/                  # Build and utility scripts
├── .github/                  # GitHub Actions workflows
├── package.json              # Root workspace configuration
└── pnpm-workspace.yaml       # pnpm workspace definition
```

## UI Architecture

### Header System

The application uses a two-row header system:

1. **Primary Header** (`Header.tsx`): Logo, navigation, audio player, view toggle, and user menu
2. **Secondary Header** (`SecondaryHeader.tsx`): Due date/trimester, streak badge, kick button, progress indicator, theme selector

### Reading Mode

When reading a topic, the secondary header transforms into a floating `ReadingModeBar`:

- Semi-transparent floating bar at the top
- Theme and font size controls
- Kick logging button
- ESC to exit indicator
- Journal button (for logged-in users)
- Auto-hides after 3 seconds, shows on mouse movement

### Floating Elements

- **FloatingStatusBar**: Journal FAB button for logged-in users (bottom-right)
- **JournalModal**: Full-screen journal with calendar, entries, voice recording

### Guest vs Authenticated

| Feature           | Guest            | Logged In               |
| ----------------- | ---------------- | ----------------------- |
| Due date tracking | ✓ (localStorage) | ✓ (cloud)               |
| Kick logging      | ✓ (localStorage) | ✓ (cloud)               |
| Progress tracking | ✓ (localStorage) | ✓ (cloud)               |
| Streak tracking   | ✓ (localStorage) | ✓ (cloud)               |
| Journal           | ✓ (localStorage) | ✓ (cloud + voice notes) |
| Cross-device sync | ✗                | ✓                       |
| Data migration    | -                | ✓ (from guest data)     |

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Community Contributions Needed

We're actively seeking community help with:

- **Illustration Images**: Better quality illustrations for story content. Current placeholder images need professional artwork that's warm, educational, and pregnancy-appropriate.
- **Audio Narration**: High-quality audio narration generated with professional TTS software or voice actors. Current audio manifests contain transcripts ready for recording.

See the `apps/web/public/images/stories/` and `apps/web/public/audio/stories/` directories for manifest files that describe what's needed for each story.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Keyur Golani** - [GitHub](https://github.com/keyurgolani)
