// frontend/src/utils/__tests__/matrixOperations.test.ts
import { buildMathjsMatrix, validateMatrixEquation } from '../math/matrixOperations';
import { parseMatrixContentRecursive } from '../text-analysis/formulaDetector';

describe('Matrix Operations', () => {
  test('builds mathjs matrix from MatrixData', () => {
    const matrixData = {
      rows: [['1', '2'], ['3', '4']],
      nestedMatrices: [],
      type: 'plain' as const,
      dimensions: { m: 2, n: 2 }
    };
    const mat = buildMathjsMatrix(matrixData);
    expect(mat.size()).toEqual([2, 2]);
    expect(mat.get([0, 0])).toBe(1);
  });

  test('validates determinant', () => {
    const latex = '\\begin{vmatrix}1&2\\\\3&4\\end{vmatrix}';
    const result = validateMatrixEquation(latex);
    expect(result.isValid).toBe(true);
    expect(result.solution.type).toBe('determinant');
    expect(result.solution.value).toBe(-2); // 1*4 - 2*3
  });
});

// frontend/src/utils/text-analysis/__tests__/nestedMatrix.test.ts
import { parseMatrixContentRecursive } from '../formulaDetector';

describe('Nested Matrix Parsing', () => {
  test('parses nested matrices', () => {
    const content = '\\begin{matrix} \\begin{matrix}1&2\\end{matrix} & 3 \\\\ 4 & 5 \\end{matrix}';
    const result = parseMatrixContentRecursive(content);
    expect(result.nestedMatrices).toHaveLength(1);
    expect(result.nestedMatrices[0].dimensions).toEqual({ m: 1, n: 2 });
    expect(result.dimensions).toEqual({ m: 2, n: 2 });
  });

  test('handles multiple levels of nesting', () => {
    const content = '\\begin{matrix} \\begin{matrix}1&2\\\\3&4\\end{matrix} & \\begin{matrix}5\\\\6\\end{matrix} \\end{matrix}';
    const result = parseMatrixContentRecursive(content);
    expect(result.nestedMatrices).toHaveLength(2);
    expect(result.nestedMatrices[0].dimensions).toEqual({ m: 2, n: 2 });
    expect(result.nestedMatrices[1].dimensions).toEqual({ m: 2, n: 1 });
  });
});