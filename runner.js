// Mock Jest globals
global.describe = (name, fn) => {
    console.log(name);
    try {
        fn();
    }
    catch (e) {
        console.error('Error in describe:', e);
    }
};
global.test = (name, fn) => {
    console.log('  ' + name);
    try {
        fn();
    }
    catch (e) {
        console.error('Error in test:', e);
    }
};
global.expect = (actual) => ({
    toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected))
            console.error('    FAIL toEqual', actual, expected);
        else
            console.log('    PASS');
    },
    toHaveLength: (len) => {
        if (actual.length !== len)
            console.error('    FAIL toHaveLength', actual.length, len);
        else
            console.log('    PASS');
    },
    toBe: (expected) => {
        if (actual !== expected)
            console.error('    FAIL toBe', actual, expected);
        else
            console.log('    PASS');
    },
    toContain: (expected) => {
        if (!actual.includes(expected))
            console.error('    FAIL toContain', actual, expected);
        else
            console.log('    PASS');
    }
});
require('./frontend/src/utils/text-analysis/__tests__/matrixParsing.test.ts');
