import * as assert from 'assert';
import * as vscode from 'vscode';
import { getDetailedErrorMessage } from '../error-messages.js';
import { createMockTextEditor, createMockWorkspaceFolder, getFixturePath } from './helpers.js';

suite('Error Messages Tests', () => {
  suite('getDetailedErrorMessage Function', () => {
    test('should return appropriate message for undefined activeEditor', () => {
      const result = getDetailedErrorMessage(undefined);
      assert.strictEqual(
        result,
        'Node.js Package Navigator: No active file is currently open. Please open a file to use package navigation features.'
      );
    });

    test('should return appropriate message for file not in workspace', () => {
      const testFilePath = getFixturePath('no-package-json/src/orphan.txt');
      const mockEditor = createMockTextEditor(testFilePath);

      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;
      vscode.workspace.getWorkspaceFolder = () => undefined;

      try {
        const result = getDetailedErrorMessage(mockEditor);
        assert.strictEqual(
          result,
          'Node.js Package Navigator: The file "orphan.txt" is not part of any workspace folder. Please open the file within a workspace to locate its package.json.'
        );
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should return appropriate message for file in workspace without package.json', () => {
      const testFilePath = getFixturePath('no-package-json/src/orphan.txt');
      const mockEditor = createMockTextEditor(testFilePath);
      const workspaceUri = vscode.Uri.file(getFixturePath('no-package-json'));

      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;
      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('no-package-json', workspaceUri);

      try {
        const result = getDetailedErrorMessage(mockEditor);
        assert.strictEqual(
          result,
          'Node.js Package Navigator: No package.json found for "orphan.txt" in workspace "no-package-json". Make sure your project has a package.json file in the current directory or any parent directory within the workspace.'
        );
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should handle different file names correctly', () => {
      const testFilePath = getFixturePath('simple-project/src/components/component.txt');
      const mockEditor = createMockTextEditor(testFilePath);
      const workspaceUri = vscode.Uri.file(getFixturePath('simple-project'));

      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;
      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('simple-project', workspaceUri);

      try {
        const result = getDetailedErrorMessage(mockEditor);
        assert.strictEqual(
          result,
          'Node.js Package Navigator: No package.json found for "component.txt" in workspace "simple-project". Make sure your project has a package.json file in the current directory or any parent directory within the workspace.'
        );
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });
  });
});
