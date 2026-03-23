type SSMLParams = { text: string; language: string; speed: number; pitch: number };

const mathPattern = /(\$\$[\s\S]+?\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\))/g;

export function buildSSML({ text, language, speed, pitch }: SSMLParams) {
    let ssml = `<speak xml:lang="${language}">`;
    let last = 0;
    for (const m of text.matchAll(mathPattern)) {
        const start = m.index!;
        const end = start + m[0].length;
        ssml += `<prosody rate="${Math.round(speed * 100)}%" pitch="${pitch}st">${escapeXml(text.slice(last, start))}</prosody>`;
        const latex = stripDelimiters(m[0]);
        ssml += `<break time="250ms"/><emphasis level="moderate">Formula:</emphasis><prosody rate="85%">${escapeXml(latex)}</prosody><break time="200ms"/>`;
        last = end;
    }
    ssml += `<prosody rate="${Math.round(speed * 100)}%" pitch="${pitch}st">${escapeXml(text.slice(last))}</prosody></speak>`;
    return ssml;
}

function stripDelimiters(s: string) {
    return s.replace(/^\$\$|\$\$$/g, '').replace(/^\\\[|\\\]$/g, '').replace(/^\\\(|\\\)$/g, '').trim();
}

function escapeXml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
