export interface MatrixData {
    rows: string[][];
    nestedMatrices: MatrixData[];
    type: 'plain' | 'parenthesized' | 'bracketed';
    dimensions: {
        m: number;
        n: number;
    };
}
export interface Formula {
    id: string;
    latex: string;
    spoken: string;
    position: {
        start: number;
        end: number;
    };
    type: 'inline' | 'display';
    matrixData?: MatrixData;
}
export declare function parseMatrixContentRecursive(content: string): MatrixData;
export declare function detectFormulas(text: string): Formula[];
export declare function latexToSpeech(latex: string, matrixData?: MatrixData): string;
