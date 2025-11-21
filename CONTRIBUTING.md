# Contributing to smart-env

Thank you for your interest in contributing to smart-env! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js 18.x, 20.x, or 22.x
- npm 9.x or higher
- Git

### Setup Development Environment

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-env.git
   cd smart-env
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

5. **Run type checks:**
   ```bash
   npm run type-check
   ```

## Development Workflow

### Making Changes

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the `src/` directory

3. **Add tests** in the `tests/` directory

4. **Run all checks:**
   ```bash
   npm test              # Run tests
   npm run type-check    # Check types
   npm run lint          # Lint code
   npm run build         # Build project
   ```

5. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Build process or auxiliary tool changes

**Examples:**
```bash
git commit -m "feat: add email type validation"
git commit -m "fix: resolve Windows path issue in CLI"
git commit -m "docs: update Next.js integration examples"
git commit -m "test: add tests for URL validation"
```

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass:**
   ```bash
   npm test
   npm run type-check
   npm run lint
   npm run build
   npm run ci:check-build
   npm run ci:check-size
   ```

4. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

6. **Wait for review** - maintainers will review your PR

## Project Structure

```
smart-env/
├── src/
│   ├── core/          # Core validation logic
│   │   ├── validator.ts
│   │   ├── parser.ts
│   │   └── formatter.ts
│   ├── cli/           # CLI commands
│   │   ├── init.ts
│   │   └── validate.ts
│   ├── index.ts       # Main API
│   └── types.ts       # TypeScript types
├── tests/             # Test files
├── examples/          # Usage examples
├── scripts/           # Build and CI scripts
├── .github/
│   └── workflows/     # GitHub Actions
└── dist/              # Built files (generated)
```

## Adding New Features

### Adding a New Type

To add a new environment variable type (e.g., `email`):

1. **Add type to union** in `src/types.ts`:
   ```typescript
   export type EnvVarType = 'string' | 'number' | 'boolean' | 'url' | 'json' | 'enum' | 'email';
   ```

2. **Create config interface** in `src/types.ts`:
   ```typescript
   export interface EmailEnvVarConfig extends BaseEnvVarConfig {
     type: 'email';
   }
   ```

3. **Add to union type** in `src/types.ts`:
   ```typescript
   export type EnvVarConfig =
     | StringEnvVarConfig
     | NumberEnvVarConfig
     // ... other types
     | EmailEnvVarConfig;
   ```

4. **Implement parser** in `src/core/parser.ts`:
   ```typescript
   function parseEmail(
     value: string,
     _config: EnvVarConfig & { type: 'email' },
     variableName: string
   ): { value: string; error?: ValidationError } {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(value)) {
       return {
         value,
         error: {
           variable: variableName,
           message: 'Invalid email format',
           expected: 'valid email address',
           received: value
         }
       };
     }
     return { value };
   }
   ```

5. **Add case to switch** in `parseValue()`:
   ```typescript
   case 'email':
     return parseEmail(rawValue, config, variableName);
   ```

6. **Update formatter** in `src/core/formatter.ts`:
   ```typescript
   case 'email':
     return 'email address';
   ```

7. **Add tests** in `tests/parser.test.ts`:
   ```typescript
   describe('email type', () => {
     it('should parse valid email', () => {
       const result = parseValue('user@example.com', { type: 'email' }, 'TEST');
       expect(result.value).toBe('user@example.com');
       expect(result.error).toBeUndefined();
     });

     it('should reject invalid email', () => {
       const result = parseValue('not-an-email', { type: 'email' }, 'TEST');
       expect(result.error).toBeDefined();
     });
   });
   ```

8. **Update documentation** in `README.md`

### Adding a New CLI Command

To add a new CLI command (e.g., `export`):

1. **Create command file** in `src/cli/export.ts`:
   ```typescript
   export function exportCommand(options: {}) {
     console.log('Exporting environment variables...');
     // Implementation
   }
   ```

2. **Add to CLI entry point** in `bin/smart-env.js`:
   ```javascript
   program
     .command('export')
     .description('Export environment variables')
     .action(async (options) => {
       const { exportCommand } = require('../dist/cli/export');
       exportCommand(options);
     });
   ```

3. **Add to Rollup config** in `rollup.config.js`:
   ```javascript
   input: {
     'cli/init': 'src/cli/init.ts',
     'cli/validate': 'src/cli/validate.ts',
     'cli/export': 'src/cli/export.ts'  // Add this
   }
   ```

4. **Add tests** in `tests/cli-export.test.ts`

5. **Update documentation** in `README.md`

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Run specific test file
npx vitest run tests/parser.test.ts
```

### Writing Tests

We use Vitest for testing. Test files should be in the `tests/` directory.

**Example test:**
```typescript
import { describe, it, expect } from 'vitest';
import { parseValue } from '../src/core/parser';

describe('new feature', () => {
  it('should do something', () => {
    const result = parseValue('test', { type: 'string' }, 'VAR');
    expect(result.value).toBe('test');
  });
});
```

## Code Style

### TypeScript Guidelines

- Use TypeScript strict mode
- Provide type annotations for public APIs
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### ESLint

We use ESLint for code quality:

```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npx eslint src/**/*.ts --fix
```

### Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 100 characters

## Documentation

### Code Comments

- Add JSDoc comments for public functions
- Explain complex logic
- Document parameters and return types

**Example:**
```typescript
/**
 * Parse a string value according to the specified type configuration
 *
 * @param rawValue - The raw string value from environment
 * @param config - The configuration for this variable
 * @param variableName - Name of the environment variable
 * @returns Parsed value and optional error
 */
export function parseValue(
  rawValue: string | undefined,
  config: EnvVarConfig,
  variableName: string
): { value: any; error?: ValidationError } {
  // Implementation
}
```

### README Updates

When adding features:
1. Update API documentation
2. Add usage examples
3. Update framework integration examples if relevant

## CI/CD

### GitHub Actions

All PRs trigger CI workflows:
- Build and test on multiple OS (Ubuntu, Windows, macOS)
- Test on Node.js 18, 20, and 22
- Type checking
- Linting
- Bundle size check

### Local CI Checks

Run the same checks locally before pushing:

```bash
npm test
npm run type-check
npm run lint
npm run build
npm run ci:check-build
npm run ci:check-size
```

## Release Process

Releases are handled by maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.0.1`
4. Push tag: `git push --tags`
5. GitHub Actions automatically publishes to npm

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Read the documentation thoroughly

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow

Thank you for contributing! 🎉
