export interface MathValidationResult {
    isValid: boolean;
    error?: string;
    solution?: any;
    verification?: string;
    spoken?: string;
}
export declare function validateMathExpression(expression: string): Promise<{
    isValid: boolean;
    solution: any;
    error: string;
} | {
    isValid: boolean;
    solution: {
        value: string;
        latex: string;
        type: string;
    };
    error?: undefined;
}>;
export declare function validateMath(latex: string): Promise<{
    isValid: boolean;
    solution: any;
    error?: string;
}>;
export declare function extractMathExpressions(text: string): {
    expression: string;
    start: number;
    end: number;
    type: "display" | "inline";
    spoken: string;
}[];
