"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMathExpression = validateMathExpression;
exports.validateMath = validateMath;
exports.extractMathExpressions = extractMathExpressions;
const formulaDetector_1 = require("./formulaDetector");
const sympyService_1 = require("../math/sympyService");
const matrixOperations_1 = require("../math/matrixOperations");
async function validateMathExpression(expression) {
    try {
        const { result, error, latex } = await (0, sympyService_1.evaluateWithSympy)(expression);
        if (error) {
            return {
                isValid: false,
                solution: null,
                error: `SymPy evaluation error: ${error}`
            };
        }
        return {
            isValid: true,
            solution: {
                value: result,
                latex: latex || expression,
                type: 'symbolic'
            }
        };
    }
    catch (error) {
        return {
            isValid: false,
            solution: null,
            error: `Failed to evaluate expression: ${error.message}`
        };
    }
}
async function validateMath(latex) {
    try {
        // Try matrix operations first
        if (latex.includes('matrix') || latex.includes('vmatrix') || latex.includes('=')) {
            const matrixResult = (0, matrixOperations_1.validateMatrixEquation)(latex);
            if (matrixResult.isValid) {
                return matrixResult;
            }
        }
        // Fall back to regular math validation
        return await validateMathExpression(latex);
    }
    catch (error) {
        return {
            isValid: false,
            solution: null,
            error: error.message
        };
    }
}
function extractMathExpressions(text) {
    const formulas = (0, formulaDetector_1.detectFormulas)(text);
    return formulas.map(formula => ({
        expression: formula.latex,
        start: formula.position.start,
        end: formula.position.end,
        type: formula.type,
        spoken: formula.spoken
    }));
}
