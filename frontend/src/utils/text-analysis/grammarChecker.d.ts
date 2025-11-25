export interface GrammarIssue {
    type: string;
    message: string;
    start: number;
    end: number;
    suggestion?: string;
    severity: 'low' | 'medium' | 'high';
}
export declare function checkGrammar(text: string): GrammarIssue[];
