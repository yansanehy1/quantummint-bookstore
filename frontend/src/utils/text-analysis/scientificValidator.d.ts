export interface ScientificIssue {
    type: string;
    message: string;
    start: number;
    end: number;
    suggestion?: string;
    severity: 'low' | 'medium' | 'high';
}
export declare function checkScientificAccuracy(text: string): ScientificIssue[];
