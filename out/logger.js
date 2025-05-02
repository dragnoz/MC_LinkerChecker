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
exports.initializeOutputChannel = initializeOutputChannel;
exports.logInfo = logInfo;
exports.logWarn = logWarn;
exports.logError = logError;
exports.showOutputChannel = showOutputChannel;
exports.disposeOutputChannel = disposeOutputChannel;
// Manages the dedicated output channel for the extension
const vscode = __importStar(require("vscode"));
let outputChannel;
function initializeOutputChannel() {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel("Minecraft Resource Toolkit");
        logInfo("Output channel initialized.");
    }
}
function logInfo(message) {
    if (outputChannel) {
        const timestamp = new Date().toLocaleTimeString();
        outputChannel.appendLine(`[INFO ${timestamp}] ${message}`);
    }
    else {
        // Fallback to console if channel not ready (shouldn't happen after activation)
        console.log(`[MRT INFO] ${message}`);
    }
}
function logWarn(message) {
    if (outputChannel) {
        const timestamp = new Date().toLocaleTimeString();
        outputChannel.appendLine(`[WARN ${timestamp}] ${message}`);
    }
    else {
        console.warn(`[MRT WARN] ${message}`);
    }
}
function logError(message, error) {
    if (outputChannel) {
        const timestamp = new Date().toLocaleTimeString();
        outputChannel.appendLine(`[ERROR ${timestamp}] ${message}`);
        if (error) {
            if (error instanceof Error) {
                outputChannel.appendLine(error.stack || error.message);
            }
            else {
                outputChannel.appendLine(String(error));
            }
        }
    }
    else {
        console.error(`[MRT ERROR] ${message}`, error);
    }
}
function showOutputChannel() {
    outputChannel?.show(true); // true preserves focus
}
function disposeOutputChannel() {
    if (outputChannel) {
        logInfo("Disposing output channel.");
        outputChannel.dispose();
        outputChannel = undefined;
    }
}
//# sourceMappingURL=logger.js.map