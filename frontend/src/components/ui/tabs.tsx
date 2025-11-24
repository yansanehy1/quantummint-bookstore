import * as React from "react";

export const Tabs: React.FC<{
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode
}> = ({ children, className }) => <div className={className}>{children}</div>;

export const TabsList: React.FC<{ className?: string; children?: React.ReactNode }>
  = ({ children, className }) => <div className={className}>{children}</div>;

export const TabsTrigger: React.FC<{ value: string; className?: string; children?: React.ReactNode }>
  = ({ children, className }) => <button type="button" className={className}>{children}</button>;

export const TabsContent: React.FC<{ value: string; className?: string; children?: React.ReactNode }>
  = ({ children, className }) => <div className={className}>{children}</div>;

export default Tabs;
