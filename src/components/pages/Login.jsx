import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";

function Login() {
  const { isInitialized } = useContext(AuthContext);
  
  useEffect(() => {
    if (isInitialized) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showLogin("#authentication");
    }
  }, [isInitialized]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg">
            <ApperIcon name="Diamond" size={32} className="text-white" />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="text-center text-2xl font-bold text-primary-900">
              Sign in to 4C Diamonds
            </div>
            <div className="text-center text-sm text-gray-600">
              Manage your diamond inventory with precision
            </div>
          </div>
        </div>

        <div id="authentication" />

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;