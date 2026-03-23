// Simple formula detection using $$...$$ or \[...\] or inline \( ... \)
const mathPattern = /(\$\$[\s\S]+?\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\))/g;
export function buildSSML({ text, language, speed, pitch }) {
    const prosody = `<prosody rate="${Math.round(speed * 100)}%" pitch="${pitch}st">`;
    let ssmlBody = '';
    let lastIndex = 0;
    const matches = [...text.matchAll(mathPattern)];
    if (matches.length === 0) {
        ssmlBody = `${prosody}${escapeXml(text)}</prosody>`;
    }
    else {
        for (const match of matches) {
            const start = match.index;
            const end = start + match[0].length;
            // Non-math segment
            ssmlBody += `${prosody}${escapeXml(text.slice(lastIndex, start))}</prosody>`;
            // Math segment: slow down + announce
            const formula = match[0];
            ssmlBody += `<break time="300ms"/>` +
                `<emphasis level="moderate">Formula:</emphasis>` +
                `<prosody rate="85%" pitch="${pitch}st">${escapeXml(stripDelimiters(formula))}</prosody>` +
                `<break time="200ms"/>`;
            lastIndex = end;
        }
        // Remaining text
        ssmlBody += `${prosody}${escapeXml(text.slice(lastIndex))}</prosody>`;
    }
    return `<speak xml:lang="${language}">${ssmlBody}</speak>`;
}
function stripDelimiters(s) {
    return s
        .replace(/^\$\$|\$\$$/g, '')
        .replace(/^\\\[|\\\]$/g, '')
        .replace(/^\\\(|\\\)$/g, '')
        .trim();
}
function escapeXml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
