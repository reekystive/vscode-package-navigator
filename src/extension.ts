import * as vscode from 'vscode';
import { registerCommands } from './commands.js';
import { initializeLogger, log } from './logger.js';

// Re-export functions for tests
export { getDetailedErrorMessage } from './error-messages.js';
export { findPackageJson, getPackageName } from './package-finder.js';

export function activate(context: vscode.ExtensionContext) {
  initializeLogger(context);

  log('Extension activation started');
  log(`Platform: ${typeof globalThis !== 'undefined' && 'window' in globalThis ? 'web' : 'desktop'}`);
  log('Extension "package-navigator" is now active!');

  registerCommands(context);
}

// This method is called when your extension is deactivated
export function deactivate() {
  // do nothing
}
