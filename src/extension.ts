import * as vscode from 'vscode';
import { ImageDetailsEditorProvider } from './imageDetailsEditor';

export function activate(context: vscode.ExtensionContext) {
    // Register the custom editor provider
    const provider = new ImageDetailsEditorProvider(context);
    const registration = vscode.window.registerCustomEditorProvider(
        'imageDetails.viewer',
        provider,
        {
            webviewOptions: {
                retainContextWhenHidden: true
            },
            supportsMultipleEditorsPerDocument: false
        }
    );
    
    // Register command to open with Image Details Viewer
    const openWithCommand = vscode.commands.registerCommand('imageDetails.openWith', async (uri: vscode.Uri) => {
        if (uri) {
            await vscode.commands.executeCommand('vscode.openWith', uri, 'imageDetails.viewer');
        }
    });
    
    context.subscriptions.push(registration, openWithCommand);
}

export function deactivate() {}
