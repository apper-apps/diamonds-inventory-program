import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ className, error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors resize-vertical",
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

Textarea.displayName = "Textarea";

export default Textarea;