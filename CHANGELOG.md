# Change Log

All notable changes to the Node.js Package Navigator extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.1] - 2025-07-18

- Added extension icon

## [0.1.0] - 2025-07-18

Added:

- **Smart Package Detection**: Automatically finds the nearest `package.json` file for your current file
- **Quick Navigation**: Open package.json files instantly from any file in your project
- **Explorer Integration**: Reveal package.json files or package folders in the VS Code Explorer
- **Terminal Support**: Open an integrated terminal in the package directory
- **Path Utilities**: Copy relative or absolute paths of package.json files
- **Package Name Access**: Quickly copy package names to your clipboard
- **Workspace Boundary Respect**: Searches within workspace boundaries to avoid conflicts

Commands:

- Open package.json
- Reveal package.json in Explorer View
- Reveal Package Folder in Explorer View
- Open package.json in Integrated Terminal
- Copy Relative Path of package.json
- Copy Absolute Path of package.json
- Copy Package Name

Technical Details:

- Built with TypeScript and VS Code Extension API
- Uses ESBuild for efficient bundling
- Supports Node.js >= 22.15.0
- Compatible with VS Code >= 1.99.0
