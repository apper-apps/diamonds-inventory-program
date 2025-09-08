import React from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NavLink = ({ to, icon, children, className }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  return (
    <RouterNavLink
      to={to}
      className={({ isActive: routerActive }) =>
        cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
          isActive || routerActive
            ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg"
            : "text-gray-300 hover:bg-primary-800 hover:text-white",
          className
        )
      }
    >
      <ApperIcon 
        name={icon} 
        className={cn(
          "w-5 h-5 mr-3 transition-transform duration-200",
          isActive 
            ? "text-white scale-110" 
            : "text-gray-400 group-hover:text-gray-200"
        )} 
      />
      <span className="transition-all duration-200">{children}</span>
    </RouterNavLink>
  );
};

export default NavLink;