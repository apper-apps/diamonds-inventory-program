import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation select-none";
  
  const variants = {
    default: "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-lg hover:shadow-xl active:scale-95 focus:ring-gold-500",
    primary: "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-lg hover:shadow-xl active:scale-95 focus:ring-gold-500",
    secondary: "border-2 border-gold-500 text-gold-600 hover:bg-gold-50 hover:border-gold-600 active:bg-gold-100 focus:ring-gold-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl active:scale-95 focus:ring-red-500",
    ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500"
  };

  const sizes = {
    sm: "px-2 sm:px-3 py-1.5 text-xs sm:text-sm min-h-[32px]",
    md: "px-3 sm:px-4 py-2 text-sm sm:text-base min-h-[40px]",
    lg: "px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg min-h-[44px]"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;