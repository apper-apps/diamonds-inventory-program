import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { pricingService } from "@/services/api/pricingService";
import { authService } from "@/services/api/authService";

const Pricing = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [goldRates, setGoldRates] = useState({});
  const [diamondRates, setDiamondRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [editingGold, setEditingGold] = useState(false);
  const [editingDiamond, setEditingDiamond] = useState(false);

  // Load pricing data
  useEffect(() => {
    loadPricingData();
  }, []);

  const loadPricingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pricingService.getAllRates();
      setGoldRates(data.gold);
      setDiamondRates(data.diamond);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      setError("Failed to load pricing data");
      console.error("Error loading pricing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoldRateChange = (type, value) => {
    setGoldRates(prev => ({
      ...prev,
      [type]: parseFloat(value) || 0
    }));
  };

  const handleDiamondRateChange = (type, value) => {
    setDiamondRates(prev => ({
      ...prev,
      [type]: parseFloat(value) || 0
    }));
  };

  const updateGoldRates = async () => {
    try {
      setUpdating(true);
      await pricingService.updateGoldRates(goldRates);
      setEditingGold(false);
      toast.success("Gold rates updated successfully!");
      await loadPricingData(); // Refresh data
    } catch (err) {
      toast.error("Failed to update gold rates");
      console.error("Error updating gold rates:", err);
    } finally {
      setUpdating(false);
    }
  };

  const updateDiamondRates = async () => {
    try {
      setUpdating(true);
      await pricingService.updateDiamondRates(diamondRates);
      setEditingDiamond(false);
      toast.success("Diamond rates updated successfully!");
      await loadPricingData(); // Refresh data
    } catch (err) {
      toast.error("Failed to update diamond rates");
      console.error("Error updating diamond rates:", err);
    } finally {
      setUpdating(false);
    }
  };

  const recalculateAllPrices = async () => {
    try {
      setUpdating(true);
      const result = await pricingService.recalculateAllPrices();
      toast.success(result.message);
    } catch (err) {
      toast.error("Failed to recalculate prices");
      console.error("Error recalculating prices:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Check permissions
  const canEdit = authService.hasPermission('pricing') || authService.isManager();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPricingData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600 mt-1">
            Manage daily gold and diamond rates for automatic price calculation
          </p>
        </div>
        
        {canEdit && (
          <Button
            onClick={recalculateAllPrices}
            disabled={updating}
            variant="primary"
            className="shrink-0"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Recalculate All Prices
          </Button>
        )}
      </div>

      {/* Last Updated Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <ApperIcon name="Clock" size={16} className="text-blue-600" />
          <span className="text-blue-800 font-medium">
            Last Updated: {new Date(lastUpdated).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gold Rates Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-100 rounded-lg">
                  <ApperIcon name="Coins" size={20} className="text-gold-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Gold Rates</h3>
                  <p className="text-sm text-gray-500">Per gram in INR</p>
                </div>
              </div>
              
              {canEdit && (
                <div className="flex gap-2">
                  {editingGold ? (
                    <>
                      <Button
                        onClick={() => setEditingGold(false)}
                        variant="outline"
                        size="sm"
                        disabled={updating}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={updateGoldRates}
                        size="sm"
                        disabled={updating}
                      >
                        {updating ? "Saving..." : "Save"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setEditingGold(true)}
                      variant="outline"
                      size="sm"
                    >
                      <ApperIcon name="Edit" size={14} />
                      Edit
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {Object.entries(goldRates).map(([type, rate]) => (
              <div key={type} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {type.replace('-', ' ')}
                </label>
                {editingGold ? (
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => handleGoldRateChange(type, e.target.value)}
                    className="w-32 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{rate.toLocaleString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Diamond Rates Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ApperIcon name="Gem" size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Diamond Rates</h3>
                  <p className="text-sm text-gray-500">Per carat in INR</p>
                </div>
              </div>
              
              {canEdit && (
                <div className="flex gap-2">
                  {editingDiamond ? (
                    <>
                      <Button
                        onClick={() => setEditingDiamond(false)}
                        variant="outline"
                        size="sm"
                        disabled={updating}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={updateDiamondRates}
                        size="sm"
                        disabled={updating}
                      >
                        {updating ? "Saving..." : "Save"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setEditingDiamond(true)}
                      variant="outline"
                      size="sm"
                    >
                      <ApperIcon name="Edit" size={14} />
                      Edit
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {Object.entries(diamondRates).map(([type, rate]) => (
              <div key={type} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {type.replace('-', ' ')}
                </label>
                {editingDiamond ? (
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => handleDiamondRateChange(type, e.target.value)}
                    className="w-32 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{rate.toLocaleString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price Calculator Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ApperIcon name="Calculator" size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Price Calculator</h3>
              <p className="text-sm text-gray-500">Calculate product price based on current rates</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <FormField
              label="Gold Type"
              type="select"
              options={Object.keys(goldRates).map(type => ({
                value: type,
                label: type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
              }))}
              placeholder="Select gold type"
            />
            
            <FormField
              label="Diamond Type"
              type="select"
              options={Object.keys(diamondRates).map(type => ({
                value: type,
                label: type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
              }))}
              placeholder="Select diamond type"
            />
            
            <FormField
              label="Weight (grams)"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
            />
            
            <FormField
              label="Diamond Weight (ct)"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-lg font-medium text-gray-700">Estimated Price:</span>
            <span className="text-2xl font-bold text-green-600">₹0</span>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <ApperIcon name="ArrowRight" size={16} className="text-gray-400 mt-0.5" />
            Update gold and diamond rates daily for accurate pricing
          </li>
          <li className="flex items-start gap-2">
            <ApperIcon name="ArrowRight" size={16} className="text-gray-400 mt-0.5" />
            Click "Recalculate All Prices" after updating rates to apply changes to existing products
          </li>
          <li className="flex items-start gap-2">
            <ApperIcon name="ArrowRight" size={16} className="text-gray-400 mt-0.5" />
            Use the price calculator to estimate costs for new products
          </li>
          <li className="flex items-start gap-2">
            <ApperIcon name="ArrowRight" size={16} className="text-gray-400 mt-0.5" />
            All changes are synchronized across all devices in real-time
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pricing;