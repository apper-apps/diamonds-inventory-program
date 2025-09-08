import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { dashboardService } from "@/services/api/dashboardService";
import Icon from "@/components/ui/Icon";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      setError("Failed to load dashboard statistics. Please try again.");
      console.error("Error loading dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardStats} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-xl p-8 text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to 4C Diamonds</h1>
        <p className="text-primary-100 text-lg">
          Your professional jewelry inventory management system. Monitor your diamond collection, track sales, and manage your business with precision.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts?.toLocaleString() || "0"}
          icon="Package"
          subtitle="Items in inventory"
          gradient="from-blue-500 to-blue-600"
          delay={0.1}
        />
        <StatCard
          title="Total Value"
value={`₹${(stats?.totalValue || 0).toLocaleString()}`}
          icon="DollarSign"
          subtitle="Inventory worth"
          gradient="from-green-500 to-green-600"
          delay={0.2}
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockItems?.toString() || "0"}
          icon="AlertTriangle"
          subtitle="Need attention"
          gradient="from-orange-500 to-red-500"
          delay={0.3}
        />
        <StatCard
          title="Recent Sales"
          value={stats?.recentSales?.toString() || "0"}
          icon="TrendingUp"
          subtitle="Last 7 days"
          gradient="from-gold-500 to-gold-600"
          delay={0.4}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Add Product", icon: "Plus", color: "from-blue-500 to-blue-600" },
            { name: "View Inventory", icon: "Archive", color: "from-green-500 to-green-600" },
            { name: "Process Sale", icon: "ShoppingCart", color: "from-purple-500 to-purple-600" },
            { name: "Generate Report", icon: "FileText", color: "from-gold-500 to-gold-600" }
          ].map((action, index) => (
            <motion.button
              key={action.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-200 text-left`}
            >
<div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                  <Icon name={action.icon} className="w-4 h-4" />
                </div>
                <span className="font-medium">{action.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;