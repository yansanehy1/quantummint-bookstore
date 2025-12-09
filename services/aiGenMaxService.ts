/**
 * AiGenMax API Integration
 * Service for generating images and videos using AiGenMax.art
 */

export interface AiGenMaxConfig {
    baseUrl: string;
}

const config: AiGenMaxConfig = {
    baseUrl: 'https://aigenmax.art'
};

/**
 * Generate an image using AiGenMax
 * Opens AiGenMax in a new window for user to generate images
 */
export async function generateImageWithAiGenMax(prompt: string): Promise<string> {
    // Open AiGenMax image generator in a new window
    const width = 1200;
    const height = 800;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    const windowFeatures = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

    // Open AiGenMax in a new window
    const generatorWindow = window.open(
        `${config.baseUrl}`,
        'AiGenMax Image Generator',
        windowFeatures
    );

    if (!generatorWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
    }

    // Return a promise that resolves when user provides the image
    return new Promise((resolve, reject) => {
        // For now, we'll return a placeholder
        // In production, you'd implement a callback mechanism
        console.log('AiGenMax opened. User can generate image with prompt:', prompt);

        // Simulate user generating and providing URL
        setTimeout(() => {
            // This would be replaced with actual image URL from AiGenMax
            resolve('https://picsum.photos/800/600');
        }, 1000);
    });
}

/**
 * Generate a video using AiGenMax
 */
export async function generateVideoWithAiGenMax(prompt: string, imageUrl?: string): Promise<string> {
    const width = 1200;
    const height = 800;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    const windowFeatures = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

    const generatorWindow = window.open(
        `${config.baseUrl}`,
        'AiGenMax Video Generator',
        windowFeatures
    );

    if (!generatorWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
    }

    console.log('AiGenMax opened for video generation with prompt:', prompt);

    return new Promise((resolve) => {
        // Placeholder - would be replaced with actual integration
        setTimeout(() => {
            resolve('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
        }, 1000);
    });
}

/**
 * Open AiGenMax in a modal/iframe for embedded generation
 */
export function openAiGenMaxEmbed(tool: 'image' | 'video' | 'logo' | 'thumbnail' = 'image'): void {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Create iframe container
    const container = document.createElement('div');
    container.style.cssText = `
        width: 95%;
        height: 95%;
        max-width: 1400px;
        max-height: 900px;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
    `;

    // Create header with close button
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 16px 24px;
        background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    header.innerHTML = `
        <h2 style="margin: 0; font-size: 18px; font-weight: 600;">
            🎨 AiGenMax - AI ${tool.charAt(0).toUpperCase() + tool.slice(1)} Generator
        </h2>
        <button id="closeAiGenMax" style="
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        ">✕ Close</button>
    `;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = config.baseUrl;
    iframe.style.cssText = `
        width: 100%;
        flex: 1;
        border: none;
    `;
    iframe.allow = 'clipboard-write';

    // Assemble modal
    container.appendChild(header);
    container.appendChild(iframe);
    modal.appendChild(container);
    document.body.appendChild(modal);

    // Close button handler
    document.getElementById('closeAiGenMax')?.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Close on Escape key
    const escHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}
