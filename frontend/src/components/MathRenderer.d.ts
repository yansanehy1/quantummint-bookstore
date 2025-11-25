import React from 'react';
interface MathRendererProps {
    formula: string;
}
declare global {
    interface Window {
        katex: any;
    }
}
declare const MathRenderer: React.FC<MathRendererProps>;
export default MathRenderer;
