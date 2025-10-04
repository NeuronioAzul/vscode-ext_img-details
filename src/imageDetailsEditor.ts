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
        console.log('📂 Opening custom document:', uri.fsPath);
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
        console.log('🔧 Resolving custom editor for:', document.uri.fsPath);
        
        // Set up the webview
        webviewPanel.webview.options = {
            enableScripts: true
        };

        // Get image metadata
        const metadata = await this.getImageMetadata(document.uri);
        console.log('📊 Image metadata:', metadata);

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
                        vscode.window.showInformationMessage(`Copied: ${message.text}`);
                        break;
                }
            },
            undefined,
            this.context.subscriptions
        );
        
        console.log('✅ Custom editor resolved successfully');
    }

    private async getImageMetadata(uri: vscode.Uri): Promise<any> {
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
            console.error('Error getting image dimensions:', error);
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
        }
        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .metadata-panel {
            width: 300px;
            border-left: 1px solid var(--vscode-panel-border);
            padding-left: 20px;
            overflow-y: auto;
        }
        h2 {
            margin-top: 0;
            color: var(--vscode-foreground);
            font-size: 18px;
        }
        .metadata-item {
            margin-bottom: 16px;
        }
        .metadata-label {
            font-weight: bold;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
            margin-bottom: 4px;
        }
        .metadata-value {
            padding: 8px;
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            cursor: pointer;
            word-break: break-all;
            transition: background-color 0.2s;
        }
        .metadata-value:hover {
            background-color: var(--vscode-list-hoverBackground);
        }
        .metadata-value:active {
            background-color: var(--vscode-list-activeSelectionBackground);
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
                <div class="metadata-label">File Name</div>
                <div class="metadata-value" onclick="copyToClipboard('${this.escapeHtml(metadata.fileName)}')">${this.escapeHtml(metadata.fileName)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">Dimensions</div>
                <div class="metadata-value" onclick="copyToClipboard('${metadata.width} x ${metadata.height}')">${metadata.width} x ${metadata.height}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">Format</div>
                <div class="metadata-value" onclick="copyToClipboard('${this.escapeHtml(metadata.format)}')">${this.escapeHtml(metadata.format)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">File Size</div>
                <div class="metadata-value" onclick="copyToClipboard('${this.escapeHtml(metadata.fileSize)}')">${this.escapeHtml(metadata.fileSize)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">Size (Bytes)</div>
                <div class="metadata-value" onclick="copyToClipboard('${metadata.fileSizeBytes}')">${metadata.fileSizeBytes}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">Extension</div>
                <div class="metadata-value" onclick="copyToClipboard('${this.escapeHtml(metadata.extension)}')">${this.escapeHtml(metadata.extension)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">Full Path</div>
                <div class="metadata-value" onclick="copyToClipboard('${this.escapeHtml(metadata.path)}')">${this.escapeHtml(metadata.path)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">Created</div>
                <div class="metadata-value" onclick="copyToClipboard('${this.escapeHtml(metadata.created)}')">${this.escapeHtml(metadata.created)}</div>
            </div>
            
            <div class="metadata-item">
                <div class="metadata-label">Modified</div>
                <div class="metadata-value" onclick="copyToClipboard('${this.escapeHtml(metadata.modified)}')">${this.escapeHtml(metadata.modified)}</div>
            </div>
        </div>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        function copyToClipboard(text) {
            vscode.postMessage({
                command: 'copy',
                text: text
            });
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
