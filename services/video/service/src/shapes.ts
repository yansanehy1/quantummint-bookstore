import { createCanvas, loadImage } from 'canvas';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import fs from 'fs';
import path from 'path';

export async function renderLatexToPng(latex: string, outPath: string, opts: { width: number }) {
    const adaptor = liteAdaptor();
    RegisterHTMLHandler(adaptor);
    const tex = new TeX({ packages: ['base', 'ams'] });
    const svg = new SVG({ fontCache: 'none' });
    const doc = mathjax.document('', { InputJax: tex, OutputJax: svg });

    const node = doc.convert(latex, { display: true });
    const svgStr = adaptor.outerHTML(node);

    // Rasterize SVG onto canvas
    const canvas = createCanvas(opts.width, 200);
    const ctx = canvas.getContext('2d');
    const data = 'data:image/svg+xml;base64,' + Buffer.from(svgStr).toString('base64');
    const img = await loadImage(data);
    const h = Math.min(img.height, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, h);

    const png = canvas.toBuffer('image/png');
    fs.writeFileSync(outPath, png);
}

export async function renderStepFrames(steps: string[], outDir: string, id: string) {
    const files: string[] = [];
    let i = 0;
    for (const step of steps) {
        const canvas = createCanvas(900, 120);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 900, 120);

        // Numbered circle
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(20, 60, 20, 0, Math.PI * 2);
        ctx.fill();

        // Number inside circle
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px sans-serif';
        ctx.fillText(String(i + 1), 14, 66);

        // Step text
        ctx.fillStyle = '#1f2937';
        ctx.font = '28px sans-serif';
        ctx.fillText(step, 60, 70);

        const file = path.join(outDir, `${id}-step-${i}.png`);
        fs.writeFileSync(file, canvas.toBuffer('image/png'));
        files.push(file);
        i++;
    }
    return files;
}
