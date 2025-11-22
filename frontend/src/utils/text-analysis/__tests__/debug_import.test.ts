import { parseMatrixContentRecursive, detectFormulas } from '../formulaDetector';

describe('Debug Import', () => {
    test('parseMatrixContentRecursive is defined', () => {
        console.log('parseMatrixContentRecursive:', parseMatrixContentRecursive);
        expect(typeof parseMatrixContentRecursive).toBe('function');
    });

    test('can call parseMatrixContentRecursive', () => {
        const content = '1 & 2 \\\\ 3 & 4';
        console.log('Input:', content);
        const result = parseMatrixContentRecursive(content);
        console.log('Result:', result);
        expect(result).toBeDefined();
    });
});
