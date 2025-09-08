import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BarcodeScanner from "@/components/organisms/BarcodeScanner";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  const [scannerOpen, setScannerOpen] = useState(false);
  
  const handleBarcodeScan = (barcode) => {
    console.log('Barcode scanned:', barcode);
    setScannerOpen(false);
  };
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
            onClick={() => setScannerOpen(true)}
            className="flex items-center"
          >
            <ApperIcon name="Camera" className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Scan</span>
          </Button>
          
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <ApperIcon name="Bell" className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          
          <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      
      <BarcodeScanner
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
onScan={handleBarcodeScan}
      />
    </header>
  );
};

export default Header;