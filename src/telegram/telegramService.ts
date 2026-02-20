import * as https from 'https';
import * as vscode from 'vscode';

/**
 * Service for sending messages to a Telegram chat via the Telegram Bot API.
 */
export class TelegramService {

    private getBotToken(): string {
        return vscode.workspace.getConfiguration('mrt.telegram').get<string>('botToken', '');
    }

    private getChatId(): string {
        return vscode.workspace.getConfiguration('mrt.telegram').get<string>('chatId', '');
    }

    /**
     * Returns true if both botToken and chatId are configured.
     */
    isConfigured(): boolean {
        return this.getBotToken().length > 0 && this.getChatId().length > 0;
    }

    /**
     * Sends a text message to the configured Telegram chat.
     */
    sendMessage(text: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const botToken = this.getBotToken();
            const chatId = this.getChatId();

            if (!botToken || !chatId) {
                reject(new Error('Telegram bot token or chat ID is not configured.'));
                return;
            }

            const body = JSON.stringify({ chat_id: chatId, text });
            const options: https.RequestOptions = {
                hostname: 'api.telegram.org',
                path: `/bot${botToken}/sendMessage`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 400) {
                        reject(new Error(`Telegram API HTTP error: ${res.statusCode}`));
                        return;
                    }
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.ok) {
                            resolve();
                        } else {
                            reject(new Error(`Telegram API error: ${parsed.description}`));
                        }
                    } catch (parseErr: any) {
                        reject(new Error(`Failed to parse Telegram API response: ${parseErr.message}`));
                    }
                });
            });

            req.on('error', (err) => reject(err));
            req.write(body);
            req.end();
        });
    }
}
