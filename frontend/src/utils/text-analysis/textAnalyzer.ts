// frontend/src/utils/text-analysis/textAnalyzer.ts
import { wrapInSSML, addPauses, formatFormulaForSSML } from './ssmlUtils';
import { checkGrammar, GrammarIssue } from './grammarChecker';
import { validateMathExpression, extractMathExpressions } from './mathValidator';
import { checkScientificAccuracy, ScientificIssue } from './scientificValidator';
import { Formula } from './formulaDetector';

export interface AnalysisResult {
  grammarIssues: GrammarIssue[];
  mathIssues: Array<{
    expression: string;
    result: ReturnType<typeof validateMathExpression>;
    start: number;
    end: number;
    type: 'inline' | 'display';
    spoken?: string;
  }>;
  scientificIssues: ScientificIssue[];
  formulas: Array<{
    latex: string;
    type: 'inline' | 'display';
    start: number;
    end: number;
    spoken: string;
  }>;
}

export function processTextWithSSML(text: string, formulas: Formula[]): string {
  let result = text;
  // Process in reverse order to preserve positions
  const sortedFormulas = [...formulas].sort((a, b) => b.position.start - a.position.start);

  for (const formula of sortedFormulas) {
    const before = result.substring(0, formula.position.start);
    const after = result.substring(formula.position.end);
    const ssmlFormula = formatFormulaForSSML(formula.spoken, !!formula.matrixData);
    result = before + ssmlFormula + after;
  }

  // Add pauses and wrap in SSML
  return wrapInSSML(addPauses(result));
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  // Run all validations in parallel
  const [grammarIssues, scientificIssues] = await Promise.all([
    checkGrammar(text),
    checkScientificAccuracy(text)
  ]);

  // Process math expressions with enhanced detection
  const mathExpressions = extractMathExpressions(text);
  const mathIssues = mathExpressions.map(expr => ({
    ...expr,
    result: validateMathExpression(expr.expression)
  }));

  // Extract all formulas for highlighting
  const formulas = mathExpressions.map(expr => ({
    latex: expr.expression,
    type: expr.type,
    start: expr.start,
    end: expr.end,
    spoken: expr.spoken || ''
  }));

  return {
    grammarIssues,
    mathIssues,
    scientificIssues,
    formulas
  };
}