import * as vscode from 'vscode';
import { SnippetRepository } from './snippetRepository';
import { ScoreboardTracker } from './scoreboardTracker';
import { SnippetTreeDataProvider } from './providers/snippetTreeDataProvider';
import { ScoreboardTreeDataProvider } from './providers/scoreboardTreeDataProvider';
import { LinkedFilesViewProvider } from './linker/linkedFilesViewProvider';
import { TelegramService } from './telegram/telegramService';

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

  // Initialize Telegram service
  const telegramService = new TelegramService();
  const telegramNotConfiguredMsg =
    'Telegram is not configured. Set mrt.telegram.botToken and mrt.telegram.chatId in settings.';

  // Optional: commands (clean and minimal)
  context.subscriptions.push(
    vscode.commands.registerCommand('minecraftDevToolkit.refreshSnippets', () => {
      snippetTreeProvider.refresh();
      vscode.window.showInformationMessage('Snippet repository refreshed');
    }),
    vscode.commands.registerCommand('mrt.telegram.testConnection', async () => {
      if (!telegramService.isConfigured()) {
        vscode.window.showWarningMessage(telegramNotConfiguredMsg);
        return;
      }
      try {
        await telegramService.sendMessage('MineNoz: Telegram connection test successful!');
        vscode.window.showInformationMessage('Telegram test message sent successfully.');
      } catch (err: any) {
        vscode.window.showErrorMessage(`Telegram test failed: ${err.message}`);
      }
    }),
    vscode.commands.registerCommand('mrt.telegram.sendMessage', async () => {
      if (!telegramService.isConfigured()) {
        vscode.window.showWarningMessage(telegramNotConfiguredMsg);
        return;
      }
      const text = await vscode.window.showInputBox({
        prompt: 'Enter the message to send via Telegram',
        placeHolder: 'Your message here...'
      });
      if (!text) {
        return;
      }
      try {
        await telegramService.sendMessage(text);
        vscode.window.showInformationMessage('Message sent via Telegram.');
      } catch (err: any) {
        vscode.window.showErrorMessage(`Failed to send Telegram message: ${err.message}`);
      }
    })
  );
}

export function deactivate() {
  // cleanup if needed
}
