"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// frontend/src/utils/text-analysis/__tests__/formulaDetector.test.ts
const formulaDetector_1 = require("../formulaDetector");
describe('Advanced LaTeX Parsing', () => {
    test('handles equation environment', () => {
        const text = '\\begin{equation} E = mc^2 \\end{equation}';
        const formulas = (0, formulaDetector_1.detectFormulas)(text);
        expect(formulas).toHaveLength(1);
        expect(formulas[0].latex).toBe(' E = mc^2 ');
        expect(formulas[0].spoken).toContain('E = m c squared');
    });
    test('handles matrices', () => {
        const text = '\\begin{matrix} 1 & 2 \\\\ 3 & 4 \\end{matrix}';
        const formulas = (0, formulaDetector_1.detectFormulas)(text);
        expect(formulas[0].spoken).toContain('matrix with 2 rows: 1 , 2; 3 , 4');
    });
    test('handles invalid LaTeX', () => {
        const text = '$ \\invalid $';
        const formulas = (0, formulaDetector_1.detectFormulas)(text);
        expect(formulas[0].spoken).toBe('formula');
    });
});
describe('TTS Optimization', () => {
    test('natural speech for integrals', () => {
        const spoken = (0, formulaDetector_1.latexToSpeech)('\\int_{0}^{1} x^2 dx');
        expect(spoken).toContain('the integral from 0 to 1 of x squared dx');
    });
    test('derivatives', () => {
        const spoken = (0, formulaDetector_1.latexToSpeech)('\\frac{dx}{dy}');
        expect(spoken).toBe('d x over d y');
    });
    test('trig functions', () => {
        const spoken = (0, formulaDetector_1.latexToSpeech)('\\sin(x)');
        expect(spoken).toBe('sine ( x )');
    });
    test('edge case: empty', () => {
        const spoken = (0, formulaDetector_1.latexToSpeech)('');
        expect(spoken).toBe('');
    });
    test('handles common fractions', () => {
        const spoken = (0, formulaDetector_1.latexToSpeech)('\\frac{1}{2}');
        expect(spoken).toBe('one half');
    });
    test('handles exponents', () => {
        const spoken = (0, formulaDetector_1.latexToSpeech)('x^2 + y^3');
        expect(spoken).toContain('x squared plus y cubed');
    });
});
describe('Formula Detection', () => {
    test('detects inline formulas', () => {
        const text = 'The formula is $E=mc^2$';
        const formulas = (0, formulaDetector_1.detectFormulas)(text);
        expect(formulas).toHaveLength(1);
        expect(formulas[0].type).toBe('inline');
        expect(formulas[0].position.start).toBe(16);
        expect(formulas[0].position.end).toBe(23);
    });
    test('detects display formulas', () => {
        const text = 'Consider: $$\\int x^2 dx$$';
        const formulas = (0, formulaDetector_1.detectFormulas)(text);
        expect(formulas).toHaveLength(1);
        expect(formulas[0].type).toBe('display');
    });
    test('handles multiple formulas', () => {
        const text = 'First $a$, then $b$';
        const formulas = (0, formulaDetector_1.detectFormulas)(text);
        expect(formulas).toHaveLength(2);
        expect(formulas[0].latex).toBe('a');
        expect(formulas[1].latex).toBe('b');
    });
    test('handles nested formulas', () => {
        const text = 'Nested: $a = \\frac{1}{2}$';
        const formulas = (0, formulaDetector_1.detectFormulas)(text);
        expect(formulas).toHaveLength(1);
        expect(formulas[0].spoken).toContain('a = one half');
    });
});
// Add performance test for large inputs
describe('Performance', () => {
    test('handles large text efficiently', () => {
        const largeText = 'x = 1\n'.repeat(1000);
        const start = performance.now();
        const formulas = (0, formulaDetector_1.detectFormulas)(largeText);
        const duration = performance.now() - start;
        expect(duration).toBeLessThan(100); // Should process in under 100ms
        expect(formulas.length).toBeGreaterThan(0);
    });
});
// Test for special characters and edge cases
describe('Edge Cases', () => {
    test('handles empty strings', () => {
        expect((0, formulaDetector_1.detectFormulas)('')).toEqual([]);
    });
    test('handles text without formulas', () => {
        const text = 'This is just regular text.';
        expect((0, formulaDetector_1.detectFormulas)(text)).toEqual([]);
    });
    test('handles malformed LaTeX', () => {
        const text = 'Broken $x + {y$';
        const formulas = (0, formulaDetector_1.detectFormulas)(text);
        expect(formulas).toHaveLength(1);
        // Should still return something reasonable
        expect(formulas[0].spoken).toBeDefined();
    });
});
