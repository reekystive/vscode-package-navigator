import * as assert from 'assert';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { findPackageJson, getDetailedErrorMessage, getPackageName } from '../extension.js';

// Helper function to get absolute path to test fixtures
function getFixturePath(relativePath: string): string {
  return path.join(__dirname, 'fixtures', relativePath);
}

// Helper function to create a mock TextEditor
function createMockTextEditor(filePath: string): vscode.TextEditor {
  const uri = vscode.Uri.file(filePath);
  return {
    document: {
      fileName: filePath,
      uri: uri,
    },
  } as vscode.TextEditor;
}

// Helper function to create a mock workspace folder
function createMockWorkspaceFolder(name: string, uri: vscode.Uri): vscode.WorkspaceFolder {
  return {
    name: name,
    uri: uri,
    index: 0,
  };
}

suite('Node.js Package Navigator Extension Test Suite', () => {
  vscode.window.showInformationMessage('Starting Node.js Package Navigator tests...');

  suite('findPackageJson Function', () => {
    test('should find package.json in simple project', async () => {
      const testFilePath = getFixturePath('simple-project/src/index.txt');
      const expectedPackageJson = getFixturePath('simple-project/package.json');

      // Mock workspace folder
      const workspaceUri = vscode.Uri.file(getFixturePath('simple-project'));
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('simple-project', workspaceUri);

      try {
        const result = await findPackageJson(testFilePath);
        assert.strictEqual(result, expectedPackageJson);
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should find package.json in nested component file', async () => {
      const testFilePath = getFixturePath('simple-project/src/components/component.txt');
      const expectedPackageJson = getFixturePath('simple-project/package.json');

      const workspaceUri = vscode.Uri.file(getFixturePath('simple-project'));
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('simple-project', workspaceUri);

      try {
        const result = await findPackageJson(testFilePath);
        assert.strictEqual(result, expectedPackageJson);
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should find nearest package.json in monorepo', async () => {
      const testFilePath = getFixturePath('monorepo/packages/ui/src/component.txt');
      const expectedPackageJson = getFixturePath('monorepo/packages/ui/package.json');

      const workspaceUri = vscode.Uri.file(getFixturePath('monorepo'));
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('monorepo', workspaceUri);

      try {
        const result = await findPackageJson(testFilePath);
        assert.strictEqual(result, expectedPackageJson);
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should find nearest package.json in monorepo utils package', async () => {
      const testFilePath = getFixturePath('monorepo/packages/utils/src/helpers.txt');
      const expectedPackageJson = getFixturePath('monorepo/packages/utils/package.json');

      const workspaceUri = vscode.Uri.file(getFixturePath('monorepo'));
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('monorepo', workspaceUri);

      try {
        const result = await findPackageJson(testFilePath);
        assert.strictEqual(result, expectedPackageJson);
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should return null when file is not in workspace', async () => {
      const testFilePath = getFixturePath('no-package-json/src/orphan.txt');
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => undefined;

      try {
        const result = await findPackageJson(testFilePath);
        assert.strictEqual(result, null);
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should return null when no package.json exists in workspace', async () => {
      const testFilePath = getFixturePath('no-package-json/src/orphan.txt');
      const workspaceUri = vscode.Uri.file(getFixturePath('no-package-json'));
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('no-package-json', workspaceUri);

      try {
        const result = await findPackageJson(testFilePath);
        assert.strictEqual(result, null);
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should respect workspace boundaries', async () => {
      // Test that search doesn't go beyond workspace folder
      const testFilePath = getFixturePath('monorepo/packages/ui/src/component.txt');
      // Set workspace to just the ui package folder
      const workspaceUri = vscode.Uri.file(getFixturePath('monorepo/packages/ui'));
      const expectedPackageJson = getFixturePath('monorepo/packages/ui/package.json');
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('ui', workspaceUri);

      try {
        const result = await findPackageJson(testFilePath);
        assert.strictEqual(result, expectedPackageJson);
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });
  });

  suite('getPackageName Function', () => {
    test('should read package name from valid package.json', async () => {
      const packageJsonPath = getFixturePath('simple-project/package.json');
      const result = await getPackageName(packageJsonPath);
      assert.strictEqual(result, 'simple-project');
    });

    test('should read scoped package name from monorepo package', async () => {
      const packageJsonPath = getFixturePath('monorepo/packages/ui/package.json');
      const result = await getPackageName(packageJsonPath);
      assert.strictEqual(result, '@monorepo/ui');
    });

    test('should return null for package.json without name field', async () => {
      const packageJsonPath = getFixturePath('invalid-package-json/package.json');
      const result = await getPackageName(packageJsonPath);
      assert.strictEqual(result, null);
    });

    test('should return null for corrupted package.json', async () => {
      const packageJsonPath = getFixturePath('corrupted-package-json/package.json');
      const result = await getPackageName(packageJsonPath);
      assert.strictEqual(result, null);
    });

    test('should return null for non-existent package.json', async () => {
      const packageJsonPath = getFixturePath('non-existent/package.json');
      const result = await getPackageName(packageJsonPath);
      assert.strictEqual(result, null);
    });
  });

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

  suite('Integration Tests', () => {
    test('should handle complete workflow for simple project', async () => {
      const testFilePath = getFixturePath('simple-project/src/index.txt');
      const workspaceUri = vscode.Uri.file(getFixturePath('simple-project'));
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('simple-project', workspaceUri);

      try {
        // Find package.json
        const packageJsonPath = await findPackageJson(testFilePath);
        assert.ok(packageJsonPath);

        // Get package name
        const packageName = await getPackageName(packageJsonPath);
        assert.strictEqual(packageName, 'simple-project');

        // Verify package.json exists
        const stats = await fs.stat(packageJsonPath);
        assert.ok(stats.isFile());
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should handle complete workflow for monorepo package', async () => {
      const testFilePath = getFixturePath('monorepo/packages/ui/src/component.txt');
      const workspaceUri = vscode.Uri.file(getFixturePath('monorepo'));
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('monorepo', workspaceUri);

      try {
        // Find package.json
        const packageJsonPath = await findPackageJson(testFilePath);
        assert.ok(packageJsonPath);

        // Verify it found the correct package.json (nearest one)
        assert.ok(packageJsonPath.includes('packages/ui/package.json'));

        // Get package name
        const packageName = await getPackageName(packageJsonPath);
        assert.strictEqual(packageName, '@monorepo/ui');
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should handle error cases gracefully', async () => {
      const testFilePath = getFixturePath('no-package-json/src/orphan.txt');
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => undefined;

      try {
        // Should return null for file not in workspace
        const packageJsonPath = await findPackageJson(testFilePath);
        assert.strictEqual(packageJsonPath, null);

        // Should return appropriate error message
        const mockEditor = createMockTextEditor(testFilePath);
        const errorMessage = getDetailedErrorMessage(mockEditor);
        assert.ok(errorMessage.includes('not part of any workspace folder'));
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });
  });

  suite('Edge Cases', () => {
    test('should handle files at workspace root', async () => {
      const testFilePath = getFixturePath('simple-project/package.json');
      const workspaceUri = vscode.Uri.file(getFixturePath('simple-project'));
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('simple-project', workspaceUri);

      try {
        const result = await findPackageJson(testFilePath);
        assert.strictEqual(result, testFilePath);
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should handle deeply nested files', async () => {
      // Create a deeply nested file path
      const testFilePath = getFixturePath('simple-project/src/components/nested/deep/component.txt');
      const workspaceUri = vscode.Uri.file(getFixturePath('simple-project'));
      const expectedPackageJson = getFixturePath('simple-project/package.json');
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('simple-project', workspaceUri);

      try {
        const result = await findPackageJson(testFilePath);
        assert.strictEqual(result, expectedPackageJson);
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should handle empty package.json name field', async () => {
      // Create a package.json with empty name
      const tempPackageJsonPath = getFixturePath('temp-empty-name/package.json');
      const tempDir = path.dirname(tempPackageJsonPath);

      try {
        await fs.mkdir(tempDir, { recursive: true });
        await fs.writeFile(tempPackageJsonPath, JSON.stringify({ name: '', version: '1.0.0' }));

        const result = await getPackageName(tempPackageJsonPath);
        assert.strictEqual(result, null);
      } finally {
        // Clean up
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch {
          // Ignore cleanup errors
        }
      }
    });

    test('should handle package.json with null name field', async () => {
      // Create a package.json with null name
      const tempPackageJsonPath = getFixturePath('temp-null-name/package.json');
      const tempDir = path.dirname(tempPackageJsonPath);

      try {
        await fs.mkdir(tempDir, { recursive: true });
        await fs.writeFile(tempPackageJsonPath, JSON.stringify({ name: null, version: '1.0.0' }));

        const result = await getPackageName(tempPackageJsonPath);
        assert.strictEqual(result, null);
      } finally {
        // Clean up
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch {
          // Ignore cleanup errors
        }
      }
    });
  });

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
});
