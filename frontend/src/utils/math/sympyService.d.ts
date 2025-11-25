export declare function evaluateWithSympy(expression: string): Promise<{
    result: string | null;
    error: string | null;
    latex?: string;
}>;
export declare function checkSympyServer(): Promise<boolean>;
