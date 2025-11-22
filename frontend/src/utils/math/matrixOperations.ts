// frontend/src/utils/math/matrixOperations.ts
import { matrix, Matrix, det, inv, multiply, equal } from 'mathjs';
import { MatrixData } from '../text-analysis/formulaDetector';

export function buildMathjsMatrix(data: MatrixData): Matrix {
  const rows = data.rows.map(row => 
    row.map(cell => {
      if (cell.startsWith('[nested_')) {
        const idx = parseInt(cell.match(/\d+/)?.[0] || '0', 10);
        return buildMathjsMatrix(data.nestedMatrices[idx]);
      }
      try {
        // Try to evaluate if it's a number or simple expression
        return Number(cell) || cell;
      } catch {
        return cell;
      }
    })
  );
  return matrix(rows);
}

export function validateMatrixEquation(latex: string): {
  isValid: boolean;
  solution: any;
  error?: string;
} {
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
      const determinant = det(mat);
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
  } catch (error) {
    return { 
      isValid: false, 
      solution: null, 
      error: (error as Error).message 
    };
  }
}