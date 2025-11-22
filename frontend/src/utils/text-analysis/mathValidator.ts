// frontend/src/utils/text-analysis/mathValidator.ts
import * as math from 'mathjs';
import { detectFormulas } from './formulaDetector';
import { evaluateWithSympy } from '../math/sympyService';
import { validateMatrixEquation } from '../math/matrixOperations';

export interface MathValidationResult {
  isValid: boolean;
  error?: string;
  solution?: any;
  verification?: string;
  spoken?: string;
}

export async function validateMathExpression(expression: string) {
  try {
    const { result, error, latex } = await evaluateWithSympy(expression);

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
  } catch (error) {
    return {
      isValid: false,
      solution: null,
      error: `Failed to evaluate expression: ${(error as Error).message}`
    };
  }
}

export async function validateMath(latex: string): Promise<{
  isValid: boolean;
  solution: any;
  error?: string;
}> {
  try {
    // Try matrix operations first
    if (latex.includes('matrix') || latex.includes('vmatrix') || latex.includes('=')) {
      const matrixResult = validateMatrixEquation(latex);
      if (matrixResult.isValid) {
        return matrixResult;
      }
    }

    // Fall back to regular math validation
    return await validateMathExpression(latex);
  } catch (error) {
    return {
      isValid: false,
      solution: null,
      error: (error as Error).message
    };
  }
}

export function extractMathExpressions(text: string) {
  const formulas = detectFormulas(text);
  return formulas.map(formula => ({
    expression: formula.latex,
    start: formula.position.start,
    end: formula.position.end,
    type: formula.type,
    spoken: formula.spoken
  }));
}