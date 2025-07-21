import * as path from 'node:path';
import * as vscode from 'vscode';

// Helper function to get absolute path to test fixtures
export function getFixturePath(relativePath: string): string {
  // Get the extension's directory from the extension context or fallback to process.cwd()
  // The getFixturePath function uses process.cwd() which returns the current working directory, but in the
  // Windows CI environment, VS Code is running from a different directory (.vscode-test/vscode-win32-x64-archive-1.102.1).
  const extensionPath = vscode.extensions.getExtension('reekystive.package-navigator')?.extensionPath || process.cwd();
  return path.join(extensionPath, 'src', 'test', 'fixtures', relativePath);
}

// Helper function to create a mock TextEditor
export function createMockTextEditor(filePath: string): vscode.TextEditor {
  const uri = vscode.Uri.file(filePath);
  return {
    document: {
      fileName: filePath,
      uri: uri,
    },
  } as vscode.TextEditor;
}

// Helper function to create a mock workspace folder
export function createMockWorkspaceFolder(name: string, uri: vscode.Uri): vscode.WorkspaceFolder {
  return {
    name: name,
    uri: uri,
    index: 0,
  };
}
