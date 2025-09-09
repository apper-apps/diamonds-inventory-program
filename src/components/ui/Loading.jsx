import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "camera") {
    return (
<div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="relative mb-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white border-t-transparent rounded-full"
            />
          </motion.div>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center">Initializing Camera</h3>
        <p className="text-gray-600 text-center max-w-sm text-sm sm:text-base">
          Please wait while we access your camera for barcode scanning...
        </p>
      </div>
    );
  }

  if (type === "table") {
    return (
<div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-3 sm:py-4 sm:px-6">
                  <div className="h-3 sm:h-4 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-3 sm:py-4 sm:px-6 hidden sm:table-cell">
                  <div className="h-3 sm:h-4 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-3 sm:py-4 sm:px-6 hidden md:table-cell">
                  <div className="h-3 sm:h-4 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-3 sm:py-4 sm:px-6">
                  <div className="h-3 sm:h-4 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-3 px-3 sm:py-4 sm:px-6">
                  <div className="h-3 sm:h-4 bg-gray-300 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-3 sm:py-4 sm:px-6">
                    <div className="space-y-2">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:py-4 sm:px-6 hidden sm:table-cell">
                    <div className="h-5 sm:h-6 bg-gray-200 rounded-full animate-pulse w-16 sm:w-20"></div>
                  </td>
                  <td className="py-3 px-3 sm:py-4 sm:px-6 hidden md:table-cell">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-20 sm:w-24"></div>
                  </td>
                  <td className="py-3 px-3 sm:py-4 sm:px-6">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-12 sm:w-16"></div>
                  </td>
                  <td className="py-3 px-3 sm:py-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse w-12 sm:w-16"></div>
                      <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse w-12 sm:w-16"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (type === "cards") {
return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-2 sm:space-y-3 flex-1">
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-20 sm:w-24"></div>
                <div className="h-6 sm:h-8 bg-gray-300 rounded animate-pulse w-12 sm:w-16"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded animate-pulse w-16 sm:w-20"></div>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
<div className="flex items-center justify-center py-8 sm:py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-gold-500 border-t-transparent rounded-full"
      />
      <span className="ml-2 sm:ml-3 text-gray-600 text-sm sm:text-base">Loading...</span>
    </div>
  );
};

export default Loading;