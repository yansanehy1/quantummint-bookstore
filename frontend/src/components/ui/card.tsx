import * as React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => {
  const base = "rounded-lg border border-gray-200 bg-white shadow-sm";
  return <div ref={ref} className={[base, className].join(" ")} {...props} />;
});

Card.displayName = "Card";

export default Card;
