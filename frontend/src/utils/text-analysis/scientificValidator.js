"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkScientificAccuracy = checkScientificAccuracy;
// Common scientific inaccuracies
const SCIENTIFIC_RULES = [
    {
        pattern: /\b(centrifugal force)\b/gi,
        message: 'Centrifugal force is a fictitious force that appears in rotating reference frames',
        suggestion: 'centripetal force (if referring to the real force)',
        type: 'physics',
        severity: 'high'
    },
    {
        pattern: /\b(theory)\s+(of\s+)?(evolution|relativity|big bang)\b/gi,
        message: 'In science, a theory is a well-substantiated explanation',
        suggestion: 'scientific theory',
        type: 'terminology',
        severity: 'medium'
    },
    {
        pattern: /\b(electrons?)\s+orbit(ing)?\s+(the )?nucleus\b/gi,
        message: 'Electrons exist in probability clouds (orbitals) rather than fixed orbits',
        type: 'physics',
        severity: 'high'
    }
];
function checkScientificAccuracy(text) {
    const issues = [];
    SCIENTIFIC_RULES.forEach(rule => {
        let match;
        while ((match = rule.pattern.exec(text)) !== null) {
            issues.push({
                type: rule.type,
                message: rule.message,
                start: match.index,
                end: match.index + match[0].length,
                suggestion: rule.suggestion,
                severity: rule.severity
            });
        }
    });
    return issues;
}
