// frontend/src/utils/math/sympyService.ts
import axios from 'axios';

const SYMPY_SERVER_URL = 'http://localhost:5000';

export async function evaluateWithSympy(expression: string): Promise<{
  result: string | null;
  error: string | null;
  latex?: string;
}> {
  try {
    const response = await axios.post(`${SYMPY_SERVER_URL}/evaluate`, {
      expression: expression
    });
    return response.data;
  } catch (error: any) {
    console.error('Error evaluating with SymPy:', error);
    return {
      result: null,
      error: error.response?.data?.error || error.message
    };
  }
}

// Example usage:
// In your component or service:
async function handleMathExpression(expr: string) {
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
export async function checkSympyServer(): Promise<boolean> {
  try {
    await axios.get('http://localhost:5000/evaluate', {
      timeout: 1000,
      validateStatus: () => true // Don't throw on 404
    });
    return true;
  } catch {
    return false;
  }
}

// Usage:
const isAvailable = await checkSympyServer();
if (!isAvailable) {
  // Fall back to mathjs or show a message to the user
}