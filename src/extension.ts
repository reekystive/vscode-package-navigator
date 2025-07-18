// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as vscode from 'vscode';

export async function findPackageJson(filePath: string): Promise<string | null> {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));

  if (!workspaceFolder) {
    // File is not in any workspace folder, return null
    return null;
  }

  // Search within the workspace folder boundary
  const workspaceRoot = workspaceFolder.uri.fsPath;
  let currentDir = path.dirname(filePath);

  while (currentDir.startsWith(workspaceRoot)) {
    const packageJsonAbsolutePath = path.join(currentDir, 'package.json');
    try {
      await fs.access(packageJsonAbsolutePath);
      return packageJsonAbsolutePath;
    } catch {
      // File doesn't exist, continue searching upward
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    } // Reached root directory
    currentDir = parentDir;
  }

  return null;
}

export async function getPackageName(packageJsonAbsolutePath: string): Promise<string | null> {
  try {
    const content = await fs.readFile(packageJsonAbsolutePath, 'utf8');
    const packageJson = JSON.parse(content) as { name?: string };
    return packageJson.name ?? null;
  } catch {
    return null;
  }
}

export function getDetailedErrorMessage(activeEditor: vscode.TextEditor | undefined): string {
  if (!activeEditor) {
    return 'Package Navigator: No active file is currently open. Please open a file to use package navigation features.';
  }

  const fileName = path.basename(activeEditor.document.fileName);
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);

  if (!workspaceFolder) {
    return `Package Navigator: The file "${fileName}" is not part of any workspace folder. Please open the file within a workspace to locate its package.json.`;
  }

  const workspaceName = workspaceFolder.name;
  return `Package Navigator: No package.json found for "${fileName}" in workspace "${workspaceName}". Make sure your project has a package.json file in the current directory or any parent directory within the workspace.`;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "package-navigator" is now active!');

  // Open package.json
  const openPackageJson = vscode.commands.registerCommand('package-navigator.openPackageJson', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage(getDetailedErrorMessage(activeEditor));
      return;
    }

    const packageJsonAbsolutePath = await findPackageJson(activeEditor.document.fileName);
    if (!packageJsonAbsolutePath) {
      vscode.window.showErrorMessage(getDetailedErrorMessage(activeEditor));
      return;
    }

    const document = await vscode.workspace.openTextDocument(packageJsonAbsolutePath);
    await vscode.window.showTextDocument(document);
  });

  // Reveal package.json in explorer
  const revealPackageJson = vscode.commands.registerCommand('package-navigator.revealPackageJson', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage(getDetailedErrorMessage(activeEditor));
      return;
    }

    const packageJsonAbsolutePath = await findPackageJson(activeEditor.document.fileName);
    if (!packageJsonAbsolutePath) {
      vscode.window.showErrorMessage(getDetailedErrorMessage(activeEditor));
      return;
    }

    await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(packageJsonAbsolutePath));
  });

  // Reveal package folder in explorer
  const revealPackageFolder = vscode.commands.registerCommand('package-navigator.revealPackageFolder', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage(getDetailedErrorMessage(activeEditor));
      return;
    }

    const packageJsonAbsolutePath = await findPackageJson(activeEditor.document.fileName);
    if (!packageJsonAbsolutePath) {
      vscode.window.showErrorMessage(getDetailedErrorMessage(activeEditor));
      return;
    }

    const packageDir = path.dirname(packageJsonAbsolutePath);
    await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(packageDir));
  });

  // Open package.json in integrated terminal
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
        vscode.window.showErrorMessage(getDetailedErrorMessage(activeEditor));
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

  // Copy relative path of package.json
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
        vscode.window.showErrorMessage(getDetailedErrorMessage(activeEditor));
        return;
      }

      const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(packageJsonAbsolutePath));
      if (!workspaceFolder) {
        vscode.window.showErrorMessage(
          'Package Navigator: Unable to determine workspace folder for the package.json file. This may indicate a workspace configuration issue.'
        );
        return;
      }

      const packageJsonRelativePath = path.relative(workspaceFolder.uri.fsPath, packageJsonAbsolutePath);
      await vscode.env.clipboard.writeText(packageJsonRelativePath);
      vscode.window.showInformationMessage(`Copied: ${packageJsonRelativePath}`);
    }
  );

  // Copy absolute path of package.json
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
        vscode.window.showErrorMessage(getDetailedErrorMessage(activeEditor));
        return;
      }

      await vscode.env.clipboard.writeText(packageJsonAbsolutePath);
      vscode.window.showInformationMessage(`Copied: ${packageJsonAbsolutePath}`);
    }
  );

  // Copy package name
  const copyPackageName = vscode.commands.registerCommand('package-navigator.copyPackageName', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage(getDetailedErrorMessage(activeEditor));
      return;
    }

    const packageJsonAbsolutePath = await findPackageJson(activeEditor.document.fileName);
    if (!packageJsonAbsolutePath) {
      vscode.window.showErrorMessage(getDetailedErrorMessage(activeEditor));
      return;
    }

    const packageName = await getPackageName(packageJsonAbsolutePath);
    if (!packageName) {
      const fileName = path.basename(activeEditor.document.fileName);
      const packageJsonName = path.basename(packageJsonAbsolutePath);
      vscode.window.showErrorMessage(
        `Package Navigator: No package name found in ${packageJsonName} for "${fileName}". The package.json file may be missing a "name" field or may be corrupted.`
      );
      return;
    }

    await vscode.env.clipboard.writeText(packageName);
    vscode.window.showInformationMessage(`Copied: ${packageName}`);
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

// This method is called when your extension is deactivated
export function deactivate() {
  // do nothing
}
