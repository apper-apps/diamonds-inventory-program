import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
<div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
      </div>
      
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center">Oops! Something went wrong</h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm text-sm sm:text-base">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="primary" className="w-full sm:w-auto min-h-[44px]">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;