import * as vscode from 'vscode';
import './error-messages.test.js';
import './integration.test.js';
import './package-finder.test.js';
import './performance.test.js';

// Main test suite entry point
suite('Node.js Package Navigator Extension Test Suite', () => {
  vscode.window.showInformationMessage('Starting Node.js Package Navigator tests...');
});
