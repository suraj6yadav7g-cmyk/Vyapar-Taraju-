/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Safely copy text to the clipboard with fallbacks for iframe/sandbox focus constraints.
 */
export function safeCopyToClipboard(text: string): boolean {
  if (!text) return false;

  // Method 1: Modern Web Clipboard API
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).catch(() => {
        // Ignored; we proceed to execute fallback logic synchronous execution instead
      });
    }
  } catch (err) {
    console.warn('Clipboard API not fully supported or restricted, running fallback copy.', err);
  }

  // Method 2: Fallback textarea selection (Succeeds even inside several iframe & focus-lacking containers)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Position off-screen
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (fallbackError) {
    console.error('All clipboard operations blocked by browser permissions:', fallbackError);
    return false;
  }
}
