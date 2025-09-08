import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Customers = () => {
  const customerStats = [
    { label: "Total Customers", value: "1,547", icon: "Users", color: "from-blue-500 to-blue-600" },
    { label: "New This Month", value: "89", icon: "UserPlus", color: "from-green-500 to-green-600" },
    { label: "VIP Customers", value: "234", icon: "Crown", color: "from-gold-500 to-gold-600" },
    { label: "Repeat Buyers", value: "67%", icon: "Repeat", color: "from-purple-500 to-purple-600" }
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
          Customer Management
        </h1>
        <p className="text-gray-600 mt-2">
          Build and maintain relationships with your jewelry customers and track their preferences.
        </p>
      </motion.div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerStats.map((stat, index) => (
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
        <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Users" className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Advanced Customer Features Coming Soon
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          We're building comprehensive customer relationship tools including contact management, 
          purchase history tracking, preference recording, and personalized service features.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "Customer Profiles",
              description: "Detailed customer information and contact management",
              icon: "UserCircle"
            },
            {
              title: "Purchase History",
              description: "Complete transaction records and buying patterns",
              icon: "History"
            },
            {
              title: "Preferences",
              description: "Track customer preferences and jewelry interests",
              icon: "Heart"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <ApperIcon name={feature.icon} className="w-6 h-6 text-purple-600" />
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

export default Customers;