// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as vscode from 'vscode';

async function findPackageJson(filePath: string): Promise<string | null> {
  let currentDir = path.dirname(filePath);

  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonAbsolutePath = path.join(currentDir, 'package.json');
    try {
      await fs.access(packageJsonAbsolutePath);
      return packageJsonAbsolutePath;
    } catch {
      // File doesn't exist, continue searching
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

async function getPackageName(packageJsonAbsolutePath: string): Promise<string | null> {
  try {
    const content = await fs.readFile(packageJsonAbsolutePath, 'utf8');
    const packageJson = JSON.parse(content) as { name?: string };
    return packageJson.name ?? null;
  } catch {
    return null;
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "package-navigator" is now active!');

  // Open package.json of active file
  const openPackageJson = vscode.commands.registerCommand('package-navigator.openPackageJson', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage('No active file');
      return;
    }

    const packageJsonAbsolutePath = await findPackageJson(activeEditor.document.fileName);
    if (!packageJsonAbsolutePath) {
      vscode.window.showErrorMessage('No package.json found');
      return;
    }

    const document = await vscode.workspace.openTextDocument(packageJsonAbsolutePath);
    await vscode.window.showTextDocument(document);
  });

  // Reveal package.json of active file in explorer
  const revealPackageJson = vscode.commands.registerCommand('package-navigator.revealPackageJson', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage('No active file');
      return;
    }

    const packageJsonAbsolutePath = await findPackageJson(activeEditor.document.fileName);
    if (!packageJsonAbsolutePath) {
      vscode.window.showErrorMessage('No package.json found');
      return;
    }

    await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(packageJsonAbsolutePath));
  });

  // Open package.json of active file in integrated terminal
  const openPackageJsonInTerminal = vscode.commands.registerCommand(
    'package-navigator.openPackageJsonInTerminal',
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage('No active file');
        return;
      }

      const packageJsonAbsolutePath = await findPackageJson(activeEditor.document.fileName);
      if (!packageJsonAbsolutePath) {
        vscode.window.showErrorMessage('No package.json found');
        return;
      }

      const packageName = await getPackageName(packageJsonAbsolutePath);
      const terminalName = packageName || 'Package Navigator';
      const packageDir = path.dirname(packageJsonAbsolutePath);

      const terminal = vscode.window.createTerminal({
        name: terminalName,
        cwd: packageDir,
      });
      terminal.show();
    }
  );

  // Copy relative path of active file's package.json
  const copyPackageJsonRelativePath = vscode.commands.registerCommand(
    'package-navigator.copyPackageJsonRelativePath',
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage('No active file');
        return;
      }

      const packageJsonAbsolutePath = await findPackageJson(activeEditor.document.fileName);
      if (!packageJsonAbsolutePath) {
        vscode.window.showErrorMessage('No package.json found');
        return;
      }

      const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(packageJsonAbsolutePath));
      if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
      }

      const packageJsonRelativePath = path.relative(workspaceFolder.uri.fsPath, packageJsonAbsolutePath);
      await vscode.env.clipboard.writeText(packageJsonRelativePath);
      vscode.window.showInformationMessage(`Copied: ${packageJsonRelativePath}`);
    }
  );

  // Copy absolute path of active file's package.json
  const copyPackageJsonAbsolutePath = vscode.commands.registerCommand(
    'package-navigator.copyPackageJsonAbsolutePath',
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage('No active file');
        return;
      }

      const packageJsonAbsolutePath = await findPackageJson(activeEditor.document.fileName);
      if (!packageJsonAbsolutePath) {
        vscode.window.showErrorMessage('No package.json found');
        return;
      }

      await vscode.env.clipboard.writeText(packageJsonAbsolutePath);
      vscode.window.showInformationMessage(`Copied: ${packageJsonAbsolutePath}`);
    }
  );

  // Copy package name of active file
  const copyPackageName = vscode.commands.registerCommand('package-navigator.copyPackageName', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage('No active file');
      return;
    }

    const packageJsonAbsolutePath = await findPackageJson(activeEditor.document.fileName);
    if (!packageJsonAbsolutePath) {
      vscode.window.showErrorMessage('No package.json found');
      return;
    }

    const packageName = await getPackageName(packageJsonAbsolutePath);
    if (!packageName) {
      vscode.window.showErrorMessage('No package name found');
      return;
    }

    await vscode.env.clipboard.writeText(packageName);
    vscode.window.showInformationMessage(`Copied: ${packageName}`);
  });

  context.subscriptions.push(
    openPackageJson,
    revealPackageJson,
    openPackageJsonInTerminal,
    copyPackageJsonRelativePath,
    copyPackageJsonAbsolutePath,
    copyPackageName
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  // do nothing
}
