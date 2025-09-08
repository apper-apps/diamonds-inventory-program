// Mock user data
const users = [
  {
    Id: 1,
    username: "manager",
    password: "manager123",
    name: "Store Manager",
    role: "Manager",
    permissions: ["all"]
  },
  {
    Id: 2,
    username: "sales1",
    password: "sales123",
    name: "Sales Representative",
    role: "Sales",
    permissions: ["products", "customers", "sales"]
  },
  {
    Id: 3,
    username: "staff1",
    password: "staff123",
    name: "Store Staff",
    role: "Staff",
    permissions: ["products", "inventory"]
  }
];

// Current user session
let currentUser = null;

// Utility functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const authService = {
  // Authentication
  async login(username, password) {
    await delay(800);
    
    const user = users.find(u => 
      u.username === username && u.password === password
    );
    
    if (!user) {
      throw new Error("Invalid username or password");
    }
    
    currentUser = { ...user };
    delete currentUser.password; // Don't store password in session
    
    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return currentUser;
  },

  async logout() {
    await delay(200);
    currentUser = null;
    localStorage.removeItem('currentUser');
    return true;
  },

  // Get current user
  getCurrentUser() {
    if (currentUser) {
      return currentUser;
    }
    
    // Try to restore from localStorage
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        currentUser = JSON.parse(stored);
        return currentUser;
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    
    return null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  // Check if user has specific permission
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    return user.permissions.includes('all') || 
           user.permissions.includes(permission);
  },

  // Role-based access control
  isManager() {
    const user = this.getCurrentUser();
    return user && user.role === 'Manager';
  },

  isSalesRep() {
    const user = this.getCurrentUser();
    return user && user.role === 'Sales';
  },

  isStaff() {
    const user = this.getCurrentUser();
    return user && user.role === 'Staff';
  },

  // Get all users (Manager only)
  async getAllUsers() {
    await delay(400);
    
    if (!this.isManager()) {
      throw new Error("Access denied. Manager role required.");
    }
    
    return users.map(user => ({ ...user, password: undefined }));
  },

  // Update user profile
  async updateProfile(userData) {
    await delay(600);
    
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error("Not authenticated");
    }
    
    // Update current user
    const updatedUser = { ...user, ...userData };
    currentUser = updatedUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return updatedUser;
  }
};

export { authService };