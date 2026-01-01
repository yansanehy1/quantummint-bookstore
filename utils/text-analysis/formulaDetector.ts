export const detectFormulas = (text: string) => {
    const formulas = [];
    const inlineRegex = /\$([^$]+)\$/g;
    let match;
    while ((match = inlineRegex.exec(text)) !== null) {
        formulas.push({ content: match[1], type: 'inline', index: match.index });
    }
    return formulas;
};

