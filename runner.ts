
// Mock Jest globals
(global as any).describe = (name: string, fn: () => void) => {
    console.log(name);
    try { fn(); } catch (e) { console.error('Error in describe:', e); }
};
(global as any).test = (name: string, fn: () => void) => {
    console.log('  ' + name);
    try { fn(); } catch (e) { console.error('Error in test:', e); }
};
(global as any).expect = (actual: any) => ({
    toEqual: (expected: any) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) console.error('    FAIL toEqual', actual, expected);
        else console.log('    PASS');
    },
    toHaveLength: (len: number) => {
        if (actual.length !== len) console.error('    FAIL toHaveLength', actual.length, len);
        else console.log('    PASS');
    },
    toBe: (expected: any) => {
        if (actual !== expected) console.error('    FAIL toBe', actual, expected);
        else console.log('    PASS');
    },
    toContain: (expected: any) => {
        if (!actual.includes(expected)) console.error('    FAIL toContain', actual, expected);
        else console.log('    PASS');
    }
});

require('./frontend/src/utils/text-analysis/__tests__/matrixParsing.test.ts');
