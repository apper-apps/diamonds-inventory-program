// Auth service now uses Apper SDK for authentication
// This service provides compatibility methods for existing code

const authService = {
  // Check if user has specific permission - simplified for demo
  hasPermission(permission) {
    // Since we're using ApperUI, assume all authenticated users have all permissions
    return true;
  },

  // Role-based access control - simplified for demo
  isManager() {
    return true; // All authenticated users are considered managers for pricing access
  },

  isSalesRep() {
    return true;
  },

  isStaff() {
    return true;
  }
};

export { authService };

export { authService };