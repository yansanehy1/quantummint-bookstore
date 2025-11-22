import * as React from "react";

export const Tabs: React.FC<{ defaultValue?: string; className?: string; children?: React.ReactNode }>
  = ({ children, className }) => <div className={className}>{children}</div>;

export const TabsList: React.FC<{ className?: string; children?: React.ReactNode }>
  = ({ children, className }) => <div className={className}>{children}</div>;

export const TabsTrigger: React.FC<{ value: string; children?: React.ReactNode }>
  = ({ children }) => <button type="button">{children}</button>;

export const TabsContent: React.FC<{ value: string; className?: string; children?: React.ReactNode }>
  = ({ children, className }) => <div className={className}>{children}</div>;

export default Tabs;
