# Contributing to Prenatal Learning Hub

Thank you for your interest in contributing! This project aims to help expectant parents bond with their babies through educational content.

## Ways to Contribute

### Content Contributions

- **New Stories**: Add educational stories in categories like alphabet, numbers, colors, shapes, animals, nature, music, and emotions
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
   npm install
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. Make your changes
2. Run linting:
   ```bash
   npm run lint
   ```
3. Run tests:
   ```bash
   npm run test
   ```
4. Commit with a clear message:
   ```bash
   git commit -m "Add: description of your change"
   ```
5. Push and create a Pull Request

## Adding New Stories

Stories are located in `src/data/stories/`. Each story should include:

- `id`: Unique numeric identifier
- `title`: Story title
- `description`: Brief description
- `category`: One of the defined categories
- `difficulty`: 'easy', 'medium', or 'hard'
- `content`: The story content with sections

## Code Style

- Use TypeScript for all new code
- Follow existing patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic

## Pull Request Guidelines

- Keep PRs focused on a single change
- Include a clear description of what and why
- Reference any related issues
- Ensure all tests pass
- Update documentation if needed

## Questions?

Open an issue for questions or suggestions. We appreciate all contributions!
