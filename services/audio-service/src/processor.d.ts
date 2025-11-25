export interface Formula {
    id: string;
    latex: string;
    mathml?: string;
    spoken: string;
    position: {
        start: number;
        end: number;
    };
}
export interface ProcessedSentence {
    id: string;
    text: string;
    originalText: string;
    containsFormula: boolean;
    formulas: Formula[];
    speechText: string;
    startIndex: number;
    endIndex: number;
}
export declare function detectSentences(text: string): string[];
export declare function detectFormulas(text: string): Formula[];
export declare function latexToSpeech(latex: string): string;
export declare function replaceFormulasWithSpeech(text: string, formulas: Formula[]): string;
export declare function processText(rawText: string): ProcessedSentence[];
