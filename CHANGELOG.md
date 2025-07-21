# Change Log

All notable changes to the Node.js Package Navigator extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.4.1] - 2025-07-21

Added:

- Versioning strategy documentation to CONTRIBUTING.md
- Automated pre-release build and publish to CI/CD pipeline
- CI test jobs under Linux, macOS and Windows

Changed:

- CI/CD pipeline now validates package.json minor versions must be even
- Pre-release versions now use format {major}.{minor+1}.{ci_workflow_run}

## [0.4.0] - 2025-07-21

- Updated command ids to be more descriptive and consistent
  - "package-navigator.revealPackageFolder" → "package-navigator.revealPackageJsonDir"
  - "package-navigator.openPackageFolderInTerminal" → "package-navigator.openPackageJsonDirInTerminal"
- Updated command names to be more descriptive and consistent
  - "Open package.json" → "Open package.json of Active File"
  - "Reveal Package Folder in Explorer View" → "Reveal package.json Folder in Explorer View"
  - "Open package.json in Integrated Terminal" → "Open package.json Folder in Integrated Terminal"
  - "Copy Package Name" → "Copy Package Name of Active File"
- Added shortTitle properties to all commands for better UI display

## [0.2.2] - 2025-07-19

- Add keywords to package.json for better discoverability

## [0.2.1] - 2025-07-19

- Clean up unused files in the extension bundle

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
- **Terminal Support**: Open an integrated terminal in the package Folder
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
