<<<<<<< HEAD
// Formula detector for LaTeX expressions
export interface Formula {
    content: string;
    type: 'inline' | 'display';
    start: number;
    end: number;
}

export function detectFormulas(text: string): Formula[] {
    const formulas: Formula[] = [];

    // Detect inline formulas: $...$
    const inlineRegex = /\$([^$]+)\$/g;
    let match;
    while ((match = inlineRegex.exec(text)) !== null) {
        formulas.push({
            content: match[1],
            type: 'inline',
            start: match.index,
            end: match.index + match[0].length
        });
    }

    // Detect display formulas: $$...$$
    const displayRegex = /\$\$([^$]+)\$\$/g;
    while ((match = displayRegex.exec(text)) !== null) {
        formulas.push({
            content: match[1],
            type: 'display',
            start: match.index,
            end: match.index + match[0].length
        });
    }

    return formulas;
}

export function extractFormulas(text: string): Formula[] {
    return detectFormulas(text);
}
=======
export const detectFormulas = (text: string) => {
    const formulas = [];
    const inlineRegex = /\$([^$]+)\$/g;
    let match;
    while ((match = inlineRegex.exec(text)) !== null) {
        formulas.push({ content: match[1], type: 'inline', index: match.index });
    }
    return formulas;
};
>>>>>>> eee79d7da06a64aee98daa05ffcfbc5ba43db233
