import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Reports = () => {
  const reportTypes = [
    { 
      title: "Sales Reports", 
      description: "Revenue analysis, top-selling products, and sales trends",
      icon: "TrendingUp", 
      color: "from-green-500 to-green-600",
      bgColor: "from-green-100 to-green-200" 
    },
    { 
      title: "Inventory Reports", 
      description: "Stock levels, turnover rates, and inventory valuation",
      icon: "Archive", 
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-100 to-blue-200" 
    },
    { 
      title: "Customer Reports", 
      description: "Customer analytics, loyalty metrics, and buying patterns",
      icon: "Users", 
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-100 to-purple-200" 
    },
    { 
      title: "Financial Reports", 
      description: "Profit margins, expense tracking, and financial summaries",
      icon: "DollarSign", 
      color: "from-gold-500 to-gold-600",
      bgColor: "from-gold-100 to-gold-200" 
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-900 to-gold-600 bg-clip-text text-transparent">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          Generate comprehensive reports and gain insights into your jewelry business performance.
        </p>
      </motion.div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-gradient-to-br ${report.bgColor} rounded-xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-4 rounded-xl bg-gradient-to-r ${report.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <ApperIcon name={report.icon} className="w-8 h-8 text-white" />
              </div>
              <ApperIcon name="ArrowUpRight" className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-gray-700 mb-4">{report.description}</p>
            
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
              Coming Soon
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-12 text-center border border-gray-100"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="BarChart3" className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Advanced Analytics Platform
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          We're developing a powerful reporting engine with interactive dashboards, 
          custom report builders, automated scheduling, and advanced data visualization tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: "Interactive Charts",
              description: "Dynamic visualizations and drill-down capabilities",
              icon: "PieChart"
            },
            {
              title: "Custom Reports",
              description: "Build personalized reports with drag-and-drop interface",
              icon: "Settings"
            },
            {
              title: "Scheduled Reports",
              description: "Automated report generation and email delivery",
              icon: "Calendar"
            },
            {
              title: "Export Options",
              description: "Export reports in PDF, Excel, and CSV formats",
              icon: "Download"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <ApperIcon name={feature.icon} className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{feature.title}</h3>
              <p className="text-gray-600 text-xs">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;