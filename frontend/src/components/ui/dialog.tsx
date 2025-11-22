import * as React from "react";

export const Dialog: React.FC<{ open?: boolean; onOpenChange?: (o: boolean) => void; children?: React.ReactNode }>
  = ({ children }) => <>{children}</>;

export const DialogTrigger: React.FC<{ asChild?: boolean; children?: React.ReactNode }>
  = ({ children }) => <>{children}</>;

export const DialogContent: React.FC<{ className?: string; children?: React.ReactNode }>
  = ({ children, className }) => <div className={className}>{children}</div>;

export const DialogHeader: React.FC<{ children?: React.ReactNode }>
  = ({ children }) => <div className="mb-4">{children}</div>;

export const DialogTitle: React.FC<{ children?: React.ReactNode }>
  = ({ children }) => <h3 className="text-xl font-bold">{children}</h3>;

export default Dialog;
