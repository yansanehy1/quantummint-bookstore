import * as React from "react";

export const Dialog: React.FC<{ open?: boolean; onOpenChange?: (o: boolean) => void; children?: React.ReactNode }>
  = ({ open, children }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {children}
      </div>
    );
  };

export const DialogTrigger: React.FC<{ asChild?: boolean; children?: React.ReactNode; onClick?: () => void }>
  = ({ children, onClick }) => <div onClick={onClick}>{children}</div>;

export const DialogContent: React.FC<{ className?: string; children?: React.ReactNode }>
  = ({ children, className }) => (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-lg shadow-lg z-10 ${className || ''}`}>
        {children}
      </div>
    </>
  );

export const DialogHeader: React.FC<{ className?: string; children?: React.ReactNode }>
  = ({ children, className }) => <div className={`mb-4 ${className || ''}`}>{children}</div>;

export const DialogTitle: React.FC<{ className?: string; children?: React.ReactNode }>
  = ({ children, className }) => <h3 className={`text-xl font-bold ${className || ''}`}>{children}</h3>;

export default Dialog;
