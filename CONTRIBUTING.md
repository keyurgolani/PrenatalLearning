# Contributing to Prenatal Learning Hub

Thank you for your interest in contributing! This project aims to help expectant parents bond with their babies through educational content.

## Ways to Contribute

### Media Contributions (High Priority!)

We especially need help with visual and audio content:

#### Illustration Images

We need warm, educational illustrations for all 32 stories. Requirements:

- Family-friendly, pregnancy-appropriate imagery
- Consistent art style across stories
- PNG or WebP format, optimized for web
- Include alt text for accessibility

Each story has a `manifest.txt` file in `public/images/stories/{storyId}/` describing suggested images based on story analogies and concepts.

#### Audio Narration

We need high-quality audio narration for all stories. Options:

- Professional TTS software (e.g., ElevenLabs, Amazon Polly, Google Cloud TTS)
- Voice actor recordings
- MP3 format, clear and calming tone

Each story has a `manifest.txt` file in `public/audio/stories/{storyId}/` with full transcripts ready for recording.

### Content Contributions

- **New Stories**: Add educational stories in categories like science, technology, biology, mathematics, psychology, language, finance, and society
- **Interactive Exercises**: Create engaging prenatal learning activities
- **Translations**: Help translate content to other languages

### Code Contributions

- **Bug Fixes**: Fix issues and improve stability
- **New Features**: Implement new functionality
- **Performance**: Optimize loading and rendering
- **Accessibility**: Improve a11y compliance
- **Testing**: Add unit and integration tests

### Documentation

- Improve README and guides
- Add code comments
- Create tutorials

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/PrenatalLearning.git
   ```
3. **Install** dependencies:
   ```bash
   corepack enable
   pnpm install
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Using Docker (Recommended)

The easiest way to run the full stack locally:

```bash
# Copy environment template
cp .env.example .env
# Edit .env and set secure values for JWT_SECRET and MONGO_INITDB_ROOT_PASSWORD

# Start all services (frontend, backend, MongoDB)
pnpm run docker:dev

# Or start in background
pnpm run docker:dev:detach

# Check container status
pnpm run docker:status

# View logs
pnpm run docker:logs
pnpm run docker:logs:backend
pnpm run docker:logs:frontend
pnpm run docker:logs:db

# Rebuild after code changes
pnpm run docker:dev:rebuild              # Rebuild frontend + backend
pnpm run docker:dev:rebuild:frontend     # Rebuild frontend only
pnpm run docker:dev:rebuild:backend      # Rebuild backend only

# Restart services (without rebuild)
pnpm run docker:restart

# Access MongoDB shell
pnpm run docker:shell:db

# Stop services
pnpm run docker:dev:down

# Clean up (remove volumes and images)
pnpm run docker:clean
pnpm run docker:clean:all    # Remove everything including all images
```

### Using Kubernetes

For Kubernetes-based development:

```bash
# Build local images for dev
pnpm run k8s:dev:build

# Deploy to local cluster
pnpm run k8s:dev:apply

# Port forward to access the app
kubectl port-forward svc/dev-frontend 8080:80 -n prenatal-learning-dev

# Check deployment status
pnpm run k8s:dev:status

# Clean up
pnpm run k8s:dev:delete
```

### Manual Setup

If you prefer running services individually:

1. Start MongoDB locally or use a cloud instance
2. Configure `apps/server/.env` with your MongoDB URI
3. Start the backend:
   ```bash
   pnpm run dev:server
   ```
4. Start the frontend:
   ```bash
   pnpm run dev
   ```

## Available Scripts

### Frontend Development

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

### Backend Development

| Command                     | Description                      |
| --------------------------- | -------------------------------- |
| `pnpm run dev:server`       | Start backend development server |
| `pnpm run build:server`     | Build backend for production     |
| `pnpm run start:server`     | Start production backend         |
| `pnpm run test:server`      | Run backend tests                |
| `pnpm run lint:server`      | Run backend ESLint               |
| `pnpm run typecheck:server` | Run backend TypeScript checking  |

### Workspace Commands

| Command                       | Description                       |
| ----------------------------- | --------------------------------- |
| `pnpm run dev:all`            | Start all dev servers in parallel |
| `pnpm run build:all`          | Build all packages in workspace   |
| `pnpm run lint:all`           | Lint all packages in workspace    |
| `pnpm run test:all`           | Run tests in all packages         |
| `pnpm run typecheck:all`      | Type check all packages           |
| `pnpm run clean`              | Clean all node_modules and dist   |
| `pnpm run generate:manifests` | Generate audio/image manifests    |

### Before Submitting

1. Run linting:
   ```bash
   pnpm run lint:all
   ```
2. Run tests:
   ```bash
   pnpm run test:all
   ```
3. Type check:
   ```bash
   pnpm run typecheck:all
   ```
4. Commit with a clear message:
   ```bash
   git commit -m "Add: description of your change"
   ```
5. Push and create a Pull Request

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
│   └── k8s/                  # Kubernetes manifests
├── docs/                     # Documentation and screenshots
├── scripts/                  # Build and utility scripts
├── .github/                  # GitHub Actions workflows
├── package.json              # Root workspace configuration
└── pnpm-workspace.yaml       # pnpm workspace definition
```

## Adding New Stories

Stories are located in `apps/web/src/data/stories/`. Each story should include:

- `id`: Unique numeric identifier
- `title`: Story title
- `description`: Brief description
- `category`: One of the defined categories
- `difficulty`: 'Foundational', 'Intermediate', or 'Advanced'
- `trimester`: '1st', '2nd', '3rd', or 'All'
- `content`: The story content with sections

## Code Style

- Use TypeScript for all new code
- Follow existing patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure accessibility compliance

## Pull Request Guidelines

- Keep PRs focused on a single change
- Include a clear description of what and why
- Reference any related issues
- Ensure all tests pass
- Update documentation if needed

## Questions?

Open an issue for questions or suggestions. We appreciate all contributions!
