export interface GrammarIssue {
    message: string;
    suggestion?: string;
    start: number;
    end: number;
}

export interface MathIssue {
    expression: string;
    result: {
        isValid: boolean;
        verification?: string;
        solution?: string;
        error?: string;
    };
}

export interface ScientificIssue {
    type: string;
    message: string;
    suggestion?: string;
    severity: 'high' | 'medium' | 'low';
    start: number;
    end: number;
}

export interface AnalysisResult {
    grammarIssues: GrammarIssue[];
    mathIssues: MathIssue[];
    scientificIssues: ScientificIssue[];
}

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
    // Mock implementation
    return {
        grammarIssues: [],
        mathIssues: [],
        scientificIssues: []
    };
};

export const processTextWithSSML = (text: string, formulas: any[]): string => {
    return text; // Mock implementation
};
