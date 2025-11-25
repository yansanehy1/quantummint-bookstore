import * as React from "react";
export declare const Tabs: React.FC<{
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children?: React.ReactNode;
}>;
export declare const TabsList: React.FC<{
    className?: string;
    children?: React.ReactNode;
}>;
export declare const TabsTrigger: React.FC<{
    value: string;
    className?: string;
    children?: React.ReactNode;
}>;
export declare const TabsContent: React.FC<{
    value: string;
    className?: string;
    children?: React.ReactNode;
}>;
export default Tabs;
