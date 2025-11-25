"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateWithSympy = evaluateWithSympy;
exports.checkSympyServer = checkSympyServer;
// frontend/src/utils/math/sympyService.ts
const axios_1 = __importDefault(require("axios"));
const SYMPY_SERVER_URL = 'http://localhost:5000';
async function evaluateWithSympy(expression) {
    try {
        const response = await axios_1.default.post(`${SYMPY_SERVER_URL}/evaluate`, {
            expression: expression
        });
        return response.data;
    }
    catch (error) {
        console.error('Error evaluating with SymPy:', error);
        return {
            result: null,
            error: error.response?.data?.error || error.message
        };
    }
}
// Example usage:
// In your component or service:
async function handleMathExpression(expr) {
    const { result, error, latex } = await evaluateWithSympy(expr);
    if (error) {
        console.error('Evaluation failed:', error);
        return;
    }
    console.log('Result:', result);
    console.log('LaTeX:', latex);
    // Update your UI with the result
}
// const { result, error, latex } = await evaluateWithSympy('integrate(x**2, x)');
// In sympyService.ts
async function checkSympyServer() {
    try {
        await axios_1.default.get('http://localhost:5000/evaluate', {
            timeout: 1000,
            validateStatus: () => true // Don't throw on 404
        });
        return true;
    }
    catch {
        return false;
    }
}
// Usage:
const isAvailable = await checkSympyServer();
if (!isAvailable) {
    // Fall back to mathjs or show a message to the user
}
