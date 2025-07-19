import * as assert from 'assert';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { findPackageJson, getPackageName } from '../package-finder.js';
import { createMockWorkspaceFolder, getFixturePath } from './helpers.js';

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
      const stats = await fs.stat(vscode.Uri.parse(packageJsonPath).fsPath);
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

      const result = await getPackageName(vscode.Uri.file(tempPackageJsonPath).toString());
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

      const result = await getPackageName(vscode.Uri.file(tempPackageJsonPath).toString());
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
