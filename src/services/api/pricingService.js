// Mock data for daily pricing rates
let goldRates = {
  "18k": 4800,
  "22k": 5200,
  "24k": 5600,
  "white-gold": 4900,
  "rose-gold": 4850
};

let diamondRates = {
  "solitaire": 120000,
  "emerald-cut": 115000,
  "princess-cut": 110000,
  "round-brilliant": 125000,
  "pear-cut": 108000,
  "oval-cut": 112000,
  "cushion-cut": 110000
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

  // Calculate product price based on weight and type
  calculateProductPrice(goldType, diamondType, weight, diamondWeight = 0) {
    const goldPrice = goldRates[goldType] || 0;
    const diamondPrice = diamondRates[diamondType] || 0;
    
    const goldCost = weight * goldPrice;
    const diamondCost = diamondWeight * diamondPrice;
    
    return Math.round(goldCost + diamondCost);
  },

  // Recalculate all product prices (this would integrate with productService)
  async recalculateAllPrices() {
    await delay(1000);
    // This would update all products in the system
    // For now, return a success message
    return { 
      success: true, 
      message: "All product prices have been recalculated based on current rates",
      updatedCount: 0 // Would be actual count in real implementation
    };
  }
};

// Initialize rates from localStorage if available
function initializeRates() {
  const storedGoldRates = localStorage.getItem('goldRates');
  const storedDiamondRates = localStorage.getItem('diamondRates');
  
  if (storedGoldRates) {
    try {
      goldRates = { ...goldRates, ...JSON.parse(storedGoldRates) };
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