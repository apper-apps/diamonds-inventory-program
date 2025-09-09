import { customerService } from "./customerService";
import { productService } from "./productService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient
// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

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
    try {
      await delay(500);
      const apperClient = getApperClient();
      
      // Get customer details
      const customer = await customerService.getById(saleData.customerId);
      
      // Generate invoice number
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
      const saleDate = new Date().toISOString();
      
      const params = {
        records: [
          {
            Name: `Sale-${invoiceNumber}`,
            invoice_number_c: invoiceNumber,
            customer_id_c: parseInt(saleData.customerId),
            items_c: JSON.stringify(saleData.items),
            subtotal_c: parseFloat(saleData.subtotal) || 0,
            gst_amount_c: parseFloat(saleData.gstAmount) || 0,
            total_amount_c: parseFloat(saleData.totalAmount) || 0,
            sale_date_c: saleDate,
            status_c: 'completed',
            payment_method_c: saleData.paymentMethod || 'cash',
            created_at_c: saleDate,
            updated_at_c: saleDate
          }
        ]
      };
      
      const response = await apperClient.createRecord('sale_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create sale ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const saleRecord = successfulRecords[0].data;
          
          // Create invoice data
          const invoiceData = {
            Id: saleRecord.Id,
            invoiceNumber: saleRecord.invoice_number_c,
            customerId: saleRecord.customer_id_c,
            customer: customer,
            items: saleData.items,
            subtotal: parseFloat(saleRecord.subtotal_c) || 0,
            gstAmount: parseFloat(saleRecord.gst_amount_c) || 0,
            totalAmount: parseFloat(saleRecord.total_amount_c) || 0,
            saleDate: saleRecord.sale_date_c,
            status: saleRecord.status_c,
            paymentMethod: saleRecord.payment_method_c,
            company: COMPANY_DETAILS,
            invoiceDate: new Date(saleRecord.sale_date_c).toLocaleDateString('en-IN', {
              timeZone: 'Asia/Kolkata'
            }),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
              timeZone: 'Asia/Kolkata'
            }),
            gstRate: 3.0,
            // Add product details to items
            itemsWithDetails: await Promise.all(
              saleData.items.map(async (item) => {
                try {
                  const product = await productService.getById(item.productId);
                  return {
                    ...item,
                    name: product.name,
                    description: product.description,
                    barcode: product.barcode,
                    category: product.category
                  };
                } catch (error) {
                  console.warn(`Failed to get product details for ID ${item.productId}:`, error);
                  return {
                    ...item,
                    name: `Product #${item.productId}`,
                    description: '',
                    barcode: '',
                    category: ''
                  };
                }
              })
            )
          };
          
          return invoiceData;
        }
      }
      
      throw new Error("Failed to create sale");
      
    } catch (error) {
      console.error('Error creating sale:', error?.response?.data?.message || error.message);
      throw new Error('Failed to create sale');
    }
},

  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "invoice_number_c" } },
          { field: { Name: "customer_id_c" } },
          { field: { Name: "items_c" } },
          { field: { Name: "subtotal_c" } },
          { field: { Name: "gst_amount_c" } },
          { field: { Name: "total_amount_c" } },
          { field: { Name: "sale_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "payment_method_c" } }
        ],
        orderBy: [
          {
            fieldName: "sale_date_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('sale_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(item => ({
        Id: item.Id,
        invoiceNumber: item.invoice_number_c || '',
        customerId: item.customer_id_c?.Id || item.customer_id_c,
        items: item.items_c ? (typeof item.items_c === 'string' ? JSON.parse(item.items_c) : item.items_c) : [],
        subtotal: parseFloat(item.subtotal_c) || 0,
        gstAmount: parseFloat(item.gst_amount_c) || 0,
        totalAmount: parseFloat(item.total_amount_c) || 0,
        saleDate: item.sale_date_c || '',
        status: item.status_c || '',
        paymentMethod: item.payment_method_c || ''
      })) || [];
      
    } catch (error) {
      console.error("Error fetching sales:", error?.response?.data?.message || error.message);
      return [];
    }
},

  async getById(id) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "invoice_number_c" } },
          { field: { Name: "customer_id_c" } },
          { field: { Name: "items_c" } },
          { field: { Name: "subtotal_c" } },
          { field: { Name: "gst_amount_c" } },
          { field: { Name: "total_amount_c" } },
          { field: { Name: "sale_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "payment_method_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('sale_c', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || "Sale not found");
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        invoiceNumber: item.invoice_number_c || '',
        customerId: item.customer_id_c?.Id || item.customer_id_c,
        items: item.items_c ? (typeof item.items_c === 'string' ? JSON.parse(item.items_c) : item.items_c) : [],
        subtotal: parseFloat(item.subtotal_c) || 0,
        gstAmount: parseFloat(item.gst_amount_c) || 0,
        totalAmount: parseFloat(item.total_amount_c) || 0,
        saleDate: item.sale_date_c || '',
        status: item.status_c || '',
        paymentMethod: item.payment_method_c || ''
      };
      
    } catch (error) {
      console.error("Error fetching sale:", error?.response?.data?.message || error.message);
      throw error;
    }
},

  async getByInvoiceNumber(invoiceNumber) {
    try {
      await delay(200);
      if (!invoiceNumber?.trim()) {
        return null;
      }
      
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "invoice_number_c" } },
          { field: { Name: "customer_id_c" } }
        ],
        where: [
          {
            FieldName: "invoice_number_c",
            Operator: "EqualTo",
            Values: [invoiceNumber]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('sale_c', params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }
      
      const item = response.data[0];
      return {
        Id: item.Id,
        invoiceNumber: item.invoice_number_c || '',
        customerId: item.customer_id_c?.Id || item.customer_id_c
      };
      
    } catch (error) {
      console.error("Error fetching sale by invoice:", error?.response?.data?.message || error.message);
      return null;
    }
  },

async getCustomerSales(customerId) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "total_amount_c" } },
          { field: { Name: "sale_date_c" } }
        ],
        where: [
          {
            FieldName: "customer_id_c",
            Operator: "EqualTo",
            Values: [parseInt(customerId)]
          }
        ],
        orderBy: [
          {
            fieldName: "sale_date_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('sale_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(item => ({
        Id: item.Id,
        totalAmount: parseFloat(item.total_amount_c) || 0,
        saleDate: item.sale_date_c || ''
      })) || [];
      
    } catch (error) {
      console.error("Error fetching customer sales:", error?.response?.data?.message || error.message);
      return [];
    }
},

  async getSalesStats() {
    try {
      await delay(400);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "total_amount_c" } },
          { field: { Name: "sale_date_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('sale_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          today: { count: 0, total: 0 },
          week: { count: 0, total: 0 },
          month: { count: 0, total: 0 },
          total: { count: 0, total: 0 }
        };
      }
      
      const sales = response.data || [];
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // Today's sales
      const todaySales = sales.filter(sale => {
        const saleDate = new Date(sale.sale_date_c);
        const saleDateStart = new Date(saleDate.getFullYear(), saleDate.getMonth(), saleDate.getDate());
        return saleDateStart.getTime() === todayStart.getTime();
      });
      const todayTotal = todaySales.reduce((sum, sale) => sum + (parseFloat(sale.total_amount_c) || 0), 0);
      
      // This week's sales
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekSales = sales.filter(sale => {
        const saleDate = new Date(sale.sale_date_c);
        return saleDate >= weekStart;
      });
      const weekTotal = weekSales.reduce((sum, sale) => sum + (parseFloat(sale.total_amount_c) || 0), 0);
      
      // This month's sales
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.sale_date_c);
        return saleDate >= monthStart;
      });
      const monthTotal = monthSales.reduce((sum, sale) => sum + (parseFloat(sale.total_amount_c) || 0), 0);
      
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
          total: sales.reduce((sum, sale) => sum + (parseFloat(sale.total_amount_c) || 0), 0)
        }
      };
      
    } catch (error) {
      console.error("Error fetching sales stats:", error?.response?.data?.message || error.message);
      return {
        today: { count: 0, total: 0 },
        week: { count: 0, total: 0 },
        month: { count: 0, total: 0 },
        total: { count: 0, total: 0 }
      };
    }
  }
};