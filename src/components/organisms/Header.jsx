import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    return path.slice(1).charAt(0).toUpperCase() + path.slice(2);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden mr-4"
          >
            <ApperIcon name="Menu" className="w-4 h-4" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 text-sm">
              4C Diamonds Inventory Management System
            </p>
          </div>
        </div>

<div className="flex items-center space-x-4">
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => navigate('/barcode-search')}
            className="flex items-center"
          >
            <ApperIcon name="QrCode" className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Barcode Search</span>
          </Button>
          
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <ApperIcon name="Bell" className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          
<Button 
            variant="outline" 
            size="sm" 
            onClick={async () => {
              try {
                const { ApperUI } = window.ApperSDK;
                await ApperUI.logout();
                navigate('/login');
              } catch (error) {
                console.error('Logout error:', error);
                try {
                  await ApperUI.logout();
                  navigate('/login');
                } catch (fallbackError) {
                  console.error("Logout failed:", fallbackError);
                  navigate('/login');
                }
              }
            }}
            className="flex items-center"
          >
            <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
          
          <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      
</header>
  );
};

export default Header;