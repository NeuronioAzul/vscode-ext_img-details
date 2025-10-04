import * as vscode from 'vscode';
import { ImageDetailsEditorProvider } from './imageDetailsEditor';

export function activate(context: vscode.ExtensionContext) {
    console.log('🎨 Image Details extension is now active');

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
    console.log('✅ Custom editor provider registered successfully');
}

export function deactivate() {}
