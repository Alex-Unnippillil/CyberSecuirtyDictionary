import { test, expect } from '@playwright/test';

// Verifies fallback copy using document.execCommand works when writeText fails.
test('copy fallback works', async ({ page }) => {
  await page.goto('about:blank');
  await page.evaluate(() => {
    // Force writeText to fail
    navigator.clipboard.writeText = () => Promise.reject(new Error('fail'));
    // Capture copied text via overridden execCommand
    (window as any).copied = '';
    document.execCommand = (command: string) => {
      if (command === 'copy') {
        (window as any).copied = document.getSelection()?.toString() || '';
        return true;
      }
      return false;
    };
  });
  const text = 'hello world';
  await page.evaluate(async (t) => {
    async function copyToClipboard(value: string): Promise<void> {
      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (!successful) {
          throw err;
        }
      }
    }
    await copyToClipboard(t);
  }, text);
  const copied = await page.evaluate(() => (window as any).copied);
  expect(copied).toBe(text);
});
