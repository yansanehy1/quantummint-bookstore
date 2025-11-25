"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formulaDetector_1 = require("../formulaDetector");
describe('Debug Import', () => {
    test('parseMatrixContentRecursive is defined', () => {
        console.log('parseMatrixContentRecursive:', formulaDetector_1.parseMatrixContentRecursive);
        expect(typeof formulaDetector_1.parseMatrixContentRecursive).toBe('function');
    });
    test('can call parseMatrixContentRecursive', () => {
        const content = '1 & 2 \\\\ 3 & 4';
        console.log('Input:', content);
        const result = (0, formulaDetector_1.parseMatrixContentRecursive)(content);
        console.log('Result:', result);
        expect(result).toBeDefined();
    });
});
