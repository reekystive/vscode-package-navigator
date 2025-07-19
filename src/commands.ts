import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { getDetailedErrorMessage } from './error-messages.js';
import { log, logAndShowError, logError } from './logger.js';
import { findPackageJson, getPackageName } from './package-finder.js';

export function registerCommands(context: vscode.ExtensionContext) {
  // Open package.json
  const openPackageJson = vscode.commands.registerCommand('package-navigator.openPackageJson', async () => {
    log('=================================');
    log('Executing openPackageJson command');

    const packageJsonUri = await findPackageJson();
    if (!packageJsonUri) {
      logAndShowError('openPackageJson failed', getDetailedErrorMessage());
      return;
    }

    log(`Opening package.json at: ${packageJsonUri}`);
    try {
      const uri = vscode.Uri.parse(packageJsonUri);
      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document);
      log('Successfully opened package.json');
    } catch (error) {
      logError('Failed to open package.json', error);
      vscode.window.showErrorMessage('Failed to open package.json file');
    }
  });

  // Reveal package.json in explorer
  const revealPackageJson = vscode.commands.registerCommand('package-navigator.revealPackageJson', async () => {
    log('=================================');
    log('Executing revealPackageJson command');

    const packageJsonUri = await findPackageJson();
    if (!packageJsonUri) {
      logAndShowError('revealPackageJson failed', getDetailedErrorMessage());
      return;
    }

    log(`Revealing package.json in explorer: ${packageJsonUri}`);
    try {
      await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.parse(packageJsonUri));
      log('Successfully revealed package.json in explorer');
    } catch (error) {
      logError('Failed to reveal package.json in explorer', error);
      vscode.window.showErrorMessage('Failed to reveal package.json in explorer');
    }
  });

  // Reveal package folder in explorer
  const revealPackageFolder = vscode.commands.registerCommand('package-navigator.revealPackageFolder', async () => {
    log('=================================');
    log('Executing revealPackageFolder command');

    const packageJsonUri = await findPackageJson();
    if (!packageJsonUri) {
      logAndShowError('revealPackageFolder failed', getDetailedErrorMessage());
      return;
    }

    log(`Revealing package folder in explorer for: ${packageJsonUri}`);
    try {
      const uri = vscode.Uri.parse(packageJsonUri);
      const packageDir = Utils.dirname(uri);
      await vscode.commands.executeCommand('revealInExplorer', packageDir);
      log('Successfully revealed package folder in explorer');
    } catch (error) {
      logError('Failed to reveal package folder in explorer', error);
      vscode.window.showErrorMessage('Failed to reveal package folder in explorer');
    }
  });

  // Open package.json in integrated terminal
  const openPackageJsonInTerminal = vscode.commands.registerCommand(
    'package-navigator.openPackageJsonInTerminal',
    async () => {
      log('=================================');
      log('Executing openPackageJsonInTerminal command');

      const packageJsonUri = await findPackageJson();
      if (!packageJsonUri) {
        logAndShowError('openPackageJsonInTerminal failed', getDetailedErrorMessage());
        return;
      }

      try {
        const packageName = await getPackageName(packageJsonUri);
        const terminalName = packageName || 'Node.js Package Navigator';
        const uri = vscode.Uri.parse(packageJsonUri);
        const packageDir = Utils.dirname(uri);

        log(`Opening terminal in package directory: ${packageDir.toString()}`);
        const terminal = vscode.window.createTerminal({
          name: terminalName,
          cwd: packageDir,
        });
        terminal.show();
        log('Successfully opened terminal in package directory');
      } catch (error) {
        logError('Failed to open terminal in package directory', error);
        vscode.window.showErrorMessage('Failed to open terminal in package directory');
      }
    }
  );

  // Copy relative path of package.json
  const copyPackageJsonRelativePath = vscode.commands.registerCommand(
    'package-navigator.copyPackageJsonRelativePath',
    async () => {
      log('=================================');
      log('Executing copyPackageJsonRelativePath command');

      const packageJsonUri = await findPackageJson();
      if (!packageJsonUri) {
        logAndShowError('copyPackageJsonRelativePath failed', getDetailedErrorMessage());
        return;
      }

      try {
        const uri = vscode.Uri.parse(packageJsonUri);
        const relativePath = vscode.workspace.asRelativePath(uri);
        await vscode.env.clipboard.writeText(relativePath);
        log(`Copied relative path: ${relativePath}`);
        vscode.window.showInformationMessage(`Copied: ${relativePath}`);
      } catch (error) {
        logError('Failed to copy relative path', error);
        vscode.window.showErrorMessage('Failed to copy relative path');
      }
    }
  );

  // Copy absolute path of package.json
  const copyPackageJsonAbsolutePath = vscode.commands.registerCommand(
    'package-navigator.copyPackageJsonAbsolutePath',
    async () => {
      log('=================================');
      log('Executing copyPackageJsonAbsolutePath command');

      const packageJsonUri = await findPackageJson();
      if (!packageJsonUri) {
        logAndShowError('copyPackageJsonAbsolutePath failed', getDetailedErrorMessage());
        return;
      }

      try {
        const uri = vscode.Uri.parse(packageJsonUri);
        const absolutePath = uri.path;
        await vscode.env.clipboard.writeText(absolutePath);
        log(`Copied absolute path: ${absolutePath}`);
        vscode.window.showInformationMessage(`Copied: ${absolutePath}`);
      } catch (error) {
        logError('Failed to copy absolute path', error);
        vscode.window.showErrorMessage('Failed to copy absolute path');
      }
    }
  );

  // Copy package name
  const copyPackageName = vscode.commands.registerCommand('package-navigator.copyPackageName', async () => {
    log('=================================');
    log('Executing copyPackageName command');

    const packageJsonUri = await findPackageJson();
    if (!packageJsonUri) {
      logAndShowError('copyPackageName failed', getDetailedErrorMessage());
      return;
    }

    try {
      const packageName = await getPackageName(packageJsonUri);
      if (!packageName) {
        const errorMessage = 'Package.json file is missing a "name" field or may be corrupted';
        logAndShowError('copyPackageName failed', `Node.js Package Navigator: ${errorMessage}`);
        return;
      }

      await vscode.env.clipboard.writeText(packageName);
      log(`Copied package name: ${packageName}`);
      vscode.window.showInformationMessage(`Copied: ${packageName}`);
    } catch (error) {
      logError('Failed to copy package name', error);
      vscode.window.showErrorMessage('Failed to copy package name');
    }
  });

  context.subscriptions.push(
    openPackageJson,
    revealPackageJson,
    revealPackageFolder,
    openPackageJsonInTerminal,
    copyPackageJsonRelativePath,
    copyPackageJsonAbsolutePath,
    copyPackageName
  );
}
