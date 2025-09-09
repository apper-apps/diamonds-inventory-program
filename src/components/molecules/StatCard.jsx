import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, subtitle, gradient = "from-blue-500 to-purple-600", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:scale-105"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1 truncate">{title}</p>
          <p className={`text-xl sm:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent break-words`}>
            {typeof value === 'string' && value.startsWith('$') ? value.replace('$', '₹') : value}
</p>
          <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient || 'from-gray-100 to-gray-200'} rounded-xl flex items-center justify-center flex-shrink-0 ml-2 sm:ml-4`}>
            <ApperIcon name={icon} className={`w-4 h-4 sm:w-6 sm:h-6 ${gradient ? 'text-white' : 'text-gray-600'}`} />
          </div>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient}`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;