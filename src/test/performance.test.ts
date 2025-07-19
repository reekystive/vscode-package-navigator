import * as assert from 'assert';
import * as vscode from 'vscode';
import { findPackageJson } from '../package-finder.js';
import { createMockWorkspaceFolder, getFixturePath } from './helpers.js';

suite('Performance Tests', () => {
  test('should complete package.json search within reasonable time', async () => {
    const testFilePath = getFixturePath('monorepo/packages/ui/src/component.txt');
    const workspaceUri = vscode.Uri.file(getFixturePath('monorepo'));
    const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

    vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('monorepo', workspaceUri);

    try {
      const startTime = Date.now();
      await findPackageJson(testFilePath);
      const endTime = Date.now();

      // Should complete within 100ms
      const duration = endTime - startTime;
      assert.ok(duration < 100, `Search took ${duration}ms, should be under 100ms`);
    } finally {
      vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
    }
  });

  test('should handle multiple concurrent searches', async () => {
    const testFiles = [
      getFixturePath('simple-project/src/index.txt'),
      getFixturePath('monorepo/packages/ui/src/component.txt'),
      getFixturePath('monorepo/packages/utils/src/helpers.txt'),
    ];

    const workspaceUri = vscode.Uri.file(getFixturePath('monorepo'));
    const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

    vscode.workspace.getWorkspaceFolder = (uri) => {
      if (uri.fsPath.includes('simple-project')) {
        return createMockWorkspaceFolder('simple-project', vscode.Uri.file(getFixturePath('simple-project')));
      }
      return createMockWorkspaceFolder('monorepo', workspaceUri);
    };

    try {
      const startTime = Date.now();
      const promises = testFiles.map((filePath) => findPackageJson(filePath));
      const results = await Promise.all(promises);
      const endTime = Date.now();

      // All searches should complete
      results.forEach((result: string | null) => {
        assert.ok(result !== null);
      });

      // Should complete within 200ms
      const duration = endTime - startTime;
      assert.ok(duration < 200, `Concurrent searches took ${duration}ms, should be under 200ms`);
    } finally {
      vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
    }
  });
});
