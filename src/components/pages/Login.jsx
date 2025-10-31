import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { authService } from "@/services/api/authService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Inventory from "@/components/pages/Inventory";
import FormField from "@/components/molecules/FormField";
import { setUser } from "@/store/userSlice";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login(formData.username, formData.password);
      dispatch(setUser(user));
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed');
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
<div className="w-full max-w-md space-y-8 p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
        <div className="flex flex-col gap-6 items-center justify-center">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {errors.general}
            </div>
          )}

          <FormField
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="Enter your username"
            disabled={loading}
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            disabled={loading}
            required
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

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