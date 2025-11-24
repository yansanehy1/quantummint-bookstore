declare module 'react-katex' {
    import { FC, ComponentProps } from 'react';

    export const InlineMath: FC<{ math: string } & ComponentProps<'span'>>;
    export const BlockMath: FC<{ math: string } & ComponentProps<'div'>>;
}
