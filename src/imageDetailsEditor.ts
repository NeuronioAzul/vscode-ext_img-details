import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import sizeOf from 'image-size';

export class ImageDetailsEditorProvider implements vscode.CustomReadonlyEditorProvider {
    private static readonly viewType = 'imageDetails.viewer';

    constructor(private readonly context: vscode.ExtensionContext) {}

    async openCustomDocument(
        uri: vscode.Uri,
        openContext: vscode.CustomDocumentOpenContext,
        token: vscode.CancellationToken
    ): Promise<vscode.CustomDocument> {
        return {
            uri,
            dispose: () => {}
        };
    }

    async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        // Set up the webview
        webviewPanel.webview.options = {
            enableScripts: true
        };

        // Get image metadata
        const metadata = await this.getImageMetadata(document.uri);

        // Set the webview HTML content
        webviewPanel.webview.html = this.getHtmlForWebview(
            webviewPanel.webview,
            document.uri,
            metadata
        );

        // Handle messages from the webview
        webviewPanel.webview.onDidReceiveMessage(
            (message: any) => {
                switch (message.command) {
                    case 'copy':
                        vscode.env.clipboard.writeText(message.text);
                        // Visual feedback is handled in the webview
                        break;
                }
            },
            undefined,
            this.context.subscriptions
        );
    }

    private async getImageMetadata(uri: vscode.Uri): Promise<any> {
        try {
            const filePath = uri.fsPath;
            const stats = await fs.promises.stat(filePath);
            
            let dimensions = { width: 'Unknown', height: 'Unknown', type: 'Unknown' };
            
            try {
                const size = sizeOf(filePath);
                dimensions = {
                    width: size.width?.toString() || 'Unknown',
                    height: size.height?.toString() || 'Unknown',
                    type: size.type || 'Unknown'
                };
            } catch (error) {
                // Silently handle error, return unknown dimensions
            }

            return {
                path: filePath,
                fileName: path.basename(filePath),
                fileSize: this.formatFileSize(stats.size),
                fileSizeBytes: stats.size,
                width: dimensions.width,
                height: dimensions.height,
                format: dimensions.type,
                extension: path.extname(filePath),
                created: stats.birthtime.toLocaleString(),
                modified: stats.mtime.toLocaleString()
            };
        } catch (error) {
            // Return minimal metadata if file cannot be read
            return {
                path: uri.fsPath,
                fileName: path.basename(uri.fsPath),
                fileSize: 'Unknown',
                fileSizeBytes: 0,
                width: 'Unknown',
                height: 'Unknown',
                format: 'Unknown',
                extension: path.extname(uri.fsPath),
                created: 'Unknown',
                modified: 'Unknown'
            };
        }
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) {return '0 Bytes';}
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    private getHtmlForWebview(
        webview: vscode.Webview,
        imageUri: vscode.Uri,
        metadata: any
    ): string {
        // Convert the image URI to a webview URI
        const imageWebviewUri = webview.asWebviewUri(imageUri);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Details</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            margin: 0;
        }
        .container {
            display: flex;
            gap: 20px;
            height: 100vh;
        }
        .image-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: auto;
            background-color: var(--vscode-editor-background);
        }
        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .metadata-panel {
            width: 300px;
            border-left: 1px solid var(--vscode-panel-border);
            padding-left: 20px;
            overflow-y: auto;
            background-color: var(--vscode-sideBar-background);
        }
        h2 {
            margin-top: 0;
            color: var(--vscode-sideBarTitle-foreground);
            font-size: 18px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        .metadata-item {
            margin-bottom: 16px;
        }
        .metadata-label {
            font-weight: bold;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .metadata-value {
            padding: 8px 12px;
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            cursor: pointer;
            word-break: break-all;
            transition: all 0.2s ease;
            font-family: var(--vscode-editor-font-family);
            font-size: 13px;
            position: relative;
        }
        .metadata-value:hover {
            background-color: var(--vscode-list-hoverBackground);
            border-color: var(--vscode-focusBorder);
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .metadata-value:active {
            background-color: var(--vscode-list-activeSelectionBackground);
            color: var(--vscode-list-activeSelectionForeground);
            transform: translateY(0);
        }
        .metadata-value::after {
            content: "📋";
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.2s ease;
            font-size: 12px;
        }
        .metadata-value:hover::after {
            opacity: 0.5;
        }
        .metadata-value.copied {
            background-color: var(--vscode-statusBar-foreground) !important;
            color: var(--vscode-statusBar-background) !important;
            transform: scale(1.02);
        }
        .copy-feedback {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--vscode-notifications-background);
            color: var(--vscode-notifications-foreground);
            border: 1px solid var(--vscode-notifications-border);
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        }
        @media (prefers-color-scheme: dark) {
            .image-container img {
                box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="image-container">
            <img src="${imageWebviewUri}" alt="Image Preview" />
        </div>
        <div class="metadata-panel">
            <h2>Image Details</h2>
            
            <div class="metadata-item">
                <div class="metadata-label">📁 File Name</div>
                <div class="metadata-value" title="Click to copy" onclick="copyToClipboard('${this.escapeHtml(metadata.fileName)}')">${this.escapeHtml(metadata.fileName)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">📐 Dimensions</div>
                <div class="metadata-value" title="Click to copy" onclick="copyToClipboard('${metadata.width} x ${metadata.height}')">${metadata.width} x ${metadata.height}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">🎨 Format</div>
                <div class="metadata-value" title="Click to copy" onclick="copyToClipboard('${this.escapeHtml(metadata.format)}')">${this.escapeHtml(metadata.format)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">💾 File Size</div>
                <div class="metadata-value" title="Click to copy" onclick="copyToClipboard('${this.escapeHtml(metadata.fileSize)}')">${this.escapeHtml(metadata.fileSize)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">🔢 Size (Bytes)</div>
                <div class="metadata-value" title="Click to copy" onclick="copyToClipboard('${metadata.fileSizeBytes}')">${metadata.fileSizeBytes}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">🏷️ Extension</div>
                <div class="metadata-value" title="Click to copy" onclick="copyToClipboard('${this.escapeHtml(metadata.extension)}')">${this.escapeHtml(metadata.extension)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">📂 Full Path</div>
                <div class="metadata-value" title="Click to copy" onclick="copyToClipboard('${this.escapeHtml(metadata.path)}')">${this.escapeHtml(metadata.path)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">📅 Created</div>
                <div class="metadata-value" title="Click to copy" onclick="copyToClipboard('${this.escapeHtml(metadata.created)}')">${this.escapeHtml(metadata.created)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">✏️ Modified</div>
                <div class="metadata-value" title="Click to copy" onclick="copyToClipboard('${this.escapeHtml(metadata.modified)}')">${this.escapeHtml(metadata.modified)}</div>
            </div>
        </div>
    </div>
    
    <div class="copy-feedback" id="copyFeedback">
        ✅ Copied to clipboard!
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        function copyToClipboard(text) {
            // Visual feedback
            const feedback = document.getElementById('copyFeedback');
            const shortText = text.length > 30 ? text.substring(0, 30) + '...' : text;
            feedback.textContent = '✅ Copied: ' + shortText;
            feedback.classList.add('show');
            
            // Send to extension
            vscode.postMessage({
                command: 'copy',
                text: text
            });
            
            // Hide feedback after 2 seconds
            setTimeout(() => {
                feedback.classList.remove('show');
            }, 2000);
            
            // Add flash effect to the clicked element
            const clickedElement = event.target;
            clickedElement.classList.add('copied');
            setTimeout(() => {
                clickedElement.classList.remove('copied');
            }, 300);
        }
    </script>
</body>
</html>`;
    }

    private escapeHtml(text: string): string {
        const map: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}
