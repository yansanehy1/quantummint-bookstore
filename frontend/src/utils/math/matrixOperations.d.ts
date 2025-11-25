import { Matrix } from 'mathjs';
import { MatrixData } from '../text-analysis/formulaDetector';
export declare function buildMathjsMatrix(data: MatrixData): Matrix;
export declare function validateMatrixEquation(latex: string): {
    isValid: boolean;
    solution: any;
    error?: string;
};
