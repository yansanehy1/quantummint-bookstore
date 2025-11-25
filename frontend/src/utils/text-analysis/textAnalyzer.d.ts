import { GrammarIssue } from './grammarChecker';
import { validateMathExpression } from './mathValidator';
import { ScientificIssue } from './scientificValidator';
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
export declare function processTextWithSSML(text: string, formulas: Formula[]): string;
export declare function analyzeText(text: string): Promise<AnalysisResult>;
