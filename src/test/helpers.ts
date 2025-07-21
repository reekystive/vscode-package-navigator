import * as path from 'node:path';
import * as vscode from 'vscode';

// Helper function to get absolute path to test fixtures
export function getFixturePath(relativePath: string): string {
  // Use process.cwd() to get the project root and then navigate to src/test/fixtures
  return path.join(process.cwd(), 'src', 'test', 'fixtures', relativePath);
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
