# Package Navigator 📦

A VS Code extension that helps you quickly navigate to and manage `package.json` files in your workspace. Perfect for developers working with monorepos, microservices, or any multi-package projects.

## Features ✨

- **Smart Package Detection**: Automatically finds the nearest `package.json` file for your current file
- **Quick Navigation**: Open package.json files instantly from any file in your project
- **Explorer Integration**: Reveal package.json files or package folders in the VS Code Explorer
- **Terminal Support**: Open an integrated terminal in the package directory
- **Path Utilities**: Copy relative or absolute paths of package.json files
- **Package Name Access**: Quickly copy package names to your clipboard

## Commands 🚀

Access all commands through the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description |
|---------|-------------|
| `Package Navigator: Open package.json` | Opens the nearest package.json file in the editor |
| `Package Navigator: Reveal package.json in Explorer View` | Shows the package.json file in the VS Code Explorer |
| `Package Navigator: Reveal Package Folder in Explorer View` | Shows the package folder in the VS Code Explorer |
| `Package Navigator: Open package.json in Integrated Terminal` | Opens a terminal in the package directory |
| `Package Navigator: Copy Relative Path of package.json` | Copies the relative path to clipboard |
| `Package Navigator: Copy Absolute Path of package.json` | Copies the absolute path to clipboard |
| `Package Navigator: Copy Package Name` | Copies the package name to clipboard |

## How It Works 🔍

Package Navigator intelligently searches for `package.json` files by:

1. Starting from your currently active file
2. Walking up the directory tree within your workspace
3. Finding the nearest `package.json` file
4. Respecting workspace boundaries to avoid conflicts

## Use Cases 💡

- **Monorepo Navigation**: Quickly jump between different packages in your monorepo
- **Dependency Management**: Fast access to package.json files for dependency updates
- **Build Script Access**: Quickly open terminals in the right package directory
- **Path References**: Copy package paths for documentation or configuration files
- **Package Information**: Access package names for CLI commands or documentation

## Installation 📥

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Package Navigator"
4. Click Install

## Development 🛠️

This extension is built with:
- TypeScript
- VS Code Extension API
- ESBuild for bundling
- PNPM for package management

### Building from Source

```bash
# Clone the repository
git clone <repository-url>
cd package-navigator-esbuild

# Install dependencies
pnpm install

# Compile the extension
pnpm run compile

# Package the extension
pnpm run package
```

### Running Tests

```bash
pnpm run test
```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ for developers who love efficient navigation!
