"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTextWithSSML = processTextWithSSML;
exports.analyzeText = analyzeText;
// frontend/src/utils/text-analysis/textAnalyzer.ts
const ssmlUtils_1 = require("./ssmlUtils");
const grammarChecker_1 = require("./grammarChecker");
const mathValidator_1 = require("./mathValidator");
const scientificValidator_1 = require("./scientificValidator");
function processTextWithSSML(text, formulas) {
    let result = text;
    // Process in reverse order to preserve positions
    const sortedFormulas = [...formulas].sort((a, b) => b.position.start - a.position.start);
    for (const formula of sortedFormulas) {
        const before = result.substring(0, formula.position.start);
        const after = result.substring(formula.position.end);
        const ssmlFormula = (0, ssmlUtils_1.formatFormulaForSSML)(formula.spoken, !!formula.matrixData);
        result = before + ssmlFormula + after;
    }
    // Add pauses and wrap in SSML
    return (0, ssmlUtils_1.wrapInSSML)((0, ssmlUtils_1.addPauses)(result));
}
async function analyzeText(text) {
    // Run all validations in parallel
    const [grammarIssues, scientificIssues] = await Promise.all([
        (0, grammarChecker_1.checkGrammar)(text),
        (0, scientificValidator_1.checkScientificAccuracy)(text)
    ]);
    // Process math expressions with enhanced detection
    const mathExpressions = (0, mathValidator_1.extractMathExpressions)(text);
    const mathIssues = mathExpressions.map(expr => ({
        ...expr,
        result: (0, mathValidator_1.validateMathExpression)(expr.expression)
    }));
    // Extract all formulas for highlighting
    const formulas = mathExpressions.map(expr => ({
        latex: expr.expression,
        type: expr.type,
        start: expr.start,
        end: expr.end,
        spoken: expr.spoken || ''
    }));
    return {
        grammarIssues,
        mathIssues,
        scientificIssues,
        formulas
    };
}
