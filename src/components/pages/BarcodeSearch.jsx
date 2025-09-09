import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import BarcodeScanner from '@/components/organisms/BarcodeScanner';
import Loading from '@/components/ui/Loading';
import ApperIcon from '@/components/ApperIcon';
import { productService } from '@/services/api/productService';

const BarcodeSearch = () => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = async (barcode) => {
    if (!barcode.trim()) {
      toast.error('Please enter a barcode number');
      return;
    }

    setLoading(true);
    setSearchAttempted(true);
    
    try {
      const foundProduct = await productService.getByBarcode(barcode.trim());
      
      if (foundProduct) {
        setProduct(foundProduct);
        toast.success('Product found!');
      } else {
        setProduct(null);
        toast.error('Product not found for this barcode');
      }
    } catch (error) {
      console.error('Error searching product:', error);
      toast.error('Error searching for product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = () => {
    handleSearch(barcodeInput);
  };

  const handleBarcodeScan = (scannedBarcode) => {
    setBarcodeInput(scannedBarcode);
    setScannerOpen(false);
    handleSearch(scannedBarcode);
  };

  const handleAddToSale = () => {
    sessionStorage.setItem('scannedBarcode', product.barcode);
    window.location.href = '/sales';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(price);
  };

  const formatWeight = (weight) => {
    if (!weight) return 'Not specified';
    return `${weight} grams`;
  };

  return (
<div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
<div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Barcode Search</h1>
        <p className="text-gray-600 text-sm sm:text-base">Search for products by scanning or entering barcode manually</p>
      </div>

      {/* Search Section */}
<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="space-y-4">
          {/* Manual Entry */}
          <div>
            <Label htmlFor="barcode-input" className="text-sm font-medium text-gray-700 mb-2">
              Enter Barcode Number
            </Label>
<div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  id="barcode-input"
                  type="text"
                  placeholder="Enter barcode number..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                  className="font-mono"
                />
              </div>
<Button 
                onClick={handleManualSearch}
                disabled={loading}
                className="px-4 sm:px-6 w-full sm:w-auto min-h-[44px]"
              >
                <ApperIcon name="Search" className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-500 bg-white">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Scanner Button */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setScannerOpen(true)}
              disabled={loading}
className="inline-flex items-center w-full sm:w-auto min-h-[44px]"
            >
              <ApperIcon name="Camera" className="w-5 h-5 mr-2" />
              Scan Barcode with Camera
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-8">
          <Loading message="Searching for product..." />
        </div>
      )}

      {/* Product Details */}
{!loading && product && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
{/* Product Header */}
          <div className="bg-gradient-to-r from-gold-50 to-gold-100 p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-gray-600 text-sm sm:text-base">{product.description}</p>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-600 to-gold-800 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Price</div>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
            
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 border-b border-gray-200 pb-2">Basic Information</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Barcode:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{product.barcode}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {product.status || 'Available'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Properties */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 border-b border-gray-200 pb-2">Physical Properties</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{formatWeight(product.weight)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diamond Quality:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.diamondQuality || 'N/A'}
                    </span>
                  </div>
                  
                  {product.certificateNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certificate:</span>
                      <span className="font-medium text-sm">{product.certificateNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 border-b border-gray-200 pb-2">Additional Details</h4>
                
                <div className="space-y-2">
                  {product.material && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Material:</span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  )}
                  
                  {product.purity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purity:</span>
                      <span className="font-medium">{product.purity}</span>
                    </div>
                  )}
                  
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions:</span>
                      <span className="font-medium text-sm">{product.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
<div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={() => window.location.href = '/products'} className="w-full sm:w-auto min-h-[44px]">
                <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                View in Products
              </Button>
              <Button onClick={handleAddToSale} className="w-full sm:w-auto min-h-[44px]">
                <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-2" />
                Add to Sale
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && searchAttempted && !product && (
<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-8 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Search" className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Product Not Found</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">No product found with the entered barcode.</p>
          <p className="text-xs sm:text-sm text-gray-500">Please check the barcode and try again.</p>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleBarcodeScan}
      />
    </div>
  );
};

export default BarcodeSearch;