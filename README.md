# Node.js Package Navigator 📦

A VS Code extension that helps you quickly navigate to and manage `package.json` files in your workspace. Perfect for developers working with monorepos, microservices, or any multi-package projects.

Supports all VS Code environments:

- Local
- Remote (SSH/WSL/Dev Containers)
- Web (github.dev, vscode.dev)

View this extension on [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=reekystive.package-navigator) or [Open VSX](https://open-vsx.org/extension/reekystive/package-navigator).

## Features ✨

- **Smart Package Detection**: Automatically finds the nearest `package.json` file for your current file
- **Quick Navigation**: Open package.json files instantly from any file in your project
- **Explorer Integration**: Reveal package.json files or package folders in the VS Code Explorer
- **Terminal Support**: Open an integrated terminal in the package directory
- **Path Utilities**: Copy relative or absolute paths of package.json files
- **Package Name Access**: Quickly copy package names to your clipboard
- **Cross-Platform Compatibility**: Works seamlessly in Desktop, Remote, and Web environments
- **Virtual Workspace Support**: Compatible with virtual file systems and remote workspaces

## Commands 🚀

Access all commands through the Command Palette (Ctrl+Shift+P / Cmd+Shift+P):

| Command                                         | Description                                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| Open package.json of Active File                | Opens the nearest package.json of the active file in the editor                       |
| Reveal package.json in Explorer View            | Shows the package.json of the active file in the VS Code Sidebar File Explorer        |
| Reveal package.json Folder in Explorer View     | Shows the package.json folder of the active file in the VS Code Sidebar File Explorer |
| Open package.json Folder in Integrated Terminal | Opens a VSCode integrated terminal in the package.json folder of the active file      |
| Copy Relative Path of package.json              | Copies the relative path of the package.json of the active file to clipboard          |
| Copy Absolute Path of package.json              | Copies the absolute path of the package.json of the active file to clipboard          |
| Copy Package Name of Active File                | Copies the package name in the package.json of the active file to clipboard           |

## How It Works 🔍

Node.js Package Navigator intelligently searches for `package.json` files by:

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

### Via VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Node.js Package Navigator"
4. Click Install

### Via Command Palette

1. Open VS Code
2. Press Ctrl+P / Cmd+P to open Command Palette
3. Type `ext install reekystive.package-navigator`
4. Press Enter

### Via VSCode CLI

```bash
code --install-extension reekystive.package-navigator
```

## Keyboard Shortcuts ⌨️

You can assign custom keyboard shortcuts to any of the commands through VS Code's built-in keyboard shortcuts settings:

1. Open VS Code Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Search for "Preferences: Open Keyboard Shortcuts"
3. Search for "Node.js Package Navigator" to find all available commands
4. Click on the command you want to assign a shortcut to
5. Press your desired key combination
6. Press Enter to save

Alternatively, you can edit the `keybindings.json` file directly:

- Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
- Type "Preferences: Open Keyboard Shortcuts (JSON)"
- Add your custom keybindings using the command IDs from the extension

## Contributing 🤝

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for development setup, testing, and submission guidelines.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ for developers who love efficient navigation!
