// frontend/src/utils/text-analysis/__tests__/matrixParsing.test.ts
import { parseMatrixContentRecursive, detectFormulas } from '../formulaDetector';

describe('Matrix Parsing', () => {
  test('parses simple matrix content', () => {
    const content = '1 & 2 \\\\ 3 & 4';
    const result = parseMatrixContentRecursive(content);
    expect(result.rows).toEqual([['1', '2'], ['3', '4']]);
    expect(result.dimensions).toEqual({ m: 2, n: 2 });
  });

  test('detects matrix environment', () => {
    const text = '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}';
    const formulas = detectFormulas(text);
    expect(formulas).toHaveLength(1);
    expect(formulas[0].matrixData?.dimensions).toEqual({ m: 2, n: 2 });
  });
});