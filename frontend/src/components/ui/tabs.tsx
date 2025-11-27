import * as React from "react";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export const Tabs: React.FC<{
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}> = ({ children, className, defaultValue, value: controlledValue, onValueChange }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  children,
  className,
}) => <div className={className}>{children}</div>;

export const TabsTrigger: React.FC<{
  value: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}> = ({ children, className, value: triggerValue, disabled }) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }

  const isActive = context.value === triggerValue;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={className}
      onClick={() => !disabled && context.onValueChange(triggerValue)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{
  value: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ children, className, value: contentValue }) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }

  if (context.value !== contentValue) {
    return null;
  }

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
};

export default Tabs;
