import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';

export function getDetailedErrorMessage(activeEditor?: vscode.TextEditor): string {
  const editor = activeEditor ?? vscode.window.activeTextEditor;

  if (!editor) {
    return 'Node.js Package Navigator: No active file is currently open. Please open a file to use package navigation features.';
  }

  const fileUri = editor.document.uri;
  const fileName = Utils.basename(fileUri) || (fileUri.scheme === 'untitled' ? 'untitled' : 'unknown');
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);

  if (!workspaceFolder) {
    return `Node.js Package Navigator: The file "${fileName}" is not part of any workspace folder. Please open the file within a workspace to locate its package.json.`;
  }

  const workspaceName = workspaceFolder.name;
  return `Node.js Package Navigator: No package.json found for "${fileName}" in workspace "${workspaceName}". Make sure your project has a package.json file in the current directory or any parent directory within the workspace.`;
}
