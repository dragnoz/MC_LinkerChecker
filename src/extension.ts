import * as vscode from 'vscode';
import { SnippetRepository } from './snippetRepository';
import { ScoreboardTracker } from './scoreboardTracker';
import { SnippetTreeDataProvider } from './providers/snippetTreeDataProvider';
import { ScoreboardTreeDataProvider } from './providers/scoreboardTreeDataProvider';
import { LinkedFilesViewProvider } from './linker/linkedFilesViewProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('Activating Minecraft Development Toolkit extension');

  // Initialize repositories
  const snippetRepository = new SnippetRepository(context);
  const scoreboardTracker = new ScoreboardTracker(context);

  // Initialize tree view providers
  const snippetTreeProvider = new SnippetTreeDataProvider(snippetRepository);
  const scoreboardTreeProvider = new ScoreboardTreeDataProvider(scoreboardTracker);

  // Register tree views
  vscode.window.registerTreeDataProvider('mcSnippets', snippetTreeProvider);
  vscode.window.registerTreeDataProvider('mcScoreboard', scoreboardTreeProvider);
  vscode.window.registerTreeDataProvider('linkedFilesView', new LinkedFilesViewProvider(context));

  // Optional: commands (clean and minimal)
  context.subscriptions.push(
    vscode.commands.registerCommand('minecraftDevToolkit.refreshSnippets', () => {
      snippetTreeProvider.refresh();
      vscode.window.showInformationMessage('Snippet repository refreshed');
    })
  );
}

export function deactivate() {
  // cleanup if needed
}
