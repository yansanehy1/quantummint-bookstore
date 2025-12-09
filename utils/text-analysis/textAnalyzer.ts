import { Formula } from './formulaDetector';

export interface AnalysisResults {
    grammarIssues: GrammarIssue[];
    mathIssues: MathIssue[];
    scientificIssues: ScientificIssue[];
}

export interface GrammarIssue {
    message: string;
    start: number;
    end: number;
    suggestion?: string;
}

export interface MathIssue {
    expression: string;
    result: {
        isValid: boolean;
        verification?: string;
        solution?: any;
        error?: string;
    };
}

export interface ScientificIssue {
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    start: number;
    end: number;
    suggestion?: string;
}

// Mock text analysis - replace with actual AI analysis
export async function analyzeText(text: string): Promise<AnalysisResults> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        grammarIssues: [],
        mathIssues: [],
        scientificIssues: []
    };
}

// Process text with SSML markup for formulas
export function processTextWithSSML(text: string, formulas: Formula[]): string {
    let processedText = text;

    // Replace formulas with SSML speech markup
    formulas.forEach(formula => {
        const speechText = formulaToSpeech(formula.content);
        const ssml = `<prosody rate="slow">${speechText}</prosody>`;
        processedText = processedText.replace(
            `$${formula.content}$`,
            ssml
        );
    });

    return processedText;
}

function formulaToSpeech(formula: string): string {
    // Simple conversion - replace with more sophisticated formula-to-speech
    return formula
        .replace(/\\/g, '')
        .replace(/frac/g, 'fraction')
        .replace(/\{/g, '')
        .replace(/\}/g, '')
        .replace(/\^/g, ' to the power of ');
}
