# Prenatal Learning Hub

A beautiful, interactive web application designed to help expectant parents bond with their baby through educational stories, activities, and exercises during pregnancy.

## Features

- **Educational Stories**: Curated collection of stories across multiple categories including alphabet, numbers, colors, shapes, animals, and more
- **Interactive Exercises**: Engaging activities to stimulate prenatal learning and bonding
- **Progress Tracking**: Track completed stories with local storage persistence
- **Filtering & Search**: Filter stories by category, difficulty level, or search by keywords
- **Responsive Design**: Beautiful gradient UI that works on all devices
- **Accessibility**: Built with accessibility in mind

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Vitest** - Unit testing framework

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

| Command              | Description              |
| -------------------- | ------------------------ |
| `npm run dev`        | Start development server |
| `npm run build`      | Build for production     |
| `npm run preview`    | Preview production build |
| `npm run lint`       | Run ESLint               |
| `npm run test`       | Run tests once           |
| `npm run test:watch` | Run tests in watch mode  |

## Docker Deployment

### Quick Start (Recommended)

Pull and run the pre-built image from Docker Hub or GitHub Container Registry:

```bash
# From Docker Hub
docker run -p 8080:80 keyurgolani/prenatal-learning:latest

# From GitHub Container Registry
docker run -p 8080:80 ghcr.io/keyurgolani/prenatallearning:latest
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Using Docker Compose

Create a `docker-compose.yml`:

```yaml
services:
  prenatal-learning:
    image: keyurgolani/prenatal-learning:latest
    ports:
      - "8080:80"
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
```

### Build from Source

If you want to build the image yourself:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Or manually:

```bash
docker build -t prenatal-learning .
docker run -p 8080:80 prenatal-learning
```

## Project Structure

```
src/
├── components/       # React components
│   ├── exercises/    # Interactive exercise components
│   └── ...
├── data/            # Story and category data
│   ├── stories/     # Individual story content
│   └── interactiveExercises/
├── services/        # API and service utilities
├── types/           # TypeScript type definitions
└── utils/           # Helper utilities
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Keyur Golani** - [GitHub](https://github.com/keyurgolani)
