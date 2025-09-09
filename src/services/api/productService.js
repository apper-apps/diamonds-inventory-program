// Delay utility for development
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize ApperClient
function getApperClient() {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
}

class ProductService {
  constructor() {
    this.tableName = 'product_c';
    this.apperClient = getApperClient();
  }

  // Get all products
  async getAll() {
    try {
      await delay(300);
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "gold_type_c" } },
          { field: { Name: "diamond_type_c" } },
          { field: { Name: "diamond_quality_c" } },
          { field: { Name: "diamond_color_c" } },
          { field: { Name: "certificate_number_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "diamond_weight_c" } },
          { field: { Name: "dimensions_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "barcode_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "making_charge_c" } },
          { field: { Name: "labour_charge_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          {
            fieldName: "ModifiedOn",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching products:", error);
        throw error;
      }
    }
  }

  // Get product by ID
  async getById(id) {
    try {
      await delay(200);
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "gold_type_c" } },
          { field: { Name: "diamond_type_c" } },
          { field: { Name: "diamond_quality_c" } },
          { field: { Name: "diamond_color_c" } },
          { field: { Name: "certificate_number_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "diamond_weight_c" } },
          { field: { Name: "dimensions_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "barcode_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "making_charge_c" } },
          { field: { Name: "labour_charge_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching product with ID ${id}:`, error);
        throw error;
      }
    }
  }

  // Create new product
  async create(productData) {
    try {
      await delay(500);
      
      // Only include Updateable fields in create operation
      const params = {
        records: [
          {
            Name: productData.Name,
            category_c: productData.category_c,
            gold_type_c: productData.gold_type_c,
            diamond_type_c: productData.diamond_type_c || '',
            diamond_quality_c: productData.diamond_quality_c || '',
            diamond_color_c: productData.diamond_color_c || '',
            certificate_number_c: productData.certificate_number_c || '',
            weight_c: parseFloat(productData.weight_c) || 0,
            diamond_weight_c: parseFloat(productData.diamond_weight_c) || 0,
            dimensions_c: productData.dimensions_c || '',
            specifications_c: productData.specifications_c || '',
            price_c: parseFloat(productData.price_c) || 0,
            description_c: productData.description_c,
            status_c: productData.status_c || 'Available',
            barcode_c: productData.barcode_c || this.generateBarcode(),
            images_c: productData.images_c || '',
            making_charge_c: parseFloat(productData.making_charge_c) || 0,
            labour_charge_c: parseFloat(productData.labour_charge_c) || 0,
            Tags: productData.Tags || ''
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} product records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating product:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating product:", error);
        throw error;
      }
    }
  }

  // Update existing product
  async update(id, productData) {
    try {
      await delay(400);
      
      // Only include Updateable fields in update operation
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: productData.Name,
            category_c: productData.category_c,
            gold_type_c: productData.gold_type_c,
            diamond_type_c: productData.diamond_type_c || '',
            diamond_quality_c: productData.diamond_quality_c || '',
            diamond_color_c: productData.diamond_color_c || '',
            certificate_number_c: productData.certificate_number_c || '',
            weight_c: parseFloat(productData.weight_c) || 0,
            diamond_weight_c: parseFloat(productData.diamond_weight_c) || 0,
            dimensions_c: productData.dimensions_c || '',
            specifications_c: productData.specifications_c || '',
            price_c: parseFloat(productData.price_c) || 0,
            description_c: productData.description_c,
            status_c: productData.status_c || 'Available',
            barcode_c: productData.barcode_c,
            images_c: productData.images_c || '',
            making_charge_c: parseFloat(productData.making_charge_c) || 0,
            labour_charge_c: parseFloat(productData.labour_charge_c) || 0,
            Tags: productData.Tags || ''
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} product records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating product:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating product:", error);
        throw error;
      }
    }
  }

  // Delete product
  async delete(id) {
    try {
      await delay(300);
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} product records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting product:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting product:", error);
        throw error;
      }
    }
  }

  // Get product by barcode
  async getByBarcode(barcode) {
    try {
      await delay(300);
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "barcode_c" } }
        ],
        where: [
          {
            FieldName: "barcode_c",
            Operator: "EqualTo",
            Values: [barcode],
            Include: true
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching product by barcode:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching product by barcode:", error);
        throw error;
      }
    }
  }

  // Generate barcode
  generateBarcode() {
    const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    return `4CD-${randomDigits}`;
  }
}

// Export service instance
export const productService = new ProductService();
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const productService = {
  async getAll() {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "category_c" } },
          { field: { Name: "gold_type_c" } },
          { field: { Name: "diamond_type_c" } },
          { field: { Name: "diamond_quality_c" } },
          { field: { Name: "diamond_color_c" } },
          { field: { Name: "certificate_number_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "diamond_weight_c" } },
          { field: { Name: "dimensions_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "barcode_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "last_sold_date_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(item => ({
        Id: item.Id,
        name: item.Name || '',
        category: item.category_c || '',
        goldType: item.gold_type_c || '',
        diamondType: item.diamond_type_c || '',
        diamondQuality: item.diamond_quality_c || '',
        diamondColor: item.diamond_color_c || '',
        certificateNumber: item.certificate_number_c || '',
        weight: item.weight_c || 0,
        diamondWeight: item.diamond_weight_c || 0,
        dimensions: item.dimensions_c || '',
        specifications: item.specifications_c || '',
        price: item.price_c || 0,
        description: item.description_c || '',
        status: item.status_c || 'Available',
        barcode: item.barcode_c || '',
        images: item.images_c || '',
        createdAt: item.created_at_c || '',
        lastSoldDate: item.last_sold_date_c || ''
      })) || [];
      
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error.message);
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
          { field: { Name: "category_c" } },
          { field: { Name: "gold_type_c" } },
          { field: { Name: "diamond_type_c" } },
          { field: { Name: "diamond_quality_c" } },
          { field: { Name: "diamond_color_c" } },
          { field: { Name: "certificate_number_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "diamond_weight_c" } },
          { field: { Name: "dimensions_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "barcode_c" } },
          { field: { Name: "images_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('product_c', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || "Product not found");
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name || '',
        category: item.category_c || '',
        goldType: item.gold_type_c || '',
        diamondType: item.diamond_type_c || '',
        diamondQuality: item.diamond_quality_c || '',
        diamondColor: item.diamond_color_c || '',
        certificateNumber: item.certificate_number_c || '',
        weight: item.weight_c || 0,
        diamondWeight: item.diamond_weight_c || 0,
        dimensions: item.dimensions_c || '',
        specifications: item.specifications_c || '',
        price: item.price_c || 0,
        description: item.description_c || '',
        status: item.status_c || 'Available',
        barcode: item.barcode_c || '',
        images: item.images_c || ''
      };
      
    } catch (error) {
      console.error("Error fetching product:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getByBarcode(barcode) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "barcode_c" } },
          { field: { Name: "description_c" } }
        ],
        where: [
          {
            FieldName: "barcode_c",
            Operator: "EqualTo",
            Values: [barcode]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }
      
      const item = response.data[0];
      return {
        Id: item.Id,
        name: item.Name || '',
        category: item.category_c || '',
        price: item.price_c || 0,
        status: item.status_c || 'Available',
        barcode: item.barcode_c || '',
        description: item.description_c || ''
      };
      
    } catch (error) {
      console.error("Error fetching product by barcode:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async create(productData) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        records: [
          {
            Name: productData.name || productData.Name,
            category_c: productData.category,
            gold_type_c: productData.goldType,
            diamond_type_c: productData.diamondType || '',
            diamond_quality_c: productData.diamondQuality || '',
            diamond_color_c: productData.diamondColor || '',
            certificate_number_c: productData.certificateNumber || '',
            weight_c: parseFloat(productData.weight) || 0,
            diamond_weight_c: parseFloat(productData.diamondWeight) || 0,
            dimensions_c: productData.dimensions || '',
            specifications_c: productData.specifications || '',
            price_c: parseFloat(productData.price) || 0,
            description_c: productData.description || '',
            status_c: productData.status || 'Available',
            barcode_c: productData.barcode || '',
            images_c: productData.images || '',
            created_at_c: new Date().toISOString().split('T')[0]
          }
        ]
      };
      
      const response = await apperClient.createRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create product ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const item = successfulRecords[0].data;
          return {
            Id: item.Id,
            name: item.Name || '',
            category: item.category_c || '',
            goldType: item.gold_type_c || '',
            diamondType: item.diamond_type_c || '',
            diamondQuality: item.diamond_quality_c || '',
            diamondColor: item.diamond_color_c || '',
            certificateNumber: item.certificate_number_c || '',
            weight: item.weight_c || 0,
            diamondWeight: item.diamond_weight_c || 0,
            dimensions: item.dimensions_c || '',
            specifications: item.specifications_c || '',
            price: item.price_c || 0,
            description: item.description_c || '',
            status: item.status_c || 'Available',
            barcode: item.barcode_c || '',
            images: item.images_c || ''
          };
        }
      }
      
      throw new Error("Failed to create product");
      
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, productData) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: productData.name || productData.Name,
            category_c: productData.category,
            gold_type_c: productData.goldType,
            diamond_type_c: productData.diamondType || '',
            diamond_quality_c: productData.diamondQuality || '',
            diamond_color_c: productData.diamondColor || '',
            certificate_number_c: productData.certificateNumber || '',
            weight_c: parseFloat(productData.weight) || 0,
            diamond_weight_c: parseFloat(productData.diamondWeight) || 0,
            dimensions_c: productData.dimensions || '',
            specifications_c: productData.specifications || '',
            price_c: parseFloat(productData.price) || 0,
            description_c: productData.description || '',
            status_c: productData.status || 'Available',
            barcode_c: productData.barcode || '',
            images_c: productData.images || ''
          }
        ]
      };
      
      const response = await apperClient.updateRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update product ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const item = successfulRecords[0].data;
          return {
            Id: item.Id,
            name: item.Name || '',
            category: item.category_c || '',
            goldType: item.gold_type_c || '',
            diamondType: item.diamond_type_c || '',
            diamondQuality: item.diamond_quality_c || '',
            diamondColor: item.diamond_color_c || '',
            certificateNumber: item.certificate_number_c || '',
            weight: item.weight_c || 0,
            diamondWeight: item.diamond_weight_c || 0,
            dimensions: item.dimensions_c || '',
            specifications: item.specifications_c || '',
            price: item.price_c || 0,
            description: item.description_c || '',
            status: item.status_c || 'Available',
            barcode: item.barcode_c || '',
            images: item.images_c || ''
          };
        }
      }
      
      throw new Error("Failed to update product");
      
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete product ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }
      
      return true;
      
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async updateInventoryStatus(id, status) {
    return this.update(id, { status });
  },
async recalculateProductPrices() {
    try {
      await delay(500);
      
      // Get all products
      const products = await this.getAll();
      
      // Import pricing service
      const { pricingService } = await import('./pricingService.js');
      
      let updatedCount = 0;
      const updates = [];
      
      // Calculate new prices for each product
      for (const product of products) {
        if (product.goldType && product.weight && product.weight > 0) {
          const newPrice = pricingService.calculateProductPrice(
            product.goldType,
            product.diamondType || '',
            product.weight,
            product.diamondWeight || 0,
            product.diamondQuality || 'SI',
            product.diamondColor || 'F-G'
          );
          
          if (newPrice !== product.price) {
            updates.push({
              Id: product.Id,
              price_c: newPrice
            });
            updatedCount++;
          }
        }
      }
      
      // Batch update products with new prices
      if (updates.length > 0) {
        const apperClient = getApperClient();
        const params = { records: updates };
        const response = await apperClient.updateRecord('product_c', params);
        
        if (!response.success) {
          throw new Error(response.message);
        }
      }
      
      return {
        success: true,
        message: `Successfully recalculated prices for ${updatedCount} products`,
        updatedCount
      };
    } catch (error) {
      console.error("Error recalculating product prices:", error);
      throw error;
    }
  }
};