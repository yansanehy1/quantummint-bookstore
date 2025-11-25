"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGrammar = checkGrammar;
function checkGrammar(text) {
    const issues = [];
    // Tokenize into sentences
    const sentences = text.match(/[^.!?]+[.!?]/g) || [text];
    sentences.forEach((sentence, sentIndex) => {
        const words = sentence.trim().split(/\s+/);
        const sentStart = text.indexOf(sentence);
        // Rule 1: Subject-verb agreement
        for (let i = 0; i < words.length - 1; i++) {
            const subject = words[i].toLowerCase();
            const verb = words[i + 1].toLowerCase();
            if (['he', 'she', 'it'].includes(subject) && !verb.endsWith('s')) {
                issues.push({
                    type: 'subject-verb',
                    message: 'Subject-verb agreement issue: Singular subject may need verb ending in "s"',
                    start: sentStart + sentence.indexOf(verb),
                    end: sentStart + sentence.indexOf(verb) + verb.length,
                    suggestion: verb + 's',
                    severity: 'medium'
                });
            }
        }
        // Rule 2: Missing end punctuation
        if (!/[.!?]$/.test(sentence)) {
            issues.push({
                type: 'punctuation',
                message: 'Missing end punctuation',
                start: sentStart + sentence.length - 1,
                end: sentStart + sentence.length,
                suggestion: sentence + '.',
                severity: 'low'
            });
        }
        // Rule 3: Passive voice detection
        const passiveRegex = /\b(is|was|were|been)\s+(\w+ed|\w+en)\b/gi;
        let match;
        while ((match = passiveRegex.exec(sentence))) {
            const contextWords = sentence
                .split(' ')
                .slice(Math.max(0, match.index - 10), match.index + 10)
                .join(' ');
            issues.push({
                type: 'passive-voice',
                message: 'Passive voice detected. Consider using active voice for clarity.',
                start: sentStart + match.index,
                end: sentStart + match.index + match[0].length,
                suggestion: `Consider: "${contextWords.replace(match[0], `${match[2]} ${match[1]}`)}"`,
                severity: 'medium'
            });
        }
        // Rule 4: Long sentences
        if (words.length > 25) {
            issues.push({
                type: 'readability',
                message: 'Sentence may be too long. Consider breaking it into smaller sentences.',
                start: sentStart,
                end: sentStart + sentence.length,
                severity: 'low'
            });
        }
    });
    return issues;
}
