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
    
    context.subscriptions.push(registration);
}

export function deactivate() {}
