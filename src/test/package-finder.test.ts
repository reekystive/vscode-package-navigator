import * as assert from 'assert';
import * as vscode from 'vscode';
import { findPackageJson, getPackageName } from '../package-finder.js';
import { createMockWorkspaceFolder, getFixturePath } from './helpers.js';

suite('Package Finder Tests', () => {
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
        assert.strictEqual(result, vscode.Uri.file(expectedPackageJson).toString());
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
        assert.strictEqual(result, vscode.Uri.file(expectedPackageJson).toString());
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
        assert.strictEqual(result, vscode.Uri.file(expectedPackageJson).toString());
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
        assert.strictEqual(result, vscode.Uri.file(expectedPackageJson).toString());
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
        assert.strictEqual(result, vscode.Uri.file(expectedPackageJson).toString());
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });

    test('should handle files at workspace root', async () => {
      const testFilePath = getFixturePath('simple-project/package.json');
      const workspaceUri = vscode.Uri.file(getFixturePath('simple-project'));
      const originalGetWorkspaceFolder = vscode.workspace.getWorkspaceFolder;

      vscode.workspace.getWorkspaceFolder = () => createMockWorkspaceFolder('simple-project', workspaceUri);

      try {
        const result = await findPackageJson(testFilePath);
        assert.strictEqual(result, vscode.Uri.file(testFilePath).toString());
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
        assert.strictEqual(result, vscode.Uri.file(expectedPackageJson).toString());
      } finally {
        vscode.workspace.getWorkspaceFolder = originalGetWorkspaceFolder;
      }
    });
  });

  suite('getPackageName Function', () => {
    test('should read package name from valid package.json', async () => {
      const packageJsonPath = getFixturePath('simple-project/package.json');
      const result = await getPackageName(vscode.Uri.file(packageJsonPath).toString());
      assert.strictEqual(result, 'simple-project');
    });

    test('should read scoped package name from monorepo package', async () => {
      const packageJsonPath = getFixturePath('monorepo/packages/ui/package.json');
      const result = await getPackageName(vscode.Uri.file(packageJsonPath).toString());
      assert.strictEqual(result, '@monorepo/ui');
    });

    test('should return null for package.json without name field', async () => {
      const packageJsonPath = getFixturePath('invalid-package-json/package.json');
      const result = await getPackageName(vscode.Uri.file(packageJsonPath).toString());
      assert.strictEqual(result, null);
    });

    test('should return null for corrupted package.json', async () => {
      const packageJsonPath = getFixturePath('corrupted-package-json/package.json');
      const result = await getPackageName(vscode.Uri.file(packageJsonPath).toString());
      assert.strictEqual(result, null);
    });

    test('should return null for non-existent package.json', async () => {
      const packageJsonPath = getFixturePath('non-existent/package.json');
      const result = await getPackageName(vscode.Uri.file(packageJsonPath).toString());
      assert.strictEqual(result, null);
    });
  });
});
