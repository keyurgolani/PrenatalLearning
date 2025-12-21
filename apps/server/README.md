# Prenatal Learning Hub - Backend API

Express.js API server for the Prenatal Learning Hub application with MongoDB persistence, JWT authentication, and comprehensive journaling features.

## Tech Stack

- Node.js 20+
- Express.js 4.x
- MongoDB 7.x with GridFS (for voice notes)
- TypeScript 5.x
- JWT Authentication
- Zod validation
- bcrypt password hashing

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB 7+ (local or cloud instance)

### Installation

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
# Start with hot-reload
npm run dev

# Or from project root
npm run server:dev
```

### Production

```bash
npm run build
npm start
```

## Available Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start server with hot-reload (tsx) |
| `npm run build`      | Compile TypeScript to JavaScript   |
| `npm run start`      | Run compiled production server     |
| `npm run lint`       | Run ESLint                         |
| `npm run test`       | Run tests once                     |
| `npm run test:watch` | Run tests in watch mode            |
| `npm run db:connect` | Connect to MongoDB via mongosh     |
| `npm run db:seed`    | Seed database with sample data     |
| `npm run db:reset`   | Reset database (clear all data)    |

## Docker

### Build and run standalone:

```bash
docker build -t prenatal-learning-backend .
docker run -p 3001:3001 --env-file .env prenatal-learning-backend
```

### Using Docker Compose (recommended):

```bash
# From project root - development
npm run docker:dev

# From project root - production
npm run docker:prod
```

## API Endpoints

### Health & Status

| Endpoint      | Method | Description  |
| ------------- | ------ | ------------ |
| `/api/health` | GET    | Health check |

### Authentication

| Endpoint             | Method | Description               |
| -------------------- | ------ | ------------------------- |
| `/api/auth/register` | POST   | Create new user account   |
| `/api/auth/login`    | POST   | Authenticate user         |
| `/api/auth/logout`   | POST   | Invalidate session        |
| `/api/auth/refresh`  | POST   | Refresh JWT token         |
| `/api/auth/forgot`   | POST   | Request password reset    |
| `/api/auth/reset`    | POST   | Reset password with token |
| `/api/auth/me`       | GET    | Get current user info     |

### Account Management

| Endpoint                | Method | Description              |
| ----------------------- | ------ | ------------------------ |
| `/api/account`          | PUT    | Update account details   |
| `/api/account/email`    | PUT    | Update email             |
| `/api/account/password` | PUT    | Change password          |
| `/api/account`          | DELETE | Request account deletion |
| `/api/account/recover`  | POST   | Recover deleted account  |

### User Preferences

| Endpoint           | Method | Description          |
| ------------------ | ------ | -------------------- |
| `/api/preferences` | GET    | Get user preferences |
| `/api/preferences` | PUT    | Update preferences   |

### Journal

| Endpoint                  | Method | Description                    |
| ------------------------- | ------ | ------------------------------ |
| `/api/journal`            | GET    | List entries (with date range) |
| `/api/journal`            | POST   | Create journal entry           |
| `/api/journal/calendar`   | GET    | Get calendar data              |
| `/api/journal/date/:date` | GET    | Get entries for specific date  |
| `/api/journal/moods`      | GET    | Get mood statistics            |
| `/api/journal/:id`        | GET    | Get single entry               |
| `/api/journal/:id`        | PUT    | Update entry                   |
| `/api/journal/:id`        | DELETE | Delete entry                   |

### Voice Notes

| Endpoint               | Method | Description             |
| ---------------------- | ------ | ----------------------- |
| `/api/voice-notes`     | POST   | Upload voice note       |
| `/api/voice-notes/:id` | GET    | Stream voice note audio |
| `/api/voice-notes/:id` | DELETE | Delete voice note       |

### Kick Tracking

| Endpoint              | Method | Description              |
| --------------------- | ------ | ------------------------ |
| `/api/kicks`          | GET    | List kick events         |
| `/api/kicks`          | POST   | Log kick event           |
| `/api/kicks/:id`      | PUT    | Update kick (add note)   |
| `/api/kicks/:id`      | DELETE | Delete kick event        |
| `/api/kicks/stats`    | GET    | Get kick statistics      |
| `/api/kicks/daily`    | GET    | Get daily kick counts    |
| `/api/kicks/patterns` | GET    | Get time-of-day patterns |

### Progress & Streaks

| Endpoint        | Method | Description           |
| --------------- | ------ | --------------------- |
| `/api/progress` | GET    | Get learning progress |
| `/api/progress` | POST   | Update progress       |
| `/api/streaks`  | GET    | Get streak data       |

## Environment Variables

| Variable                       | Description                  | Default                                           |
| ------------------------------ | ---------------------------- | ------------------------------------------------- |
| `MONGODB_URI`                  | MongoDB connection string    | `mongodb://localhost:27017/prenatal-learning-hub` |
| `MONGODB_DB_NAME`              | Database name                | `prenatal-learning-hub`                           |
| `JWT_SECRET`                   | Secret key for JWT signing   | -                                                 |
| `JWT_EXPIRES_IN`               | JWT token expiration         | `7d`                                              |
| `JWT_REMEMBER_ME_EXPIRES_IN`   | Remember me token expiration | `30d`                                             |
| `PORT`                         | Server port                  | `3001`                                            |
| `NODE_ENV`                     | Environment mode             | `development`                                     |
| `CORS_ORIGIN`                  | Allowed CORS origin          | `http://localhost:5173`                           |
| `RATE_LIMIT_WINDOW_MS`         | Rate limit window (ms)       | `60000`                                           |
| `RATE_LIMIT_MAX_REQUESTS`      | Max requests per window      | `100`                                             |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | Max auth requests per window | `5`                                               |

## Database Collections

| Collection        | Description                           |
| ----------------- | ------------------------------------- |
| `users`           | User accounts with due date           |
| `userPreferences` | User settings and preferences         |
| `journalEntries`  | Journal entries with mood tracking    |
| `voiceNotes`      | Voice note metadata (audio in GridFS) |
| `kickEvents`      | Baby kick tracking events             |
| `progress`        | Learning progress records             |
| `streaks`         | User activity streaks                 |
| `fs.files`        | GridFS file metadata (voice notes)    |
| `fs.chunks`       | GridFS file chunks (voice note audio) |

## Security Features

- JWT-based authentication with HTTP-only cookies
- bcrypt password hashing (10 rounds)
- Rate limiting on all endpoints
- Stricter rate limiting on auth endpoints
- Input sanitization via Zod validation
- CORS protection
- Helmet security headers
