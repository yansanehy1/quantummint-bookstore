import { test, expect } from '@playwright/test';

test.describe('TTS Synthesis Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Mock login
        await page.goto('/login');
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        
        // Wait for redirect to studio or dashboard
        await page.waitForURL('**/studio**');
    });

    test('should allow a creator to synthesize audio for a book chapter', async ({ page }) => {
        // Go to a book editor or studio page where AudioSynthesizer is present
        await page.goto('/studio/book/test-book-id');

        // Mock the TTS API responses
        await page.route('**/api/tts/voices', async route => {
            await route.fulfill({
                status: 200,
                json: [
                    { id: 'alloy', name: 'Alloy', language: 'en' },
                    { id: 'echo', name: 'Echo', language: 'en' }
                ]
            });
        });

        await page.route('**/api/tts/synthesize', async route => {
            await route.fulfill({
                status: 200,
                json: {
                    audioUrl: '/media/tts/test-audio.mp3',
                    durationMs: 5000,
                    words: [
                        { word: 'Hello', startMs: 0, endMs: 500 },
                        { word: 'World', startMs: 500, endMs: 1000 }
                    ]
                }
            });
        });

        // 1. Check if Audio Synthesis section is visible
        await expect(page.getByRole('region', { name: 'Audio Synthesis Controls' })).toBeVisible();

        // 2. Select a voice
        await page.selectOption('#voice-select', 'alloy');

        // 3. Adjust speed
        await page.fill('#speed-range', '1.2');

        // 4. Click Synthesize for a chapter
        const synthesizeBtn = page.getByRole('button', { name: /Synthesize audio for/i }).first();
        await synthesizeBtn.click();

        // 5. Check for "Processing..." state
        await expect(page.getByText('Processing...')).toBeVisible();

        // 6. Check for "Ready" state after synthesis
        await expect(page.getByText('Ready')).toBeVisible();

        // 7. Verify audio element is present and has the correct source
        const audioElement = page.locator('audio').first();
        await expect(audioElement).toHaveAttribute('src', '/media/tts/test-audio.mp3');

        // 8. Test word highlighting during playback
        await audioElement.evaluate((el: HTMLAudioElement) => el.play());
        
        // Wait for the first word to be highlighted
        const highlightedWord = page.locator('.bg-purple-200').first();
        await expect(highlightedWord).toBeVisible();
        await expect(highlightedWord).toHaveText('Hello');
    });

    test('should handle synthesis errors gracefully', async ({ page }) => {
        await page.goto('/studio/book/test-book-id');

        await page.route('**/api/tts/synthesize', async route => {
            await route.fulfill({
                status: 500,
                json: { error: 'Synthesis failed on server' }
            });
        });

        await page.getByRole('button', { name: /Synthesize audio for/i }).first().click();

        // Check for error message in UI
        const errorMessage = page.locator('#tts-error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText('Synthesis failed on server');
    });
});
