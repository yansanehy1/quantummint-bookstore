import * as React from "react";
export declare const Dialog: React.FC<{
    open?: boolean;
    onOpenChange?: (o: boolean) => void;
    children?: React.ReactNode;
}>;
export declare const DialogTrigger: React.FC<{
    asChild?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
}>;
export declare const DialogContent: React.FC<{
    className?: string;
    children?: React.ReactNode;
}>;
export declare const DialogHeader: React.FC<{
    className?: string;
    children?: React.ReactNode;
}>;
export declare const DialogTitle: React.FC<{
    className?: string;
    children?: React.ReactNode;
}>;
export default Dialog;
