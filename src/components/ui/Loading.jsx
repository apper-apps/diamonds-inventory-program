import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="text-left py-4 px-6">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="h-8 bg-gray-300 rounded animate-pulse w-16"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full"
      />
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );
};

export default Loading;