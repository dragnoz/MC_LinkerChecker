"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const snippetRepository_1 = require("./snippetRepository");
const scoreboardTracker_1 = require("./scoreboardTracker");
const snippetTreeDataProvider_1 = require("./providers/snippetTreeDataProvider");
const scoreboardTreeDataProvider_1 = require("./providers/scoreboardTreeDataProvider");
const linkedFilesViewProvider_1 = require("./linker/linkedFilesViewProvider");
function activate(context) {
    console.log('Activating Minecraft Development Toolkit extension');
    // Initialize repositories
    const snippetRepository = new snippetRepository_1.SnippetRepository(context);
    const scoreboardTracker = new scoreboardTracker_1.ScoreboardTracker(context);
    // Initialize tree view providers
    const snippetTreeProvider = new snippetTreeDataProvider_1.SnippetTreeDataProvider(snippetRepository);
    const scoreboardTreeProvider = new scoreboardTreeDataProvider_1.ScoreboardTreeDataProvider(scoreboardTracker);
    // Register tree views
    vscode.window.registerTreeDataProvider('mcSnippets', snippetTreeProvider);
    vscode.window.registerTreeDataProvider('mcScoreboard', scoreboardTreeProvider);
    vscode.window.registerTreeDataProvider('linkedFilesView', new linkedFilesViewProvider_1.LinkedFilesViewProvider(context));
    // Optional: commands (clean and minimal)
    context.subscriptions.push(vscode.commands.registerCommand('minecraftDevToolkit.refreshSnippets', () => {
        snippetTreeProvider.refresh();
        vscode.window.showInformationMessage('Snippet repository refreshed');
    }));
}
function deactivate() {
    // cleanup if needed
}
//# sourceMappingURL=extension.js.map