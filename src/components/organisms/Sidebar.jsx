import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import NavLink from "@/components/molecules/NavLink";
import Inventory from "@/components/pages/Inventory";

const Sidebar = ({ isOpen = false, onClose }) => {
const navigation = [
    { name: "Dashboard", to: "/", icon: "LayoutDashboard" },
    { name: "Products", to: "/products", icon: "Package" },
    { name: "Inventory", to: "/inventory", icon: "Archive" },
    { name: "Pricing", to: "/pricing", icon: "DollarSign" },
    { name: "Barcode Search", to: "/barcode-search", icon: "QrCode" },
    { name: "Sales", to: "/sales", icon: "TrendingUp" },
    { name: "Customers", to: "/customers", icon: "Users" },
    { name: "Reports", to: "/reports", icon: "FileText" },
  ];

  // Desktop sidebar - static positioning
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-primary-900 border-r border-primary-800 min-h-screen">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-6 border-b border-primary-800">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Diamond" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">4C Diamonds</h1>
              <p className="text-gray-400 text-xs">Inventory System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink key={item.name} to={item.to} icon={item.icon}>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile sidebar - overlay with transform
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
className="lg:hidden fixed inset-0 z-50"
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative w-80 bg-primary-900 h-full shadow-2xl overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-primary-800">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Diamond" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">4C Diamonds</h1>
                <p className="text-gray-400 text-xs">Inventory System</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-primary-800 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink key={item.name} to={item.to} icon={item.icon}>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
</div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;