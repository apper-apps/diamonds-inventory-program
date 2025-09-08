import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sales = () => {
  const salesStats = [
    { label: "Today's Sales", value: "$12,450", icon: "DollarSign", color: "from-green-500 to-green-600" },
    { label: "This Week", value: "$67,890", icon: "TrendingUp", color: "from-blue-500 to-blue-600" },
    { label: "This Month", value: "$245,600", icon: "Calendar", color: "from-purple-500 to-purple-600" },
    { label: "Total Orders", value: "1,247", icon: "ShoppingCart", color: "from-gold-500 to-gold-600" }
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
          Sales Management
        </h1>
        <p className="text-gray-600 mt-2">
          Track sales performance, manage orders, and analyze customer purchasing patterns.
        </p>
      </motion.div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-12 text-center border border-gray-100"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="TrendingUp" className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Comprehensive Sales Tools Coming Soon
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          We're developing advanced sales management features including order processing, 
          payment tracking, customer analytics, and detailed sales reporting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "Order Processing",
              description: "Streamlined order management from quote to delivery",
              icon: "ShoppingCart"
            },
            {
              title: "Payment Tracking",
              description: "Monitor payments, installments, and financial records",
              icon: "CreditCard"
            },
            {
              title: "Sales Analytics",
              description: "Detailed insights into sales trends and performance",
              icon: "BarChart3"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <ApperIcon name={feature.icon} className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Sales;