// Authentication service using localStorage
// Primary authentication mechanism for the application
const authService = {
  // Check if user is authenticated
  isAuthenticated() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    return !!(user && token);
  },

  // Login method
  async login(username, password) {
    try {
      // Basic validation
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Simulate authentication - replace with actual API call
      // For demo purposes, accept any non-empty credentials
      if (username.trim() && password.trim()) {
        const user = {
          id: 1,
          username: username,
          email: `${username}@company.com`,
          name: username,
          role: 'manager'
        };
        
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        
        return user;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  // Logout method
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user has specific permission - simplified for demo
  hasPermission(permission) {
    // Since we're using ApperUI, assume all authenticated users have all permissions
    return this.isAuthenticated();
  },

  // Role-based access control - simplified for demo
  isManager() {
    return this.isAuthenticated(); // All authenticated users are considered managers for pricing access
  },

  isSalesRep() {
    return this.isAuthenticated();
  },

  isStaff() {
    return this.isAuthenticated();
  }
};

export { authService };