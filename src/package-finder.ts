import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { log, logError } from './logger.js';

export async function findPackageJson(filePath?: string): Promise<string | null> {
  const activeEditor = vscode.window.activeTextEditor;

  // If filePath is provided (for tests), use it; otherwise use active editor
  const fileUri = filePath ? vscode.Uri.file(filePath) : activeEditor?.document.uri;

  if (!fileUri) {
    log('No file URI available for package.json search');
    return null;
  }

  log(`findPackageJson called for: ${fileUri.toString()}`);

  // Use VS Code's built-in API to get workspace folder
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
  log(
    `workspaceFolder: ${workspaceFolder ? workspaceFolder.name + ' (' + workspaceFolder.uri.toString() + ')' : 'null'}`
  );

  if (!workspaceFolder) {
    log('File is not in any workspace folder');
    return null;
  }

  // Start searching from the file's directory
  let currentUri = Utils.dirname(fileUri);
  log(`Starting search from: ${currentUri.toString()}`);
  log(`Workspace root: ${workspaceFolder.uri.toString()}`);

  let searchCount = 0;
  while (currentUri.path.startsWith(workspaceFolder.uri.path)) {
    searchCount++;
    const packageJsonUri = Utils.joinPath(currentUri, 'package.json');
    log(`Search ${searchCount}: Checking ${packageJsonUri.toString()}`);

    try {
      await vscode.workspace.fs.stat(packageJsonUri);
      const result = packageJsonUri.toString();
      log(`Found package.json: ${result}`);
      return result;
    } catch {
      log(`Not found at ${packageJsonUri.toString()}`);
    }

    const parentUri = Utils.dirname(currentUri);
    if (parentUri.path === currentUri.path) {
      log('Reached root directory, stopping search');
      break;
    }
    currentUri = parentUri;

    // Safety check
    if (searchCount > 20) {
      logError('Too many search iterations, stopping to prevent infinite loop');
      break;
    }
  }

  log('No package.json found in workspace');
  return null;
}

export async function getPackageName(packageJsonUri: string): Promise<string | null> {
  log(`getPackageName called with: ${packageJsonUri}`);

  try {
    const uri = vscode.Uri.parse(packageJsonUri);
    log(`Reading package.json from: ${uri.toString()}`);

    const content = await vscode.workspace.fs.readFile(uri);
    const contentString = new TextDecoder().decode(content);

    const packageJson = JSON.parse(contentString) as { name?: string };
    log(`Parsed package name: ${packageJson.name ?? 'null'}`);

    return packageJson.name ?? null;
  } catch (error) {
    logError('Failed to read package.json', error);
    return null;
  }
}
