import { customerService } from './customerService';
import { productService } from './productService';

// Simulate localStorage for persistent sales data
const SALES_KEY = 'sales_data';
const INVOICE_COUNTER_KEY = 'invoice_counter';

function getStoredSales() {
  try {
    const stored = localStorage.getItem(SALES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error loading sales from localStorage:', error);
    return [];
  }
}

function setStoredSales(sales) {
  try {
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  } catch (error) {
    console.warn('Error saving sales to localStorage:', error);
  }
}

function getNextInvoiceNumber() {
  try {
    const stored = localStorage.getItem(INVOICE_COUNTER_KEY);
    const counter = stored ? parseInt(stored) : 1000;
    const nextNumber = counter + 1;
    localStorage.setItem(INVOICE_COUNTER_KEY, nextNumber.toString());
    return `INV-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;
  } catch (error) {
    console.warn('Error generating invoice number:', error);
    return `INV-${new Date().getFullYear()}-${Date.now()}`;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Company details for invoicing
const COMPANY_DETAILS = {
  name: "4C Diamonds",
  address: "123 Diamond Street, Jewelry District",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  phone: "+91 98765 43210",
  email: "info@4cdiamonds.com",
  gstNumber: "27ABCDE1234F1Z5",
  website: "www.4cdiamonds.com"
};

export const salesService = {
  async createSale(saleData) {
    await delay(500);
    
    try {
      // Get customer details
      const customer = await customerService.getById(saleData.customerId);
      
      // Generate invoice number
      const invoiceNumber = getNextInvoiceNumber();
      const saleDate = new Date().toISOString();
      
      // Create sale record
      const sale = {
        Id: Date.now(),
        invoiceNumber,
        customerId: saleData.customerId,
        customer: customer,
        items: saleData.items,
        subtotal: saleData.subtotal,
        gstAmount: saleData.gstAmount,
        totalAmount: saleData.totalAmount,
        saleDate,
        status: 'completed',
        paymentMethod: 'cash', // Default for now
        createdAt: saleDate,
        updatedAt: saleDate
      };
      
      // Save sale
      const sales = getStoredSales();
      sales.push(sale);
      setStoredSales(sales);
      
      // Create invoice data
      const invoiceData = {
        ...sale,
        company: COMPANY_DETAILS,
        invoiceDate: new Date(saleDate).toLocaleDateString('en-IN'),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        gstRate: 3.0,
        // Add product details to items
        itemsWithDetails: await Promise.all(
          saleData.items.map(async (item) => {
            const product = await productService.getById(item.productId);
            return {
              ...item,
              name: product.name,
              description: product.description,
              barcode: product.barcode,
              category: product.category
            };
          })
        )
      };
      
      return invoiceData;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw new Error('Failed to create sale');
    }
  },

  async getAll() {
    await delay(300);
    return [...getStoredSales()];
  },

  async getById(id) {
    await delay(200);
    const sales = getStoredSales();
    const sale = sales.find(s => s.Id === parseInt(id));
    if (!sale) {
      throw new Error('Sale not found');
    }
    return { ...sale };
  },

  async getByInvoiceNumber(invoiceNumber) {
    await delay(200);
    const sales = getStoredSales();
    const sale = sales.find(s => s.invoiceNumber === invoiceNumber);
    return sale ? { ...sale } : null;
  },

  async getSalesByCustomer(customerId) {
    await delay(300);
    const sales = getStoredSales();
    return sales.filter(sale => sale.customerId === parseInt(customerId));
  },

  async getSalesByDateRange(startDate, endDate) {
    await delay(300);
    const sales = getStoredSales();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate >= start && saleDate <= end;
    });
  },

  async getTodaysSales() {
    await delay(200);
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    return this.getSalesByDateRange(startOfDay, endOfDay);
  },

  async getSalesStats() {
    await delay(400);
    const sales = getStoredSales();
    const today = new Date();
    
    // Today's sales
    const todaySales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate.toDateString() === today.toDateString();
    });
    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    // This week's sales
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekSales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate >= weekStart;
    });
    const weekTotal = weekSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    // This month's sales
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthSales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate >= monthStart;
    });
    const monthTotal = monthSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    return {
      today: {
        count: todaySales.length,
        total: todayTotal
      },
      week: {
        count: weekSales.length,
        total: weekTotal
      },
      month: {
        count: monthSales.length,
        total: monthTotal
      },
      total: {
        count: sales.length,
        total: sales.reduce((sum, sale) => sum + sale.totalAmount, 0)
      }
    };
  }
};