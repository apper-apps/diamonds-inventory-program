import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, type = "text", error, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent",
        error 
          ? "border-red-300 focus:ring-red-500" 
          : "border-gray-300 hover:border-gray-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;