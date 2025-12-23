/**
 * HTML template generators for Image Details webview
 */

import * as vscode from 'vscode';
import { Translations, SectionStates } from "../types";

/**
 * Escape HTML special characters to prevent XSS
 * @param text - Text to escape (string, number, undefined, or null)
 * @returns Escaped HTML string
 */
export function escapeHtml(text: string | number | undefined | null): string {
  if (text === undefined || text === null) {
    return '';
  }
  
  // Convert to string if it's a number or other type
  const str = String(text);
  
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}

/**
 * 🟢 Generate error HTML
 */
export function getErrorHtml(error: any): string {
  // Implementation moved from imageDetailsEditor.ts
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error Loading Image</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .error-container {
            max-width: 600px;
            padding: 30px;
            background-color: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            border-radius: 8px;
        }
        h1 {
            color: var(--vscode-errorForeground);
            margin-top: 0;
            font-size: 24px;
        }
        .error-message {
            margin: 20px 0;
            padding: 15px;
            background-color: var(--vscode-editor-background);
            border-radius: 4px;
            font-family: var(--vscode-editor-font-family);
            word-break: break-word;
        }
        .error-stack {
            margin-top: 20px;
            padding: 15px;
            background-color: var(--vscode-editor-background);
            border-radius: 4px;
            font-family: var(--vscode-editor-font-family);
            font-size: 12px;
            overflow-x: auto;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
        }
        .suggestion {
            margin-top: 20px;
            padding: 15px;
            background-color: var(--vscode-editor-background);
            border-left: 3px solid var(--vscode-focusBorder);
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>⚠️ Error Loading Image Details</h1>
        <div class="error-message">
            <strong>Error:</strong> ${escapeHtml(errorMessage)}
        </div>
        ${
          errorStack
            ? `<details>
            <summary style="cursor: pointer; margin-bottom: 10px;">View Stack Trace</summary>
            <div class="error-stack">${escapeHtml(errorStack)}</div>
        </details>`
            : ""
        }
        <div class="suggestion">
            <strong>Suggestions:</strong>
            <ul>
                <li>Make sure the image file is not corrupted</li>
                <li>Try opening the image with the default VS Code image viewer</li>
                <li>Check the Developer Console for more details (Help → Toggle Developer Tools)</li>
                <li>Report this issue on GitHub if it persists</li>
            </ul>
        </div>
    </div>
</body>
</html>`;
}

/**
 * 🟢 Generate color information section HTML
 */
export function generateColorInfoHtml(
  colorInfo: any,
  t: Translations,
  sectionStates: SectionStates,
  displayMode: string = "accordion"
): string {
  // Implementation moved from imageDetailsEditor.ts
  if (!colorInfo || Object.keys(colorInfo).length === 0) {
    return "";
  }

  const isExpanded =
    sectionStates["color-info"] !== undefined
      ? sectionStates["color-info"]
      : false;
  const expandedClass = isExpanded ? "expanded" : "collapsed";
  const toggleClass = isExpanded ? "" : "collapsed";
  // VS Code Codicon chevron-down (expanded) and chevron-right (collapsed)
  const chevronDown =
    '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"/></svg>';
  const chevronRight =
    '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"/></svg>';
  const toggleIcon = isExpanded ? chevronDown : chevronRight;

  let html = `
        <div class="collapsible-section">
            <div class="section-header" onclick="toggleSection('color-info')">
                <span class="section-title">🎨 ${t.colorInformation}</span>
                <span class="section-toggle ${toggleClass}" id="color-info-toggle">${toggleIcon}</span>
            </div>
            <div class="section-content ${expandedClass}" id="color-info-content">`;

  if (colorInfo.supportsTransparency) {
    html += `
                <div class="metadata-item">
                    <div class="metadata-label">✨ ${
                      t.supportsTransparency
                    }</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
      colorInfo.supportsTransparency
    )}')">${escapeHtml(colorInfo.supportsTransparency)}</div>
                </div>`;
  }

  if (colorInfo.colorDepth) {
    html += `
            <div class="metadata-item">
                <div class="metadata-label">🌈 ${t.colorDepth}</div>
                <div class="metadata-value" title="${
                  t.clickToCopy
                }" onclick="copyToClipboard('${escapeHtml(
      colorInfo.colorDepth
    )}')">${escapeHtml(colorInfo.colorDepth)}</div>
            </div>`;
  }

  if (colorInfo.dpi) {
    html += `
                <div class="metadata-item">
                    <div class="metadata-label">📐 ${t.dpi}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
      colorInfo.dpi
    )}')">${escapeHtml(colorInfo.dpi)}</div>
                </div>`;
  }

  html += `
            </div>
        </div>`;
  return html;
}

/**
 * 🟢 Generate main webview HTML
 */
export function getHtmlForWebview(
  webview: vscode.Webview,
  imageUri: vscode.Uri,
  metadata: any,
  t: Translations,
  sectionStates: SectionStates,
  displayMode: string
): string {
  // Implementation moved from imageDetailsEditor.ts
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
            padding: 0;
            margin: 0;
            overflow: hidden;
            height: 100vh;
        }
        .container {
            display: flex;
            gap: 0;
            height: 100vh;
            position: relative;
        }
        .image-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            background-color: var(--vscode-editor-background);
            overflow: hidden;
        }
        .image-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: auto;
            padding: 20px;
            min-height: 0;
        }
        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
            cursor: zoom-in;
        }
        .image-container img.zoomed {
            cursor: zoom-out;
            max-width: none;
            max-height: none;
        }
        .zoom-controls {
            flex-shrink: 0;
            background-color: var(--vscode-editor-background);
            border-top: 1px solid var(--vscode-panel-border);
            padding: 12px 20px;
            display: flex;
            gap: 4px;
            justify-content: center;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
        }
        .zoom-button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 36px;
        }
        .zoom-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .zoom-button:active {
            transform: scale(0.95);
        }
        .zoom-level {
            display: flex;
            align-items: center;
            padding: 0 8px;
            font-size: 13px;
            color: var(--vscode-foreground);
            min-width: 60px;
            justify-content: center;
        }
        .metadata-panel {
            width: 320px;
            min-width: 250px;
            max-width: 600px;
            border-left: 1px solid var(--vscode-panel-border);
            padding: 20px;
            overflow-y: auto;
            background-color: var(--vscode-sideBar-background);
            position: sticky;
            top: 0;
            right: 0;
            height: 100vh;
            resize: horizontal;
        }
        .resize-handle {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            cursor: ew-resize;
            background-color: transparent;
            transition: background-color 0.2s ease;
        }
        .resize-handle:hover {
            background-color: var(--vscode-focusBorder);
        }
        h2 {
            margin-top: 0;
            color: var(--vscode-sideBarTitle-foreground);
            font-size: 18px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        h3 {
            color: var(--vscode-sideBarTitle-foreground);
            font-size: 14px;
            font-weight: 600;
            margin-top: 16px;
            margin-bottom: 12px;
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
        .copy-feedback.show {
            opacity: 1;
            transform: translateX(0);
        }
        @media (prefers-color-scheme: dark) {
            .image-container img {
                box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
            }
        }
        
        /* Thumbnail styles */
        .thumbnail-container {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--vscode-widget-border);
        }
        .thumbnail-container .metadata-label {
            margin-bottom: 8px;
        }
        .thumbnail-preview {
            display: flex;
            justify-content: center;
            padding: 8px;
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
        }
        .thumbnail-image {
            max-width: 120px;
            max-height: 120px;
            object-fit: contain;
            border-radius: 2px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .thumbnail-image:hover {
            transform: scale(1.05);
        }
        .remove-exif-button {
            width: 100%;
            margin-top: 8px;
            padding: 8px 12px;
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: 1px solid var(--vscode-button-border);
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .remove-exif-button:hover {
            background-color: var(--vscode-button-hoverBackground);
            color: var(--vscode-button-foreground);
        }
        .remove-exif-button:active {
            transform: scale(0.98);
        }
        .remove-exif-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .resize-button {
            width: 100%;
            margin-top: 8px;
            padding: 8px 12px;
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: 1px solid var(--vscode-button-border);
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .resize-button:hover {
            background-color: var(--vscode-button-hoverBackground);
            color: var(--vscode-button-foreground);
        }
        .resize-button:active {
            transform: scale(0.98);
        }
        .resize-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Resize Modal styles */
        .resize-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            pointer-events: none;
        }
        
        .resize-modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease-in-out;
            pointer-events: auto;
        }
        
        .resize-modal-content {
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 6px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
            pointer-events: auto;
        }
        
        .resize-modal-header {
            padding: 20px;
            border-bottom: 1px solid var(--vscode-panel-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .resize-modal-header h2 {
            margin: 0;
            font-size: 18px;
        }
        
        .resize-modal-close {
            background: none;
            border: none;
            color: var(--vscode-foreground);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .resize-modal-close:hover {
            background-color: var(--vscode-toolbar-hoverBackground);
        }
        
        .resize-modal-body {
            padding: 20px;
        }
        
        .resize-form-group {
            margin-bottom: 20px;
        }
        
        .resize-form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--vscode-foreground);
        }
        
        .resize-form-group input[type="number"] {
            width: 100%;
            padding: 8px 12px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        .resize-form-group input[type="number"]:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }
        
        .resize-checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .resize-checkbox-group input[type="checkbox"] {
            margin-right: 8px;
            cursor: pointer;
        }
        
        .resize-checkbox-group label {
            cursor: pointer;
            margin: 0;
        }
        
        .resize-info {
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 3px solid var(--vscode-focusBorder);
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        
        .resize-info p {
            margin: 5px 0;
            font-size: 13px;
        }
        
        .resize-slider-group {
            margin-bottom: 20px;
        }
        
        .resize-slider {
            width: 100%;
            margin-top: 8px;
        }
        
        .resize-modal-footer {
            padding: 20px;
            border-top: 1px solid var(--vscode-panel-border);
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        .resize-apply-button,
        .resize-cancel-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
        }
        
        .resize-apply-button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        
        .resize-apply-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        
        .resize-apply-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .resize-cancel-button {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .resize-cancel-button:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        
        /* View JSON button styles */
        .view-json-button {
            width: 100%;
            margin-top: 8px;
            padding: 8px 12px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: 1px solid var(--vscode-button-border);
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .view-json-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .view-json-button:active {
            transform: scale(0.98);
        }
        
        /* JSON Modal styles */
        .json-modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
        }
        .json-modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .json-modal-content {
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        .json-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        .json-modal-header h2 {
            margin: 0;
            font-size: 16px;
            color: var(--vscode-foreground);
        }
        .json-modal-close {
            background: none;
            border: none;
            color: var(--vscode-foreground);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }
        .json-modal-close:hover {
            background-color: var(--vscode-toolbar-hoverBackground);
        }
        .json-modal-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }
        .json-modal-body pre {
            margin: 0;
            padding: 12px;
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            font-family: var(--vscode-editor-font-family);
            font-size: 12px;
            line-height: 1.6;
            overflow-x: auto;
            color: var(--vscode-editor-foreground);
        }
        .json-modal-footer {
            padding: 16px 20px;
            border-top: 1px solid var(--vscode-panel-border);
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        .json-copy-button,
        .json-close-button {
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .json-copy-button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: 1px solid var(--vscode-button-border);
        }
        .json-copy-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .json-close-button {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: 1px solid var(--vscode-button-border);
        }
        .json-close-button:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        
        /* Support section styles */
        .support-section {
            margin: 24px 0;
            padding: 16px;
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 8px;
            text-align: center;
        }
        .support-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--vscode-foreground);
            margin-bottom: 12px;
        }
        .support-buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        .support-link {
            display: inline-block;
            text-decoration: none;
            transition: transform 0.2s ease;
        }
        .support-link:hover {
            transform: scale(1.05);
        }
        .support-button-img {
            height: 45px;
            width: auto;
            border-radius: 4px;
        }
        .support-text {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            font-style: italic;
        }
        
        /* Collapsible sections styles */
        .collapsible-section {
            margin: 20px 0;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .collapsible-section.collapsed {
            border-bottom: 1px solid var(--vscode-widget-border);
        }
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background-color: var(--vscode-editor-background);
            border-bottom: 1px solid var(--vscode-widget-border);
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }
        .section-header:hover {
            background-color: var(--vscode-list-hoverBackground);
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .section-title {
            font-weight: 600;
            font-size: 14px;
            color: var(--vscode-foreground);
        }
        .section-toggle {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center;
        }
        .section-toggle.collapsed {
            
        }
        .section-content {
            padding: 0;
            background-color: var(--vscode-editor-background);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            opacity: 1;
        }
        .section-content.expanded {
            max-height: 10000px;
            opacity: 1;
            padding: 8px 0;
        }
        .section-content.collapsed {
            max-height: 0;
            opacity: 0;
            padding: 0;
        }
        .section-content .metadata-item {
            margin: 0 16px 12px 16px;
            transform: translateY(0);
            transition: all 0.3s ease;
        }
        .section-content.collapsed .metadata-item {
            transform: translateY(-10px);
            opacity: 0;
        }
        .section-content h3 {
            margin: 16px 16px 12px 16px;
        }
        
        /* List mode styles */
        .list-mode .collapsible-section {
            border: none;
            margin: 0;
            border-radius: 0;
        }
        .list-mode .section-header {
            display: none;
        }
        .list-mode .section-content {
            max-height: none !important;
            opacity: 1 !important;
            padding: 0 !important;
            background-color: transparent;
        }
        .list-mode .section-content .metadata-item {
            transform: none !important;
            opacity: 1 !important;
            margin: 0 0 16px 0;
        }
        .list-mode .section-content h3 {
            margin: 20px 0 12px 0;
        }
        
        /* Display mode toggle */
        .display-mode-toggle {
            margin-bottom: 20px;
            padding: 12px;
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .display-mode-toggle label {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-right: 8px;
        }
        .mode-button {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: 1px solid var(--vscode-button-border);
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s ease;
        }
        .mode-button.active {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .mode-button:hover:not(.active) {
            background-color: var(--vscode-button-hoverBackground);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="image-container" id="imageContainer">
            <div class="image-wrapper">
                <img src="${imageWebviewUri}" alt="Image Preview" id="imagePreview" />
            </div>
            <div class="zoom-controls">
                <button class="zoom-button" onclick="zoomOut()" title="Zoom Out (Ctrl + -)">−</button>
                <div class="zoom-level" id="zoomLevel">100%</div>
                <button class="zoom-button" onclick="zoomIn()" title="Zoom In (Ctrl + +)">+</button>
                <button class="zoom-button" onclick="resetZoom()" title="Reset Zoom (Ctrl + 0)">⟲</button>
                <button class="zoom-button" onclick="fitToScreen()" title="Fit to Screen">⊡</button>
            </div>
        </div>
        <div class="metadata-panel" id="metadataPanel">
            <div class="resize-handle" id="resizeHandle"></div>
            <h2>${t.imageDetails}</h2>
            
            <!-- Display Mode Toggle -->
            <div class="display-mode-toggle">
                <label>${t.sectionSettings}:</label>
                <button class="mode-button ${
                  displayMode === "accordion" ? "active" : ""
                }" onclick="setDisplayMode('accordion')">${
    t.accordionMode
  }</button>
                <button class="mode-button ${
                  displayMode === "list" ? "active" : ""
                }" onclick="setDisplayMode('list')">${t.listMode}</button>
            </div>
            
            <!-- Thumbnail Preview -->
            <div class="thumbnail-container">
                <div class="metadata-label">🖼️ ${t.thumbnail}</div>
                <div class="thumbnail-preview">
                    <img src="${imageWebviewUri}" alt="Thumbnail" class="thumbnail-image">
                </div>
                ${
                  metadata.exif
                    ? `<button class="remove-exif-button" onclick="removeExifData()" id="removeExifBtn">
                    🗑️ ${t.removeExif}
                </button>`
                    : ""
                }
                <button class="resize-button" onclick="requestResize()" id="resizeBtn">
                    🖼️ ${t.resizeImage}
                </button>
                <button class="view-json-button" onclick="viewJsonMetadata()">
                    📋 ${t.viewJsonMetadata}
                </button>
            </div>
            
            <div class="${displayMode === "list" ? "list-mode" : ""}">
                <!-- Basic Information Section -->
                ${generateBasicInfoSection(
                  metadata,
                  t,
                  sectionStates,
                  displayMode
                )}
                
                ${generateColorInfoHtml(
                  metadata.colorInfo,
                  t,
                  sectionStates,
                  displayMode
                )}
                
                ${
                  metadata.exif
                    ? generateExifHtml(
                        metadata.exif,
                        t,
                        sectionStates,
                        displayMode
                      )
                    : ""
                }
            </div>
            
            <!-- Support Section -->
            <div class="support-section">
                <div class="support-title">💖 Support this Extension</div>
                <div class="support-buttons">
                    <a href="https://www.buymeacoffee.com/neuronioazul" target="_blank" class="support-link">
                        <img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" class="support-button-img" style="height: 30px;" />
                    </a>
                </div>
                <div class="support-text">If you find this extension helpful, <br>consider supporting its development!</div>
            </div>
            
            <p><br><br></p>
        </div>
    </div>
    
    <div class="copy-feedback" id="copyFeedback">
        ✅ ${t.copied}!
    </div>
    
    <!-- JSON Modal -->
    <div class="json-modal" id="jsonModal">
        <div class="json-modal-content">
            <div class="json-modal-header">
                <h2>${t.metadataJson}</h2>
                <button class="json-modal-close" onclick="closeJsonModal()">✕</button>
            </div>
            <div class="json-modal-body">
                <pre id="jsonContent"></pre>
            </div>
            <div class="json-modal-footer">
                <button class="json-copy-button" onclick="copyJsonMetadata()">
                    📋 ${t.copyJson}
                </button>
                <button class="json-close-button" onclick="closeJsonModal()">
                    ${t.closeModal}
                </button>
            </div>
        </div>
    </div>
    
    <!-- Resize Modal -->
    <div class="resize-modal" id="resizeModal">
        <div class="resize-modal-content">
            <div class="resize-modal-header">
                <h2>${t.resizeImageTitle}</h2>
                <button class="resize-modal-close" onclick="closeResizeModal()">✕</button>
            </div>
            <div class="resize-modal-body">
                <div class="resize-form-group">
                    <label for="resizeWidth">${t.width} (px)</label>
                    <input type="number" id="resizeWidth" min="1">
                </div>
                <div class="resize-form-group">
                    <label for="resizeHeight">${t.height} (px)</label>
                    <input type="number" id="resizeHeight" min="1">
                </div>
                <div class="resize-checkbox-group">
                    <input type="checkbox" id="maintainRatio" checked>
                    <label for="maintainRatio">${t.maintainAspectRatio}</label>
                </div>
                <div class="resize-info">
                    <p><strong>${t.currentSize}:</strong> <span id="currentDimensions">-</span></p>
                    <p><strong>${t.newSize}:</strong> <span id="newDimensions">-</span></p>
                </div>
                <div class="resize-slider-group">
                    <label for="qualitySlider">${t.quality}: <span id="qualityValue">80</span>%</label>
                    <input type="range" id="qualitySlider" class="resize-slider" min="1" max="100" value="80">
                </div>
            </div>
            <div class="resize-modal-footer">
                <button class="resize-cancel-button" onclick="closeResizeModal()">
                    ${t.cancel}
                </button>
                <button class="resize-apply-button" onclick="applyResize()" id="applyResizeBtn">
                    ${t.applyResize}
                </button>
            </div>
        </div>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        const copiedText = '${t.copied}';
        
        // Zoom functionality
        let currentZoom = 1;
        const zoomStep = 0.25;
        const minZoom = 0.1;
        const maxZoom = 5;
        
        const imagePreview = document.getElementById('imagePreview');
        const imageContainer = document.getElementById('imageContainer');
        const zoomLevelDisplay = document.getElementById('zoomLevel');
        
        function updateZoom(newZoom) {
            currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
            imagePreview.style.transform = \`scale(\${currentZoom})\`;
            zoomLevelDisplay.textContent = Math.round(currentZoom * 100) + '%';
            
            if (currentZoom !== 1) {
                imagePreview.classList.add('zoomed');
            } else {
                imagePreview.classList.remove('zoomed');
            }
        }
        
        function zoomIn() {
            updateZoom(currentZoom + zoomStep);
        }
        
        function zoomOut() {
            updateZoom(currentZoom - zoomStep);
        }
        
        function resetZoom() {
            updateZoom(1);
        }
        
        function fitToScreen() {
            const imageWrapper = document.querySelector('.image-wrapper');
            const wrapperRect = imageWrapper.getBoundingClientRect();
            const imageRect = imagePreview.getBoundingClientRect();
            
            // Get original image dimensions (without current zoom)
            const originalWidth = imageRect.width / currentZoom;
            const originalHeight = imageRect.height / currentZoom;
            
            // Calculate available space (considering padding)
            const availableWidth = wrapperRect.width - 40;
            const availableHeight = wrapperRect.height - 40;
            
            // Calculate scale to fit
            const scaleX = availableWidth / originalWidth;
            const scaleY = availableHeight / originalHeight;
            
            // Use the smaller scale to ensure image fits completely
            updateZoom(Math.min(scaleX, scaleY, 1));
        }
        
        // Zoom with mouse wheel
        imageContainer.addEventListener('wheel', function(e) {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
                updateZoom(currentZoom + delta);
            }
        });
        
        // Click to toggle zoom
        imagePreview.addEventListener('click', function(e) {
            if (currentZoom === 1) {
                updateZoom(2);
            } else {
                resetZoom();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Don't trigger shortcuts when typing in input fields
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                return;
            }
            
            if ((e.key === '+' || e.key === '=') && e.ctrlKey) {
                e.preventDefault();
                zoomIn();
            } else if ((e.key === '-' || e.key === '_') && e.ctrlKey) {
                e.preventDefault();
                zoomOut();
            } else if (e.key === '0' && e.ctrlKey) {
                e.preventDefault();
                resetZoom();
            }
        });
        
        function copyToClipboard(text) {
            // Visual feedback
            const feedback = document.getElementById('copyFeedback');
            const shortText = text.length > 30 ? text.substring(0, 30) + '...' : text;
            feedback.textContent = '✅ ' + copiedText + ': ' + shortText;
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
        
        // Resize functionality
        const resizeHandle = document.getElementById('resizeHandle');
        const metadataPanel = document.getElementById('metadataPanel');
        let isResizing = false;
        
        resizeHandle.addEventListener('mousedown', function(e) {
            isResizing = true;
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;
            
            const containerWidth = document.querySelector('.container').offsetWidth;
            const newWidth = containerWidth - e.clientX;
            
            if (newWidth >= 250 && newWidth <= 600) {
                metadataPanel.style.width = newWidth + 'px';
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            }
        });

        // Thumbnail click to focus image
        const thumbnailImage = document.querySelector('.thumbnail-image');
        if (thumbnailImage) {
            thumbnailImage.addEventListener('click', function() {
                imageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (currentZoom === 1) {
                    zoomIn();
                }
            });
        }

        // Collapsible sections functionality
        function toggleSection(sectionId) {
            const content = document.getElementById(sectionId + '-content');
            const toggle = document.getElementById(sectionId + '-toggle');
            
            if (content && toggle) {
                const isExpanded = content.classList.contains('expanded');
                
                // VS Code Codicon chevron-down (expanded) and chevron-right (collapsed)
                const chevronDown = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"/></svg>';
                const chevronRight = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"/></svg>';
                
                if (isExpanded) {
                    content.classList.remove('expanded');
                    content.classList.add('collapsed');
                    toggle.classList.add('collapsed');
                    toggle.innerHTML = chevronRight;
                } else {
                    content.classList.remove('collapsed');
                    content.classList.add('expanded');
                    toggle.classList.remove('collapsed');
                    toggle.innerHTML = chevronDown;
                }
                
                // Save state to extension
                vscode.postMessage({
                    command: 'toggleSection',
                    sectionId: sectionId,
                    isExpanded: !isExpanded
                });
            }
        }

        // Display mode functionality
        function setDisplayMode(mode) {
            vscode.postMessage({
                command: 'setDisplayMode',
                mode: mode
            });
        }

        // Remove EXIF data functionality
        function removeExifData() {
            const btn = document.getElementById('removeExifBtn');
            if (btn) {
                btn.disabled = true;
                btn.textContent = '⏳ Processing...';
            }
            
            vscode.postMessage({
                command: 'removeExif'
            });
        }
        
        // View JSON metadata functionality
        function viewJsonMetadata() {
            vscode.postMessage({
                command: 'viewJsonMetadata'
            });
        }
        
        // Close JSON modal
        function closeJsonModal() {
            const modal = document.getElementById('jsonModal');
            if (modal) {
                modal.classList.remove('show');
            }
        }
        
        // Copy JSON metadata
        function copyJsonMetadata() {
            const jsonContent = document.getElementById('jsonContent');
            if (jsonContent) {
                const text = jsonContent.textContent;
                vscode.postMessage({
                    command: 'copy',
                    text: text
                });
                
                // Show feedback
                const feedback = document.getElementById('copyFeedback');
                if (feedback) {
                    feedback.textContent = '✅ JSON ' + copiedText + '!';
                    feedback.classList.add('show');
                    setTimeout(() => {
                        feedback.classList.remove('show');
                    }, 2000);
                }
            }
        }
        
        // Resize modal functionality
        let originalWidth = 0;
        let originalHeight = 0;
        
        function requestResize() {
            // Request current dimensions from extension
            vscode.postMessage({
                command: 'resizeImage'
            });
        }
        
        function openResizeModal() {
            const modal = document.getElementById('resizeModal');
            if (modal) {
                modal.classList.add('show');
                
                // Close modal when clicking on the overlay (outside content)
                modal.onclick = function(event) {
                    if (event.target === modal) {
                        closeResizeModal();
                    }
                };
            }
        }
        
        function closeResizeModal() {
            const modal = document.getElementById('resizeModal');
            if (modal) {
                modal.classList.remove('show');
            }
        }
        
        function updateDimensions() {
            const widthInput = document.getElementById('resizeWidth');
            const heightInput = document.getElementById('resizeHeight');
            const newDimensionsSpan = document.getElementById('newDimensions');
            
            if (widthInput && heightInput && newDimensionsSpan) {
                const width = parseInt(widthInput.value) || 0;
                const height = parseInt(heightInput.value) || 0;
                
                if (width > 0 && height > 0) {
                    newDimensionsSpan.textContent = width + ' x ' + height + ' px';
                } else {
                    newDimensionsSpan.textContent = '-';
                }
            }
        }
        
        function onWidthInput(event) {
            const widthInput = event.target;
            const heightInput = document.getElementById('resizeHeight');
            const maintainRatio = document.getElementById('maintainRatio');
            
            if (maintainRatio && maintainRatio.checked && originalWidth > 0 && heightInput) {
                const newWidth = parseInt(widthInput.value);
                if (!isNaN(newWidth) && newWidth > 0) {
                    const newHeight = Math.round((originalHeight / originalWidth) * newWidth);
                    heightInput.value = String(newHeight);
                }
            }
            updateDimensions();
        }
        
        function onHeightInput(event) {
            const heightInput = event.target;
            const widthInput = document.getElementById('resizeWidth');
            const maintainRatio = document.getElementById('maintainRatio');
            
            if (maintainRatio && maintainRatio.checked && originalHeight > 0 && widthInput) {
                const newHeight = parseInt(heightInput.value);
                if (!isNaN(newHeight) && newHeight > 0) {
                    const newWidth = Math.round((originalWidth / originalHeight) * newHeight);
                    widthInput.value = String(newWidth);
                }
            }
            updateDimensions();
        }
        
        function onRatioChange(event) {
            const maintainRatio = event.target;
            const widthInput = document.getElementById('resizeWidth');
            const heightInput = document.getElementById('resizeHeight');
            
            if (maintainRatio.checked && originalWidth > 0 && widthInput && heightInput) {
                const currentWidth = parseInt(widthInput.value);
                if (!isNaN(currentWidth) && currentWidth > 0) {
                    const newHeight = Math.round((originalHeight / originalWidth) * currentWidth);
                    heightInput.value = String(newHeight);
                }
                updateDimensions();
            }
        }
        
        function applyResize() {
            const widthInput = document.getElementById('resizeWidth');
            const heightInput = document.getElementById('resizeHeight');
            const qualitySlider = document.getElementById('qualitySlider');
            const applyBtn = document.getElementById('applyResizeBtn');
            
            if (!widthInput || !heightInput || !qualitySlider || !applyBtn) {
                return;
            }
            
            const width = parseInt(widthInput.value);
            const height = parseInt(heightInput.value);
            const quality = parseInt(qualitySlider.value);
            
            if (!width || !height || width <= 0 || height <= 0) {
                return;
            }
            
            applyBtn.disabled = true;
            applyBtn.textContent = 'Resizing...';
            
            vscode.postMessage({
                command: 'applyResize',
                width: width,
                height: height,
                quality: quality
            });
        }
        
        // Setup event listeners on DOM load
        document.addEventListener('DOMContentLoaded', function() {
            const widthInput = document.getElementById('resizeWidth');
            const heightInput = document.getElementById('resizeHeight');
            const maintainRatio = document.getElementById('maintainRatio');
            const qualitySlider = document.getElementById('qualitySlider');
            const qualityValue = document.getElementById('qualityValue');
            
            if (widthInput) {
                widthInput.addEventListener('input', onWidthInput);
            }
            
            if (heightInput) {
                heightInput.addEventListener('input', onHeightInput);
            }
            
            if (maintainRatio) {
                maintainRatio.addEventListener('change', onRatioChange);
            }
            
            if (qualitySlider && qualityValue) {
                qualitySlider.addEventListener('input', function() {
                    qualityValue.textContent = this.value;
                });
            }
        });

        // Make functions available globally
        window.toggleSection = toggleSection;
        window.setDisplayMode = setDisplayMode;
        window.removeExifData = removeExifData;
        window.viewJsonMetadata = viewJsonMetadata;
        window.closeJsonModal = closeJsonModal;
        window.copyJsonMetadata = copyJsonMetadata;
        window.requestResize = requestResize;
        window.openResizeModal = openResizeModal;
        window.closeResizeModal = closeResizeModal;
        window.applyResize = applyResize;
        
        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'resetRemoveExifButton':
                    const btn = document.getElementById('removeExifBtn');
                    if (btn) {
                        btn.disabled = false;
                        btn.textContent = '🗑️ ${t.removeExif}';
                    }
                    break;
                case 'showJsonModal':
                    const modal = document.getElementById('jsonModal');
                    const jsonContent = document.getElementById('jsonContent');
                    if (modal && jsonContent && message.metadata) {
                        jsonContent.textContent = JSON.stringify(message.metadata, null, 2);
                        modal.classList.add('show');
                    }
                    break;
                case 'showResizeModal':
                    const widthInput = document.getElementById('resizeWidth');
                    const heightInput = document.getElementById('resizeHeight');
                    const currentDimensionsSpan = document.getElementById('currentDimensions');
                    
                    if (widthInput && heightInput && currentDimensionsSpan && message.width && message.height) {
                        // Store original dimensions
                        originalWidth = message.width;
                        originalHeight = message.height;
                        
                        // Set input values
                        widthInput.value = String(message.width);
                        heightInput.value = String(message.height);
                        
                        // Set current dimensions text
                        currentDimensionsSpan.textContent = message.width + ' x ' + message.height + ' px';
                        
                        // Update dimension display
                        updateDimensions();
                        
                        // Open the modal
                        openResizeModal();
                    }
                    break;
                case 'resetResizeButton':
                    const resizeBtn = document.getElementById('resizeImageBtn');
                    const applyBtn = document.getElementById('applyResizeBtn');
                    if (resizeBtn) {
                        resizeBtn.disabled = false;
                    }
                    if (applyBtn) {
                        applyBtn.disabled = false;
                        applyBtn.textContent = '${t.apply}';
                    }
                    closeResizeModal();
                    break;
            }
        });
        
        // Initialize section states based on saved preferences
        document.addEventListener('DOMContentLoaded', function() {
            // Section states are already set server-side, no need to re-initialize
        });
    </script>
</body>
</html>`;
}

/**
 * 🟢 Generate EXIF data section HTML
 */
export function generateExifHtml(
  exif: any,
  t: Translations,
  sectionStates: SectionStates,
  displayMode: string = "accordion"
): string {
  // Implementation moved from imageDetailsEditor.ts
  const isExpanded =
    sectionStates["exif-data"] !== undefined
      ? sectionStates["exif-data"]
      : false;
  const expandedClass = isExpanded ? "expanded" : "collapsed";
  const toggleClass = isExpanded ? "" : "collapsed";
  // VS Code Codicon chevron-down (expanded) and chevron-right (collapsed)
  const chevronDown =
    '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"/></svg>';
  const chevronRight =
    '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"/></svg>';
  const toggleIcon = isExpanded ? chevronDown : chevronRight;

  let html = `
        <div class="collapsible-section">
            <div class="section-header" onclick="toggleSection('exif-data')">
                <span class="section-title">📷 ${t.exifData}</span>
                <span class="section-toggle ${toggleClass}" id="exif-data-toggle">${toggleIcon}</span>
            </div>
            <div class="section-content ${expandedClass}" id="exif-data-content">`;

  // === IMAGE DESCRIPTION ===
  if (exif.imageDescription) {
    html += `
            <div class="metadata-item">
                <div class="metadata-label">📝 ${t.imageDescription}</div>
                <div class="metadata-value" title="${
                  t.clickToCopy
                }" onclick="copyToClipboard('${escapeHtml(
      exif.imageDescription
    )}')">${escapeHtml(exif.imageDescription)}</div>
            </div>`;
  }

  // === CAMERA INFORMATION ===
  if (exif.cameraMake || exif.cameraModel || exif.ownerName) {
    html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.camera}</h3>`;

    if (exif.cameraMake) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📱 ${t.make}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.cameraMake
      )}')">${escapeHtml(exif.cameraMake)}</div>
                </div>`;
    }

    if (exif.cameraModel) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📸 ${t.model}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.cameraModel
      )}')">${escapeHtml(exif.cameraModel)}</div>
                </div>`;
    }

    if (exif.ownerName) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">👤 ${t.ownerName}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.ownerName
      )}')">${escapeHtml(exif.ownerName)}</div>
                </div>`;
    }
  }

  // === LENS INFORMATION ===
  if (exif.lensMake || exif.lensModel || exif.lensSerialNumber) {
    html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">🔭 ${t.lens}</h3>`;

    if (exif.lensMake) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🏭 ${t.lensMake}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.lensMake
      )}')">${escapeHtml(exif.lensMake)}</div>
                </div>`;
    }

    if (exif.lensModel) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔭 ${t.lensModel}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.lensModel
      )}')">${escapeHtml(exif.lensModel)}</div>
                </div>`;
    }

    if (exif.lensSerialNumber) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔢 ${t.lensSerialNumber}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.lensSerialNumber
      )}')">${escapeHtml(exif.lensSerialNumber)}</div>
                </div>`;
    }
  }

  // === PHOTO SETTINGS ===
  if (
    exif.iso ||
    exif.aperture ||
    exif.apertureValue ||
    exif.maxApertureValue ||
    exif.shutterSpeed ||
    exif.shutterSpeedValue ||
    exif.focalLength ||
    exif.focalLength35mm ||
    exif.exposureProgram ||
    exif.exposureMode ||
    exif.exposureCompensation !== undefined ||
    exif.meteringMode ||
    exif.flash ||
    exif.whiteBalance ||
    exif.componentsConfiguration ||
    exif.userComment
  ) {
    html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.photoSettings}</h3>`;

    if (exif.iso) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔆 ${t.iso}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.iso
      )}')">${escapeHtml(exif.iso)}</div>
                </div>`;
    }

    if (exif.aperture) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔍 ${
                      t.aperture
                    } (F-Number)</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.aperture
      )}')">${escapeHtml(exif.aperture)}</div>
                </div>`;
    }

    if (exif.apertureValue) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔍 ${t.apertureValue}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.apertureValue
      )}')">${escapeHtml(exif.apertureValue)}</div>
                </div>`;
    }

    if (exif.maxApertureValue) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔍 ${t.maxAperture}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.maxApertureValue
      )}')">${escapeHtml(exif.maxApertureValue)}</div>
                </div>`;
    }

    if (exif.shutterSpeed) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">⚡ ${t.shutterSpeed} (${
        t.exposureTime
      })</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.shutterSpeed
      )}')">${escapeHtml(exif.shutterSpeed)}</div>
                </div>`;
    }

    if (exif.shutterSpeedValue) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">⚡ ${t.shutterSpeedValue}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.shutterSpeedValue
      )}')">${escapeHtml(exif.shutterSpeedValue)}</div>
                </div>`;
    }

    if (exif.focalLength) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.focalLength}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.focalLength
      )}')">${escapeHtml(exif.focalLength)}</div>
                </div>`;
    }

    if (exif.focalLength35mm) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.focalLength35mm}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.focalLength35mm
      )}')">${escapeHtml(exif.focalLength35mm)}</div>
                </div>`;
    }

    if (exif.exposureProgram) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📊 ${t.exposureProgram}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.exposureProgram
      )}')">${escapeHtml(exif.exposureProgram)}</div>
                </div>`;
    }

    if (exif.exposureMode) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📊 ${t.exposureMode}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.exposureMode
      )}')">${escapeHtml(exif.exposureMode)}</div>
                </div>`;
    }

    if (exif.exposureCompensation !== undefined) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📊 ${
                      t.exposureCompensation
                    }</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.exposureCompensation
      )}')">${escapeHtml(exif.exposureCompensation)}</div>
                </div>`;
    }

    if (exif.meteringMode) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📏 ${t.meteringMode}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.meteringMode
      )}')">${escapeHtml(exif.meteringMode)}</div>
                </div>`;
    }

    if (exif.flash) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">⚡ ${t.flash}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.flash
      )}')">${escapeHtml(exif.flash)}</div>
                </div>`;
    }

    if (exif.whiteBalance) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">⚖️ ${t.whiteBalance}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.whiteBalance
      )}')">${escapeHtml(exif.whiteBalance)}</div>
                </div>`;
    }

    if (exif.componentsConfiguration) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔧 ${
                      t.componentsConfiguration
                    }</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.componentsConfiguration
      )}')">${escapeHtml(exif.componentsConfiguration)}</div>
                </div>`;
    }

    if (exif.userComment) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">💬 ${t.userComment}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.userComment
      )}')">${escapeHtml(exif.userComment)}</div>
                </div>`;
    }
  }

  // === DATE & TIME INFORMATION ===
  if (exif.dateTaken || exif.createDate || exif.modifyDate) {
    html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.date}</h3>`;

    if (exif.dateTaken) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📅 ${
                      t.dateTaken
                    } (Original)</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.dateTaken
      )}')">${escapeHtml(exif.dateTaken)}</div>
                </div>`;
    }

    if (exif.createDate) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📅 ${t.createDate}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.createDate
      )}')">${escapeHtml(exif.createDate)}</div>
                </div>`;
    }

    if (exif.modifyDate) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📅 ${t.modifyDate}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.modifyDate
      )}')">${escapeHtml(exif.modifyDate)}</div>
                </div>`;
    }
  }

  // === GPS INFORMATION ===
  const hasGPS =
    exif.gpsLatitude ||
    exif.gpsLongitude ||
    exif.gpsAltitude ||
    exif.gpsTimeStamp ||
    exif.gpsDateStamp ||
    exif.gpsSatellites ||
    exif.gpsStatus ||
    exif.gpsMeasureMode ||
    exif.gpsDOP ||
    exif.gpsSpeed !== undefined ||
    exif.gpsTrack !== undefined ||
    exif.gpsImgDirection !== undefined ||
    exif.gpsMapDatum ||
    exif.gpsDestLatitude ||
    exif.gpsDestLongitude ||
    exif.gpsDestBearing !== undefined ||
    exif.gpsDestDistance !== undefined ||
    exif.gpsDifferential ||
    exif.gpsVersionID;

  if (hasGPS) {
    html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.location} (${t.gps})</h3>`;

    if (exif.gpsVersionID) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔖 ${t.gpsVersionId}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsVersionID
      )}')">${escapeHtml(exif.gpsVersionID)}</div>
                </div>`;
    }

    if (exif.gpsLatitude) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🌍 ${t.latitude}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsLatitude
      )}')">${escapeHtml(exif.gpsLatitude)}</div>
                </div>`;
    }

    if (exif.gpsLatitudeRef) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🌍 ${t.latitudeRef}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsLatitudeRef
      )}')">${escapeHtml(exif.gpsLatitudeRef)}</div>
                </div>`;
    }

    if (exif.gpsLongitude) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🌍 ${t.longitude}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsLongitude
      )}')">${escapeHtml(exif.gpsLongitude)}</div>
                </div>`;
    }

    if (exif.gpsLongitudeRef) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🌍 ${t.longitudeRef}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsLongitudeRef
      )}')">${escapeHtml(exif.gpsLongitudeRef)}</div>
                </div>`;
    }

    if (exif.gpsAltitude) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">⛰️ ${t.gpsAltitude}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsAltitude
      )}')">${escapeHtml(exif.gpsAltitude)}</div>
                </div>`;
    }

    if (exif.gpsAltitudeRef) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">⛰️ ${t.altitudeRef}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsAltitudeRef
      )}')">${escapeHtml(exif.gpsAltitudeRef)}</div>
                </div>`;
    }

    if (exif.gpsTimeStamp) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">⏰ ${t.gpsTimeStamp}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsTimeStamp
      )}')">${escapeHtml(exif.gpsTimeStamp)}</div>
                </div>`;
    }

    if (exif.gpsDateStamp) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📅 ${t.gpsDateStamp}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsDateStamp
      )}')">${escapeHtml(exif.gpsDateStamp)}</div>
                </div>`;
    }

    if (exif.gpsSatellites) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🛰️ ${t.gpsSatellites}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsSatellites
      )}')">${escapeHtml(exif.gpsSatellites)}</div>
                </div>`;
    }

    if (exif.gpsStatus) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📡 ${t.gpsStatus}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsStatus
      )}')">${escapeHtml(exif.gpsStatus)}</div>
                </div>`;
    }

    if (exif.gpsMeasureMode) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📐 ${t.gpsMeasureMode}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsMeasureMode
      )}')">${escapeHtml(exif.gpsMeasureMode)}</div>
                </div>`;
    }

    if (exif.gpsDOP) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📊 ${t.gpsDOP}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsDOP
      )}')">${escapeHtml(exif.gpsDOP)}</div>
                </div>`;
    }

    if (exif.gpsSpeed !== undefined) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🚗 ${t.gpsSpeed}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsSpeed
      )}')">${escapeHtml(exif.gpsSpeed)}</div>
                </div>`;
    }

    if (exif.gpsSpeedRef) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🚗 ${t.gpsSpeedRef}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsSpeedRef
      )}')">${escapeHtml(exif.gpsSpeedRef)}</div>
                </div>`;
    }

    if (exif.gpsTrack !== undefined) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🧭 ${t.gpsTrack}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsTrack
      )}')">${escapeHtml(exif.gpsTrack)}</div>
                </div>`;
    }

    if (exif.gpsTrackRef) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🧭 ${t.gpsTrackRef}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsTrackRef
      )}')">${escapeHtml(exif.gpsTrackRef)}</div>
                </div>`;
    }

    if (exif.gpsImgDirection !== undefined) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📷 ${t.gpsImgDirection}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsImgDirection
      )}')">${escapeHtml(exif.gpsImgDirection)}</div>
                </div>`;
    }

    if (exif.gpsImgDirectionRef) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📷 ${t.gpsImgDirectionRef}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsImgDirectionRef
      )}')">${escapeHtml(exif.gpsImgDirectionRef)}</div>
                </div>`;
    }

    if (exif.gpsMapDatum) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🗺️ ${t.gpsMapDatum}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsMapDatum
      )}')">${escapeHtml(exif.gpsMapDatum)}</div>
                </div>`;
    }

    if (exif.gpsDestLatitude) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestLatitude}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsDestLatitude
      )}')">${escapeHtml(exif.gpsDestLatitude)}</div>
                </div>`;
    }

    if (exif.gpsDestLatitudeRef) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestLatitudeRef}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsDestLatitudeRef
      )}')">${escapeHtml(exif.gpsDestLatitudeRef)}</div>
                </div>`;
    }

    if (exif.gpsDestLongitude) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestLongitude}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsDestLongitude
      )}')">${escapeHtml(exif.gpsDestLongitude)}</div>
                </div>`;
    }

    if (exif.gpsDestLongitudeRef) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${
                      t.gpsDestLongitudeRef
                    }</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsDestLongitudeRef
      )}')">${escapeHtml(exif.gpsDestLongitudeRef)}</div>
                </div>`;
    }

    if (exif.gpsDestBearing !== undefined) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestBearing}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsDestBearing
      )}')">${escapeHtml(exif.gpsDestBearing)}</div>
                </div>`;
    }

    if (exif.gpsDestBearingRef) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestBearingRef}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsDestBearingRef
      )}')">${escapeHtml(exif.gpsDestBearingRef)}</div>
                </div>`;
    }

    if (exif.gpsDestDistance !== undefined) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestDistance}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsDestDistance
      )}')">${escapeHtml(exif.gpsDestDistance)}</div>
                </div>`;
    }

    if (exif.gpsDestDistanceRef) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎯 ${t.gpsDestDistanceRef}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsDestDistanceRef
      )}')">${escapeHtml(exif.gpsDestDistanceRef)}</div>
                </div>`;
    }

    if (exif.gpsDifferential) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📊 ${t.gpsDifferential}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.gpsDifferential
      )}')">${escapeHtml(exif.gpsDifferential)}</div>
                </div>`;
    }
  }

  // === IMAGE TECHNICAL INFO ===
  if (
    exif.orientation ||
    exif.colorSpace ||
    exif.software ||
    exif.artist ||
    exif.copyright ||
    exif.compression ||
    exif.yCbCrPositioning ||
    exif.exifVersion ||
    exif.flashpixVersion ||
    exif.interopIndex ||
    exif.interopVersion ||
    exif.xResolution ||
    exif.yResolution ||
    exif.resolutionUnit
  ) {
    html += `<h3 style="font-size: 14px; margin-top: 16px; margin-bottom: 12px; color: var(--vscode-descriptionForeground);">${t.additionalInfo}</h3>`;

    if (exif.compression) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🗜️ Compression</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.compression
      )}')">${escapeHtml(exif.compression)}</div>
                </div>`;
    }

    if (exif.orientation) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔄 ${t.orientation}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.orientation
      )}')">${escapeHtml(exif.orientation)}</div>
                </div>`;
    }

    if (exif.xResolution) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📏 ${t.xResolution}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.xResolution
      )}')">${escapeHtml(exif.xResolution)}</div>
                </div>`;
    }

    if (exif.yResolution) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📏 ${t.yResolution}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.yResolution
      )}')">${escapeHtml(exif.yResolution)}</div>
                </div>`;
    }

    if (exif.resolutionUnit) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">📏 ${t.resolutionUnit}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.resolutionUnit
      )}')">${escapeHtml(exif.resolutionUnit)}</div>
                </div>`;
    }

    if (exif.colorSpace) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎨 ${t.colorSpace}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.colorSpace
      )}')">${escapeHtml(exif.colorSpace)}</div>
                </div>`;
    }

    if (exif.yCbCrPositioning) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎨 ${t.yCbCrPositioning}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.yCbCrPositioning
      )}')">${escapeHtml(exif.yCbCrPositioning)}</div>
                </div>`;
    }

    if (exif.software) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">💻 ${t.software}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.software
      )}')">${escapeHtml(exif.software)}</div>
                </div>`;
    }

    if (exif.artist) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🎨 ${t.artist}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.artist
      )}')">${escapeHtml(exif.artist)}</div>
                </div>`;
    }

    if (exif.copyright) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">©️ ${t.copyright}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.copyright
      )}')">${escapeHtml(exif.copyright)}</div>
                </div>`;
    }

    if (exif.exifVersion) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔖 ${t.exifVersion}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.exifVersion
      )}')">${escapeHtml(exif.exifVersion)}</div>
                </div>`;
    }

    if (exif.flashpixVersion) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔖 ${t.flashpixVersion}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.flashpixVersion
      )}')">${escapeHtml(exif.flashpixVersion)}</div>
                </div>`;
    }

    if (exif.interopIndex) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔗 ${t.interopIndex}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.interopIndex
      )}')">${escapeHtml(exif.interopIndex)}</div>
                </div>`;
    }

    if (exif.interopVersion) {
      html += `
                <div class="metadata-item">
                    <div class="metadata-label">🔗 ${t.interopVersion}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
        exif.interopVersion
      )}')">${escapeHtml(exif.interopVersion)}</div>
                </div>`;
    }
  }

  html += `
            </div>
        </div>`;
  return html;
}

/**
 * 🟢 Generate basic information section HTML
 */
export function generateBasicInfoSection(
  metadata: any,
  t: Translations,
  sectionStates: SectionStates,
  displayMode: string
): string {
  // Implementation moved from imageDetailsEditor.ts
  // (This would contain the full HTML generation logic)
  const isExpanded = sectionStates["basic-info"] !== false; // Default to true if not set
  const expandedClass = isExpanded ? "expanded" : "collapsed";
  const toggleClass = isExpanded ? "" : "collapsed";
  // VS Code Codicon chevron-down (expanded) and chevron-right (collapsed)
  const chevronDown =
    '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"/></svg>';
  const chevronRight =
    '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"/></svg>';
  const toggleIcon = isExpanded ? chevronDown : chevronRight;

  return `
        <div class="collapsible-section">
            <div class="section-header" onclick="toggleSection('basic-info')">
                <span class="section-title">📋 ${t.basicInfo}</span>
                <span class="section-toggle ${toggleClass}" id="basic-info-toggle">${toggleIcon}</span>
            </div>
            <div class="section-content ${expandedClass}" id="basic-info-content">
                <div class="metadata-item">
                    <div class="metadata-label">📁 ${t.fileName}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
    metadata.fileName
  )}')">${escapeHtml(metadata.fileName)}</div>
                </div>
                
                <div class="metadata-item">
                    <div class="metadata-label">📐 ${t.dimensions}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${metadata.width} x ${
    metadata.height
  }')">${metadata.width} x ${metadata.height}</div>
                </div>
                
                <div class="metadata-item">
                    <div class="metadata-label">🎨 ${t.format}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
    metadata.format
  )}')">${escapeHtml(metadata.format)}</div>
                </div>
                
                <div class="metadata-item">
                    <div class="metadata-label">💾 ${t.fileSize}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
    metadata.fileSize
  )}')">${escapeHtml(metadata.fileSize)}</div>
                </div>
                
                <div class="metadata-item">
                    <div class="metadata-label">🔢 ${t.sizeBytes}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${metadata.fileSizeBytes}')">${
    metadata.fileSizeBytes
  }</div>
                </div>
                
                <div class="metadata-item">
                    <div class="metadata-label">🏷️ ${t.extension}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
    metadata.extension
  )}')">${escapeHtml(metadata.extension)}</div>
                </div>
                
                <div class="metadata-item">
                    <div class="metadata-label">📂 ${t.fullPath}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
    metadata.path
  )}')">${escapeHtml(metadata.path)}</div>
                </div>
                
                <div class="metadata-item">
                    <div class="metadata-label">📅 ${t.created}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
    metadata.created
  )}')">${escapeHtml(metadata.created)}</div>
                </div>
                
                <div class="metadata-item">
                    <div class="metadata-label">✏️ ${t.modified}</div>
                    <div class="metadata-value" title="${
                      t.clickToCopy
                    }" onclick="copyToClipboard('${escapeHtml(
    metadata.modified
  )}')">${escapeHtml(metadata.modified)}</div>
                </div>
            </div>
        </div>`;
}
