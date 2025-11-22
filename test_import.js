const { parseMatrixContentRecursive } = require('./frontend/src/utils/text-analysis/formulaDetector.ts');

console.log('Successfully imported parseMatrixContentRecursive');
console.log('Type:', typeof parseMatrixContentRecursive);

try {
    const result = parseMatrixContentRecursive('1 & 2 \\\\ 3 & 4');
    console.log('Result:', result);
} catch (e) {
    console.error('Error calling function:', e);
}
