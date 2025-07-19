# Change Log

All notable changes to the Node.js Package Navigator extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2025-07-19

- Refactor code to support virtual workspaces
- Add support for web extensions
- Add support for remote development environments
- Remove Node.js specific dependencies

## [0.1.10] - 2025-07-19

- Updated CONTRIBUTING.md

## [0.1.7] - 2025-07-19

- Add GitHub Actions for building and publishing

## [0.1.6] - 2025-07-19

- Update dependencies

## [0.1.5] - 2025-07-19

- Change output format to CommonJS to fix plugin loading issues in Cursor

## [0.1.4] - 2025-07-18

- Updated extension description

## [0.1.3] - 2025-07-18

- Added keyboard shortcuts assignment instructions to README.md

## [0.1.2] - 2025-07-18

- Added description to package.json
- Updated README.md formatting

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
