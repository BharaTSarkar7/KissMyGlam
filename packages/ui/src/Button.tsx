import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-sans font-medium transition-colors focus:outline-none rounded-pill px-6 py-3 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";
    const variantClasses = {
      primary: "bg-ink text-white hover:bg-ink/90",
      ghost: "bg-transparent text-ink border border-line hover:bg-bg-alt",
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
