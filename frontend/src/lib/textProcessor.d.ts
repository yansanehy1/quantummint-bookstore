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
/**
 * Detect sentences in text using regex
 * Handles common sentence endings: . ! ?
 */
export declare function detectSentences(text: string): string[];
/**
 * Detect LaTeX formulas in text
 * Supports: $...$ (inline), $$...$$ (display), \(...\), \[...\]
 */
export declare function detectFormulas(text: string): Formula[];
/**
 * Convert LaTeX notation to spoken text
 */
export declare function latexToSpeech(latex: string): string;
/**
 * Replace formulas in text with spoken equivalents
 */
export declare function replaceFormulasWithSpeech(text: string, formulas: Formula[]): string;
/**
 * Process raw text into sentences with formula detection and speech conversion
 */
export declare function processText(rawText: string): ProcessedSentence[];
/**
 * Validate LaTeX formula syntax
 */
export declare function isValidLatex(latex: string): boolean;
/**
 * Extract text without formulas (for plain text display)
 */
export declare function stripFormulas(text: string): string;
