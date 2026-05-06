// Simple formula detection using $$...$$ or \[...\] or inline \( ... \)
const mathPattern = /(\$\$[\s\S]+?\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\))/g;
export function buildSSML({ text, language, speed, pitch }) {
    let ssmlBody = '';
    let lastIndex = 0;
    const matches = [...text.matchAll(mathPattern)];
    const prosodyRate = Math.round(speed * 100);
    const prosodyOpen = `rate="${prosodyRate}%" pitch="${pitch}st"`;

    if (matches.length === 0) {
        const spoken = text.replace(/\d+/g, (n) => digitsToWords(n));
        ssmlBody = `<prosody ${prosodyOpen}>${escapeXml(spoken)}</prosody>`;
    }
    else {
        for (const match of matches) {
            const start = match.index;
            const end = start + match[0].length;

            // Non-math segment
            const nonMath = text.slice(lastIndex, start).replace(/\d+/g, (n) => digitsToWords(n));
            ssmlBody += `<prosody ${prosodyOpen}>${escapeXml(nonMath)}</prosody>`;

            // Math segment: convert LaTeX to a readable spoken form.
            const formula = match[0];
            const latex = stripDelimiters(formula);
            const spoken = latexToSpeech(latex);

            ssmlBody += `<break time="250ms"/>` +
                `<emphasis level="moderate">Equation:</emphasis>` +
                `<break time="150ms"/>` +
                `<prosody rate="85%" pitch="${pitch}st">${escapeXml(spoken)}</prosody>` +
                `<break time="200ms"/>`;

            lastIndex = end;
        }

        // Remaining text
        const remaining = text.slice(lastIndex).replace(/\d+/g, (n) => digitsToWords(n));
        ssmlBody += `<prosody ${prosodyOpen}>${escapeXml(remaining)}</prosody>`;
    }
    return `<speak xml:lang="${escapeXml(language)}">${ssmlBody}</speak>`;
}
function stripDelimiters(s) {
    return s
        .replace(/^\$\$|\$\$$/g, '')
        .replace(/^\\\[|\\\]$/g, '')
        .replace(/^\\\(|\\\)$/g, '')
        .trim();
}

function latexToSpeech(input) {
    let s = input;
    s = s.replace(/\s+/g, ' ').trim();
    s = s.replace(/\\(left|right)\s*/g, '');

    for (let i = 0; i < 6; i++) {
        s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1 over $2');
    }
    for (let i = 0; i < 4; i++) {
        s = s.replace(/\\sqrt\{([^{}]+)\}/g, 'square root of $1');
    }

    s = s.replace(/\\cdot/g, ' times ');
    s = s.replace(/\\times/g, ' times ');

    s = s.replace(/\\pm/g, ' plus or minus ');
    s = s.replace(/\\mp/g, ' minus or plus ');

    s = s.replace(/\\leq/g, ' less than or equal to ');
    s = s.replace(/\\geq/g, ' greater than or equal to ');
    s = s.replace(/\\neq/g, ' not equal to ');
    s = s.replace(/\\approx/g, ' approximately ');

    s = s.replace(/[{}]/g, ' ');

    s = s.replace(/\^\s*\{([^{}]+)\}/g, ' to the power of $1 ');
    s = s.replace(/\^\s*([A-Za-z0-9]+)/g, ' to the power of $1 ');
    s = s.replace(/_\s*\{([^{}]+)\}/g, ' sub $1 ');
    s = s.replace(/_\s*([A-Za-z0-9]+)/g, ' sub $1 ');

    const greek = {
        alpha: 'alpha', beta: 'beta', gamma: 'gamma', delta: 'delta', epsilon: 'epsilon',
        theta: 'theta', lambda: 'lambda', mu: 'mu', pi: 'pi', rho: 'rho',
        sigma: 'sigma', tau: 'tau', phi: 'phi', omega: 'omega', kappa: 'kappa', zeta: 'zeta',
        nu: 'nu', xi: 'xi', eta: 'eta', iota: 'iota', upsilon: 'upsilon', psi: 'psi', th: 'theta',
        varepsilon: 'epsilon'
    };

    s = s.replace(/\\([a-zA-Z]+)\b/g, (_, cmd) => {
        const key = String(cmd);
        if (greek[key])
            return greek[key];
        if (key === 'le' || key === 'leq')
            return 'less than or equal to';
        if (key === 'ge' || key === 'geq')
            return 'greater than or equal to';
        if (key === 'neq')
            return 'not equal to';
        if (key === 'cdot')
            return 'times';
        if (key === 'times')
            return 'times';
        if (key === '%')
            return 'percent';
        return key;
    });

    s = s.replace(/\\/g, '');

    s = s.replace(/=/g, ' equals ');
    s = s.replace(/\+/g, ' plus ');
    s = s.replace(/-/g, ' minus ');
    s = s.replace(/\*/g, ' times ');
    s = s.replace(/\//g, ' divided by ');
    s = s.replace(/\./g, ' point ');

    s = s.replace(/\d+/g, (num) => digitsToWords(num));

    s = s.replace(/\s+/g, ' ').trim();
    return s || input;
}

function digitsToWords(digits) {
    const map = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    return digits
        .split('')
        .map((ch) => {
        const idx = parseInt(ch, 10);
        if (Number.isNaN(idx) || idx < 0 || idx > 9)
            return '';
        return map[idx];
    })
        .filter(Boolean)
        .join(' ');
}

function escapeXml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
