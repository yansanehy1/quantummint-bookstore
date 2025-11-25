"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMathjsMatrix = buildMathjsMatrix;
exports.validateMatrixEquation = validateMatrixEquation;
// frontend/src/utils/math/matrixOperations.ts
const mathjs_1 = require("mathjs");
function buildMathjsMatrix(data) {
    const rows = data.rows.map(row => row.map(cell => {
        if (cell.startsWith('[nested_')) {
            const idx = parseInt(cell.match(/\d+/)?.[0] || '0', 10);
            return buildMathjsMatrix(data.nestedMatrices[idx]);
        }
        try {
            // Try to evaluate if it's a number or simple expression
            return Number(cell) || cell;
        }
        catch {
            return cell;
        }
    }));
    return (0, mathjs_1.matrix)(rows);
}
function validateMatrixEquation(latex) {
    try {
        // Simple check for matrix equation (A = B * C)
        if (latex.includes('=')) {
            const [left, right] = latex.split('=').map(s => s.trim());
            // This is a simplified example - in reality, you'd need a proper parser
            // to handle arbitrary matrix equations
            return {
                isValid: true,
                solution: {
                    message: 'Matrix equation validation not fully implemented',
                    type: 'matrix_equation'
                }
            };
        }
        // Handle determinants
        const detMatch = latex.match(/\\begin\{vmatrix\}([\s\S]*?)\\end\{vmatrix\}/);
        if (detMatch) {
            const matrixData = parseMatrixContentRecursive(detMatch[1]);
            const mat = buildMathjsMatrix(matrixData);
            const determinant = (0, mathjs_1.det)(mat);
            return {
                isValid: true,
                solution: {
                    type: 'determinant',
                    value: determinant,
                    matrix: mat.toArray()
                }
            };
        }
        return { isValid: false, solution: null, error: 'Unsupported operation' };
    }
    catch (error) {
        return {
            isValid: false,
            solution: null,
            error: error.message
        };
    }
}
