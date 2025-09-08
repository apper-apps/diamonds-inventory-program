import categoriesData from "@/services/mockData/categories.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay(200);
    return [...categoriesData];
  },

  async getById(id) {
    await delay(150);
    const category = categoriesData.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  }
};