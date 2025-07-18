# Contributing to Package Navigator 🤝

Thank you for your interest in contributing to Package Navigator! This document provides guidelines and information for contributors.

## Development Setup 🛠️

This extension is built with:

- TypeScript
- VS Code Extension API
- ESBuild for bundling
- PNPM for package management

### Prerequisites

- Node.js >= 22.15.0
- PNPM 10.13.1+
- VS Code

### Building from Source

```bash
# Clone the repository
git clone https://github.com/reekystive/vscode-package-navigator.git
cd vscode-package-navigator

# Install dependencies
pnpm install

# Compile the extension
pnpm run compile

# Package the extension
pnpm run package
```

### Development Commands

| Command                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `pnpm run compile`       | Compile the extension with type checking and linting |
| `pnpm run watch`         | Watch for changes and recompile automatically        |
| `pnpm run watch:esbuild` | Watch for changes and rebuild with ESBuild           |
| `pnpm run watch:tsc`     | Watch for TypeScript changes                         |
| `pnpm run check-types`   | Run TypeScript type checking                         |
| `pnpm run lint`          | Run ESLint                                           |
| `pnpm run test`          | Run tests                                            |
| `pnpm run package`       | Create production build                              |

### Running Tests

```bash
# Run all tests
pnpm run test

# Compile tests only
pnpm run compile-tests

# Watch tests
pnpm run watch-tests
```

### Development Workflow

1. **Fork and Clone**: Fork the repository and clone your fork
2. **Install Dependencies**: Run `pnpm install`
3. **Create Branch**: Create a feature branch from `main`
4. **Develop**: Make your changes
5. **Test**: Run `pnpm run test` to ensure tests pass
6. **Lint**: Run `pnpm run lint` to check code style
7. **Build**: Run `pnpm run package` to create production build
8. **Commit**: Make descriptive commits
9. **Push**: Push to your fork
10. **PR**: Create a Pull Request

### Testing Your Changes

1. Press `F5` in VS Code to launch a new Extension Development Host window
2. In the new window, open a project with package.json files
3. Test the extension commands through the Command Palette
4. Verify all functionality works as expected

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write descriptive commit messages
- Include tests for new features
- Update documentation as needed

### Project Structure

```plaintext
├── src/
│   ├── extension.ts          # Main extension code
│   └── test/
│       └── extension.test.ts # Tests
├── dist/                     # Compiled extension
├── out/                      # TypeScript output
├── package.json             # Extension manifest
├── tsconfig.json           # TypeScript configuration
├── esbuild.mjs             # ESBuild configuration
└── eslint.config.mjs       # ESLint configuration
```

### Key Functions

- `findPackageJson()`: Searches for the nearest package.json file
- `getPackageName()`: Extracts package name from package.json
- `getDetailedErrorMessage()`: Provides user-friendly error messages

### Submitting Changes

1. Ensure all tests pass
2. Update documentation if needed
3. Follow the existing code style
4. Write clear commit messages
5. Submit a Pull Request with a detailed description

### Reporting Issues

When reporting issues, please include:

- VS Code version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Any error messages

### Getting Help

- Check existing issues and discussions
- Review the VS Code Extension API documentation
- Ask questions in the issue tracker

Thank you for contributing! 🎉
