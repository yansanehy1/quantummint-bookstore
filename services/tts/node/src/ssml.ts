type SSMLParams = { text: string; language: string; speed: number; pitch: number };

const mathPattern = /(\$\$[\s\S]+?\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\))/g;

export function buildSSML({ text, language, speed, pitch }: SSMLParams) {
    let ssml = `<speak xml:lang="${escapeXml(language)}">`;
    let last = 0;

    for (const m of text.matchAll(mathPattern)) {
        const start = m.index!;
        const end = start + m[0].length;

        // Non-math segment
        const nonMath = text.slice(last, start).replace(/\d+/g, (n) => digitsToWords(n));
        ssml += `<prosody rate="${Math.round(speed * 100)}%" pitch="${pitch}st">${escapeXml(
            nonMath
        )}</prosody>`;

        // Math segment: convert LaTeX to a readable spoken form first.
        const latex = stripDelimiters(m[0]);
        const spoken = latexToSpeech(latex);
        ssml += `<break time="250ms"/>` +
            `<emphasis level="moderate">Equation:</emphasis>` +
            `<break time="150ms"/>` +
            `<prosody rate="85%" pitch="${pitch}st">${escapeXml(spoken)}</prosody>` +
            `<break time="200ms"/>`;

        last = end;
    }

    // Remaining text
    const remaining = text.slice(last).replace(/\d+/g, (n) => digitsToWords(n));
    ssml += `<prosody rate="${Math.round(speed * 100)}%" pitch="${pitch}st">${escapeXml(remaining)}</prosody></speak>`;
    return ssml;
}

function stripDelimiters(s: string) {
    return s.replace(/^\$\$|\$\$$/g, '').replace(/^\\\[|\\\]$/g, '').replace(/^\\\(|\\\)$/g, '').trim();
}

function latexToSpeech(input: string) {
    // Convert common LaTeX constructs to a more speech-friendly form.
    // This string will later be passed through ssmlToPhonemeSequence() which strips tags
    // and splits on spaces; so we want lots of spaces and plain words/digits.
    let s = input;

    // Normalize whitespace
    s = s.replace(/\s+/g, ' ').trim();

    // Remove common wrappers
    s = s.replace(/\\(left|right)\s*/g, '');

    // frac -> "a over b"
    // Do a few passes for simple nested cases.
    for (let i = 0; i < 6; i++) {
        s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1 over $2');
    }

    // sqrt -> "square root of x"
    for (let i = 0; i < 4; i++) {
        s = s.replace(/\\sqrt\{([^{}]+)\}/g, 'square root of $1');
    }

    // dot/multiply
    s = s.replace(/\\cdot/g, ' times ');
    s = s.replace(/\\times/g, ' times ');

    // plus/minus
    s = s.replace(/\\pm/g, ' plus or minus ');
    s = s.replace(/\\mp/g, ' minus or plus ');

    // comparison operators
    s = s.replace(/\\leq/g, ' less than or equal to ');
    s = s.replace(/\\geq/g, ' greater than or equal to ');
    s = s.replace(/\\neq/g, ' not equal to ');
    s = s.replace(/\\approx/g, ' approximately ');

    // Remove braces (they don't help speech)
    s = s.replace(/[{}]/g, ' ');

    // Exponents / subscripts (x^2, x^{10}, x_1, x_{i})
    s = s.replace(/\^\s*\{([^{}]+)\}/g, ' to the power of $1 ');
    s = s.replace(/\^\s*([A-Za-z0-9]+)/g, ' to the power of $1 ');
    s = s.replace(/_\s*\{([^{}]+)\}/g, ' sub $1 ');
    s = s.replace(/_\s*([A-Za-z0-9]+)/g, ' sub $1 ');

    // Convert common symbol commands to words
    const greek: Record<string, string> = {
        alpha: 'alpha', beta: 'beta', gamma: 'gamma', delta: 'delta', epsilon: 'epsilon',
        theta: 'theta', lambda: 'lambda', mu: 'mu', pi: 'pi', rho: 'rho',
        sigma: 'sigma', tau: 'tau', phi: 'phi', omega: 'omega', kappa: 'kappa', zeta: 'zeta',
        nu: 'nu', xi: 'xi', eta: 'eta', iota: 'iota', upsilon: 'upsilon', psi: 'psi', th: 'theta',
        // commonly used "epsilon-like" in some sources
        varepsilon: 'epsilon'
    };

    // Replace \command with a word (greek letters get special names).
    s = s.replace(/\\([a-zA-Z]+)\b/g, (_, cmd: string) => {
        const key = String(cmd);
        if (greek[key]) return greek[key];
        if (key === 'le' || key === 'leq') return 'less than or equal to';
        if (key === 'ge' || key === 'geq') return 'greater than or equal to';
        if (key === 'neq') return 'not equal to';
        if (key === 'cdot') return 'times';
        if (key === 'times') return 'times';
        if (key === '%') return 'percent';
        return key;
    });

    // Remove remaining backslashes
    s = s.replace(/\\/g, '');

    // Operators
    s = s.replace(/=/g, ' equals ');
    s = s.replace(/\+/g, ' plus ');
    s = s.replace(/-/g, ' minus ');
    s = s.replace(/\*/g, ' times ');
    s = s.replace(/\//g, ' divided by ');
    s = s.replace(/\./g, ' point ');

    // Digits -> words (so exponent numbers don't disappear)
    s = s.replace(/\d+/g, (num) => digitsToWords(num));

    // Cleanup spacing
    s = s.replace(/\s+/g, ' ').trim();
    return s || input;
}

function digitsToWords(digits: string) {
    const map = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    return digits
        .split('')
        .map((ch) => {
            const idx = parseInt(ch, 10);
            if (Number.isNaN(idx) || idx < 0 || idx > 9) return '';
            return map[idx];
        })
        .filter(Boolean)
        .join(' ');
}

function escapeXml(s: string) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
