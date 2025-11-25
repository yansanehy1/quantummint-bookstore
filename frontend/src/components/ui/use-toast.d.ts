import * as React from "react";
export type ToastVariant = "default" | "destructive";
type Toast = {
    id: string;
    title: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
};
type ToastContextType = {
    toasts: Toast[];
    toast: (props: Omit<Toast, "id">) => void;
    dismissToast: (id: string) => void;
};
export declare function ToastProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useToast(): ToastContextType;
export {};
