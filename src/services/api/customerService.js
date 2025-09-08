const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const customerService = {
  async getAll() {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "pincode_c" } },
          { field: { Name: "gst_number_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('customer_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(item => ({
        Id: item.Id,
        name: item.Name || '',
        email: item.email_c || '',
        phone: item.phone_c || '',
        address: item.address_c || '',
        city: item.city_c || '',
        state: item.state_c || '',
        pincode: item.pincode_c || '',
        gstNumber: item.gst_number_c || '',
        createdAt: item.created_at_c || new Date().toISOString(),
        updatedAt: item.updated_at_c || new Date().toISOString()
      })) || [];
      
    } catch (error) {
      console.error("Error fetching customers:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(150);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "pincode_c" } },
          { field: { Name: "gst_number_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('customer_c', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || "Customer not found");
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name || '',
        email: item.email_c || '',
        phone: item.phone_c || '',
        address: item.address_c || '',
        city: item.city_c || '',
        state: item.state_c || '',
        pincode: item.pincode_c || '',
        gstNumber: item.gst_number_c || ''
      };
      
    } catch (error) {
      console.error("Error fetching customer:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(customerData) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      
      const params = {
        records: [
          {
            Name: customerData.name,
            email_c: customerData.email || '',
            phone_c: customerData.phone || '',
            address_c: customerData.address || '',
            city_c: customerData.city || '',
            state_c: customerData.state || '',
            pincode_c: customerData.pincode || '',
            gst_number_c: customerData.gstNumber || '',
            created_at_c: new Date().toISOString(),
            updated_at_c: new Date().toISOString()
          }
        ]
      };
      
      const response = await apperClient.createRecord('customer_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create customer ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
            email: item.email_c || '',
            phone: item.phone_c || '',
            address: item.address_c || '',
            city: item.city_c || '',
            state: item.state_c || '',
            pincode: item.pincode_c || '',
            gstNumber: item.gst_number_c || ''
          };
        }
      }
      
      throw new Error("Failed to create customer");
      
    } catch (error) {
      console.error("Error creating customer:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, customerData) {
    try {
      await delay(350);
      const apperClient = getApperClient();
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: customerData.name,
            email_c: customerData.email || '',
            phone_c: customerData.phone || '',
            address_c: customerData.address || '',
            city_c: customerData.city || '',
            state_c: customerData.state || '',
            pincode_c: customerData.pincode || '',
            gst_number_c: customerData.gstNumber || '',
            updated_at_c: new Date().toISOString()
          }
        ]
      };
      
      const response = await apperClient.updateRecord('customer_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update customer ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
            email: item.email_c || '',
            phone: item.phone_c || '',
            address: item.address_c || '',
            city: item.city_c || '',
            state: item.state_c || '',
            pincode: item.pincode_c || '',
            gstNumber: item.gst_number_c || ''
          };
        }
      }
      
      throw new Error("Failed to update customer");
      
    } catch (error) {
      console.error("Error updating customer:", error?.response?.data?.message || error.message);
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
      
      const response = await apperClient.deleteRecord('customer_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete customer ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }
      
      return { success: true };
      
    } catch (error) {
      console.error("Error deleting customer:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async search(query) {
    try {
      await delay(200);
      if (!query) {
        return this.getAll();
      }
      
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "gst_number_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "email_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "phone_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "gst_number_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('customer_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(item => ({
        Id: item.Id,
        name: item.Name || '',
        email: item.email_c || '',
        phone: item.phone_c || '',
        gstNumber: item.gst_number_c || ''
      })) || [];
      
    } catch (error) {
      console.error("Error searching customers:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getByGST(gstNumber) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "gst_number_c" } }
        ],
        where: [
          {
            FieldName: "gst_number_c",
            Operator: "EqualTo",
            Values: [gstNumber]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('customer_c', params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }
      
      const item = response.data[0];
      return {
        Id: item.Id,
        name: item.Name || '',
        email: item.email_c || '',
        phone: item.phone_c || '',
        gstNumber: item.gst_number_c || ''
      };
      
    } catch (error) {
      console.error("Error fetching customer by GST:", error?.response?.data?.message || error.message);
      return null;
    }
}
};