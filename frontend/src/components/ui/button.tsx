import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants: Record<string, string> = {
      default: "bg-gray-900 text-white hover:bg-gray-800",
      outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
      destructive: "bg-red-500 text-white hover:bg-red-600",
    };
    const sizes: Record<string, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg",
      icon: "h-10 w-10",
    };
    return (
      <button ref={ref} className={[base, variants[variant] || variants.default, sizes[size] || sizes.md, className].join(" ")} {...props} />
    );
  }
);

Button.displayName = "Button";

export default Button;
