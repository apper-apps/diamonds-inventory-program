import React from "react";
import Error from "@/components/ui/Error";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const categoryService = {
  async getAll() {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data?.map(item => ({
        Id: item.Id,
        name: item.Name || '',
        description: item.description_c || ''
      })) || [];
      
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error.message);
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
          { field: { Name: "description_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('category_c', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || "Category not found");
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name || '',
        description: item.description_c || ''
      };
      
    } catch (error) {
      console.error("Error fetching category:", error?.response?.data?.message || error.message);
      throw error;
    }
}
};