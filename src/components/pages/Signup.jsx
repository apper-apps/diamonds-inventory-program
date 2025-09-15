import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useContext } from 'react';
import { AuthContext } from '../../App';
import ApperIcon from "@/components/ApperIcon";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isInitialized } = useContext(AuthContext);

  useEffect(() => {
    if (isInitialized) {
      // Show signup UI in this component
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSignup("#authentication");
    }
  }, [isInitialized]);

  return (

    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gold-500 rounded-xl">
              <ApperIcon name="Gem" size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">4C Diamonds</h1>
              <p className="text-sm text-gray-600">Inventory Management System</p>
            </div>
          </div>
          <p className="text-gray-600">Sign up to access your dashboard</p>
        </div>

        {/* Login Form */}
        <div id="authentication" className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"></div>
        <div className="text-center mt-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; 2024 4C Diamonds. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;