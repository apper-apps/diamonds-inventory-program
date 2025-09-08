// Mock data for daily pricing rates
let goldRates = {
  "14k": 4200,
  "18k": 4800,
  "22k": 5200,
  "24k": 5600,
  "silver": 80
};

// Diamond base rates (per carat)
let diamondRates = {
  "round-brilliant": 125000,
  "marquise": 108000,
  "princess": 110000,
  "baguette": 95000
};

// Diamond quality multipliers
const diamondQualityMultipliers = {
  "SI": 1.0,
  "VS-SI": 1.2,
  "VS": 1.4,
  "VS-VVS": 1.6,
  "VVS": 1.8,
  "IF": 2.2
};

// Diamond color multipliers
const diamondColorMultipliers = {
  "F-G": 1.0,
  "G-H": 0.9,
  "E-F": 1.3
};

// Utility functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const pricingService = {
  // Get current rates
  async getGoldRates() {
    await delay(300);
    return { ...goldRates };
  },

  async getDiamondRates() {
    await delay(300);
    return { ...diamondRates };
  },

  async getAllRates() {
    await delay(300);
    return {
      gold: { ...goldRates },
      diamond: { ...diamondRates },
      lastUpdated: localStorage.getItem('ratesLastUpdated') || new Date().toISOString()
    };
  },

  // Update rates
  async updateGoldRates(newRates) {
    await delay(500);
    goldRates = { ...goldRates, ...newRates };
    localStorage.setItem('goldRates', JSON.stringify(goldRates));
    localStorage.setItem('ratesLastUpdated', new Date().toISOString());
    return { ...goldRates };
  },

  async updateDiamondRates(newRates) {
    await delay(500);
    diamondRates = { ...diamondRates, ...newRates };
    localStorage.setItem('diamondRates', JSON.stringify(diamondRates));
    localStorage.setItem('ratesLastUpdated', new Date().toISOString());
    return { ...diamondRates };
  },
// Calculate product price based on specifications
  calculateProductPrice(goldType, diamondType, weight, diamondWeight = 0, diamondQuality = 'SI', diamondColor = 'F-G') {
    const goldPrice = goldRates[goldType] || 0;
    const baseDiamondPrice = diamondRates[diamondType] || 0;
    const qualityMultiplier = diamondQualityMultipliers[diamondQuality] || 1.0;
    const colorMultiplier = diamondColorMultipliers[diamondColor] || 1.0;
    
    const goldCost = weight * goldPrice;
    const diamondPrice = baseDiamondPrice * qualityMultiplier * colorMultiplier;
    const diamondCost = diamondWeight * diamondPrice;
    
    return Math.round(goldCost + diamondCost);
  },

  // Recalculate all product prices (this would integrate with productService)
async recalculateAllPrices() {
    await delay(1000);
    
    // Get all products from localStorage
    const { productService } = await import('./productService');
    const products = await productService.getAll();
    
    let updatedCount = 0;
    const updatedProducts = products.map(product => {
      if (product.goldType && product.weight) {
        const newPrice = this.calculateProductPrice(
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
    
    // Save updated products
    if (updatedCount > 0) {
      localStorage.setItem('4c-diamonds-products', JSON.stringify(updatedProducts));
    }
    
    return { 
      success: true, 
      message: `Successfully recalculated prices for ${updatedCount} products`,
      updatedCount
    };
  },

  getDiamondQualityMultipliers() {
    return diamondQualityMultipliers;
  },

  getDiamondColorMultipliers() {
    return diamondColorMultipliers;
  }
};

// Initialize rates from localStorage if available
function initializeRates() {
  const storedGoldRates = localStorage.getItem('goldRates');
  const storedDiamondRates = localStorage.getItem('diamondRates');
  
  if (storedGoldRates) {
    try {
      const stored = JSON.parse(storedGoldRates);
      // Only keep allowed gold types
      const allowedGoldTypes = ['14k', '18k', '22k', '24k', 'silver'];
      const filteredGoldRates = {};
      allowedGoldTypes.forEach(type => {
        filteredGoldRates[type] = stored[type] || goldRates[type];
      });
      goldRates = filteredGoldRates;
    } catch (e) {
      console.warn('Failed to parse stored gold rates');
    }
  }
  
  if (storedDiamondRates) {
    try {
      diamondRates = { ...diamondRates, ...JSON.parse(storedDiamondRates) };
    } catch (e) {
      console.warn('Failed to parse stored diamond rates');
    }
  }
}

// Initialize on service load
initializeRates();

export { pricingService };