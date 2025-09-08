import customersData from '@/services/mockData/customers.json';

// Simulate localStorage for persistent data
const CUSTOMERS_KEY = 'customers_data';

function getStoredCustomers() {
  try {
    const stored = localStorage.getItem(CUSTOMERS_KEY);
    return stored ? JSON.parse(stored) : [...customersData];
  } catch (error) {
    console.warn('Error loading customers from localStorage:', error);
    return [...customersData];
  }
}

function setStoredCustomers(customers) {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (error) {
    console.warn('Error saving customers to localStorage:', error);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const customerService = {
  async getAll() {
    await delay(200);
    return [...getStoredCustomers()];
  },

  async getById(id) {
    await delay(150);
    const customers = getStoredCustomers();
    const customer = customers.find(c => c.Id === parseInt(id));
    if (!customer) {
      throw new Error('Customer not found');
    }
    return { ...customer };
  },

  async create(customerData) {
    await delay(400);
    const customers = getStoredCustomers();
    
    // Generate new ID
    const newId = Math.max(...customers.map(c => c.Id), 0) + 1;
    
    const newCustomer = {
      Id: newId,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address || '',
      city: customerData.city || '',
      state: customerData.state || '',
      pincode: customerData.pincode || '',
      gstNumber: customerData.gstNumber || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    customers.push(newCustomer);
    setStoredCustomers(customers);
    
    return { ...newCustomer };
  },

  async update(id, customerData) {
    await delay(350);
    const customers = getStoredCustomers();
    const index = customers.findIndex(c => c.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    const updatedCustomer = {
      ...customers[index],
      ...customerData,
      Id: customers[index].Id, // Preserve ID
      updatedAt: new Date().toISOString()
    };
    
    customers[index] = updatedCustomer;
    setStoredCustomers(customers);
    
    return { ...updatedCustomer };
  },

  async delete(id) {
    await delay(300);
    const customers = getStoredCustomers();
    const index = customers.findIndex(c => c.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    customers.splice(index, 1);
    setStoredCustomers(customers);
    
    return { success: true };
  },

  async search(query) {
    await delay(200);
    const customers = getStoredCustomers();
    
    if (!query) return customers;
    
    const searchTerm = query.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      (customer.gstNumber && customer.gstNumber.toLowerCase().includes(searchTerm))
    );
  },

  async getByGST(gstNumber) {
    await delay(200);
    const customers = getStoredCustomers();
    return customers.find(customer => 
      customer.gstNumber && 
      customer.gstNumber.toLowerCase() === gstNumber.toLowerCase()
    ) || null;
  }
};