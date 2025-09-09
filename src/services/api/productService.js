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

  // Recalculate product prices based on current pricing rules
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
        if (product.gold_type_c && product.weight_c && product.weight_c > 0) {
          const newPrice = pricingService.calculateProductPrice(
            product.gold_type_c,
            product.diamond_type_c || '',
            product.weight_c,
            product.diamond_weight_c || 0,
            product.diamond_quality_c || 'SI',
            product.diamond_color_c || 'F-G'
          );
          
          if (newPrice !== product.price_c) {
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
        const params = { records: updates };
        const response = await this.apperClient.updateRecord(this.tableName, params);
        
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
      if (error?.response?.data?.message) {
        console.error("Error recalculating product prices:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error recalculating product prices:", error);
        throw error;
      }
    }
  }
}

// Export service instance
export const productService = new ProductService();