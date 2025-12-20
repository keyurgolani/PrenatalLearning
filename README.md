# Prenatal Learning Hub

A beautiful, interactive web application designed to help expectant parents bond with their baby through educational stories, activities, and exercises during pregnancy.

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

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/keyurgolani/PrenatalLearning.git
   cd PrenatalLearning
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

#### Frontend Development

| Command                 | Description                       |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Start frontend development server |
| `npm run build`         | Build frontend for production     |
| `npm run preview`       | Preview production build          |
| `npm run lint`          | Run ESLint                        |
| `npm run lint:fix`      | Run ESLint with auto-fix          |
| `npm run typecheck`     | Run TypeScript type checking      |
| `npm run test`          | Run tests once                    |
| `npm run test:watch`    | Run tests in watch mode           |
| `npm run test:coverage` | Run tests with coverage report    |

#### Backend Development

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run server:dev`   | Start backend development server |
| `npm run server:build` | Build backend for production     |
| `npm run server:start` | Start production backend         |
| `npm run server:test`  | Run backend tests                |
| `npm run server:lint`  | Run backend ESLint               |

#### Docker - Stack Management

| Command                               | Description                          |
| ------------------------------------- | ------------------------------------ |
| `npm run docker:dev`                  | Start full stack (dev build)         |
| `npm run docker:dev:detach`           | Start full stack in background       |
| `npm run docker:dev:down`             | Stop dev environment                 |
| `npm run docker:dev:rebuild`          | Rebuild and restart frontend+backend |
| `npm run docker:dev:rebuild:frontend` | Rebuild frontend only                |
| `npm run docker:dev:rebuild:backend`  | Rebuild backend only                 |
| `npm run docker:prod`                 | Start production environment         |
| `npm run docker:prod:detach`          | Start production in background       |
| `npm run docker:prod:down`            | Stop production environment          |
| `npm run docker:status`               | Show container status                |

#### Docker - Logs & Debugging

| Command                        | Description               |
| ------------------------------ | ------------------------- |
| `npm run docker:logs`          | Follow all container logs |
| `npm run docker:logs:frontend` | Follow frontend logs      |
| `npm run docker:logs:backend`  | Follow backend logs       |
| `npm run docker:logs:db`       | Follow MongoDB logs       |

#### Docker - Service Management

| Command                           | Description                     |
| --------------------------------- | ------------------------------- |
| `npm run docker:restart`          | Restart all containers          |
| `npm run docker:restart:frontend` | Restart frontend container      |
| `npm run docker:restart:backend`  | Restart backend container       |
| `npm run docker:restart:db`       | Restart MongoDB container       |
| `npm run docker:shell:backend`    | Open shell in backend container |
| `npm run docker:shell:db`         | Open MongoDB shell              |
| `npm run docker:db:status`        | Check MongoDB connection status |

#### Docker - Cleanup

| Command                        | Description                              |
| ------------------------------ | ---------------------------------------- |
| `npm run docker:clean`         | Remove containers, volumes, local images |
| `npm run docker:clean:volumes` | Remove containers and volumes only       |
| `npm run docker:clean:all`     | Remove everything including all images   |

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
   npm run docker:dev

   # Production (uses pre-built images)
   npm run docker:prod
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
docker build -t prenatal-learning .

# Backend only
docker build -t prenatal-learning-backend ./server
```

## Project Structure

```
├── src/                      # Frontend source code
│   ├── components/           # React components
│   │   ├── auth/             # Authentication components
│   │   ├── exercises/        # Interactive exercise components
│   │   ├── journal/          # Journal and voice recording
│   │   ├── kicks/            # Kick tracking components
│   │   ├── TopicPage/        # Topic/story page components
│   │   ├── Header.tsx        # Main header component
│   │   ├── SecondaryHeader.tsx # Stats bar (due date, kick, progress)
│   │   ├── ReadingModeBar.tsx  # Floating bar for reading mode
│   │   └── FloatingStatusBar.tsx # Journal FAB for logged-in users
│   ├── contexts/             # React context providers
│   ├── data/                 # Story and category data
│   │   ├── stories/          # Individual story content
│   │   └── interactiveExercises/
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API and service utilities
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Helper utilities
├── server/                   # Backend API server
│   ├── config/               # Server configuration
│   ├── middleware/           # Express middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API route handlers
│   ├── validators/           # Zod validation schemas
│   └── utils/                # Server utilities
├── public/                   # Static assets
│   ├── audio/                # Audio narration files
│   └── images/               # Story illustrations
└── docker-compose*.yml       # Docker configurations
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

See the `public/images/stories/` and `public/audio/stories/` directories for manifest files that describe what's needed for each story.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Keyur Golani** - [GitHub](https://github.com/keyurgolani)
