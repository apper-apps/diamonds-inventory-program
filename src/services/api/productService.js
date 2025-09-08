import productsData from "@/services/mockData/products.json";

const STORAGE_KEY = "4c-diamonds-products";

const getStoredProducts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [...productsData];
};

const setStoredProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  getByBarcode: async (barcode) => {
    await delay(300); // Simulate API delay
    const products = getStoredProducts();
    return products.find(product => product.barcode === barcode) || null;
  },
  async getAll() {
    await delay(300);
    return [...getStoredProducts()];
  },

  async getById(id) {
    await delay(250);
    const products = getStoredProducts();
    const product = products.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
},

  async create(productData) {
    await delay(400);
    const products = getStoredProducts();
const maxId = Math.max(...products.map(p => parseInt(p.Id) || 0), 0);
const newProduct = {
      ...productData,
      Id: maxId + 1,
      status: productData.status || "Available",
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updatedProducts = [...products, newProduct];
    setStoredProducts(updatedProducts);
    return { ...newProduct };
  },

  async update(id, productData) {
    await delay(350);
    const products = getStoredProducts();
const index = products.findIndex(p => parseInt(p.Id) === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
const updatedProduct = { ...products[index], ...productData };
    products[index] = updatedProduct;
    setStoredProducts(products);
    return { ...updatedProduct };
  },

  async delete(id) {
    await delay(300);
const products = getStoredProducts();
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    products.splice(index, 1);
    setStoredProducts(products);
    return true;
},
async updateInventoryStatus(id, status) {
await delay(300);
    const products = getStoredProducts();
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    const updatedProduct = { 
      ...products[index], 
      status,
      lastSoldDate: status === 'Sold' ? new Date().toISOString().split('T')[0] : undefined
    };
    products[index] = updatedProduct;
    setStoredProducts(products);
    return { ...updatedProduct };
  },

  async recalculateProductPrices() {
    await delay(500);
    const { pricingService } = await import('./pricingService');
    const products = getStoredProducts();
    
    let updatedCount = 0;
    const updatedProducts = products.map(product => {
if (product.goldType && product.weight && product.weight > 0) {
        const newPrice = pricingService.calculateProductPrice(
          product.goldType,
          product.diamondType,
          product.weight,
          product.diamondWeight || 0,
          product.diamondQuality || 'SI',
product.diamondColor || 'F-G'
        );
        
        if (newPrice !== product.price) {
          updatedCount++;
          return { ...product, price: newPrice };
        }
      }
      return product;
    });
    
    if (updatedCount > 0) {
      setStoredProducts(updatedProducts);
    }
    
    return {
      success: true,
      message: `Updated prices for ${updatedCount} products`,
      updatedCount
    };
  }
};