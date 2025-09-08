const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const dashboardService = {
  async getStats() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "total_products_c" } },
          { field: { Name: "total_value_c" } },
          { field: { Name: "low_stock_items_c" } },
          { field: { Name: "recent_sales_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('dashboard_stats_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          totalProducts: 0,
          totalValue: 0,
          lowStockItems: 0,
          recentSales: 0
        };
      }
      
      const stats = response.data?.[0];
      return {
        totalProducts: stats?.total_products_c || 0,
        totalValue: stats?.total_value_c || 0,
        lowStockItems: stats?.low_stock_items_c || 0,
        recentSales: stats?.recent_sales_c || 0
      };
      
    } catch (error) {
      console.error("Error fetching dashboard stats:", error?.response?.data?.message || error.message);
      return {
        totalProducts: 0,
        totalValue: 0,
        lowStockItems: 0,
        recentSales: 0
      };
    }
  }
};