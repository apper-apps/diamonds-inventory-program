import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";
import { customerService } from "@/services/api/customerService";
import { salesService } from "@/services/api/salesService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import BarcodeScanner from "@/components/organisms/BarcodeScanner";
import InvoiceModal from "@/components/organisms/InvoiceModal";
import CustomerModal from "@/components/organisms/CustomerModal";
import Sidebar from "@/components/organisms/Sidebar";
import Products from "@/components/pages/Products";

const Sales = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
}, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, customersData] = await Promise.all([
        productService.getAll(),
        customerService.getAll()
      ]);
      setProducts(productsData || []);
      setCustomers(customersData || []);
    } catch (err) {
      setError("Failed to load data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter customers based on search
const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );
  // Barcode scanner
  const handleBarcodeScan = async (barcode) => {
    try {
      const product = await productService.getByBarcode(barcode);
      if (product) {
        addToCart(product);
        toast.success(`${product.name} added to cart`);
      } else {
        toast.error('Product not found with this barcode');
      }
    } catch (error) {
      toast.error('Error scanning barcode');
    }
  };

  // Cart management
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.Id === product.Id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.Id === product.Id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.Id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.Id !== productId));
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
const gstRate = 0.03; // 3% GST for jewelry
  const gstAmount = Math.round(subtotal * gstRate * 100) / 100;
  const totalAmount = Math.round((subtotal + gstAmount) * 100) / 100;

  // Customer management
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchTerm("");
  };

  const handleAddCustomer = async (customerData) => {
    try {
      const newCustomer = await customerService.create(customerData);
      setCustomers([...customers, newCustomer]);
      setSelectedCustomer(newCustomer);
      setCustomerModalOpen(false);
      toast.success('Customer added successfully');
    } catch (error) {
      toast.error('Failed to add customer');
      console.error('Error adding customer:', error);
    }
  };

  // Process sale
  const processSale = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    try {
      setProcessingPayment(true);
      
const saleData = {
        customerId: selectedCustomer.Id,
        items: cart.map(item => ({
          productId: item.Id,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        subtotal,
        gstAmount,
        totalAmount
      };

      const invoice = await salesService.createSale(saleData);
// Update inventory status for sold items
      await Promise.all(
        cart.map(async (item) => {
          try {
            await productService.updateInventoryStatus(item.Id, 'Sold');
          } catch (error) {
            console.warn(`Failed to update inventory for product ${item.Id}:`, error);
          }
        })
      );
      
      setInvoiceData(invoice);
      setInvoiceModalOpen(true);
      clearCart();
      setSelectedCustomer(null);
      toast.success('Sale processed successfully! Inventory updated.');
    } catch (error) {
      toast.error('Failed to process sale');
      console.error('Error processing sale:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-900 to-gold-600 bg-clip-text text-transparent">
              Point of Sale
            </h1>
            <p className="text-gray-600 mt-1">
              Scan products, manage cart, and generate GST-compliant invoices
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setScannerOpen(true)}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Camera" size={16} />
              <span className="hidden sm:inline">Scan Barcode</span>
            </Button>
            
            <Button
              onClick={() => setCustomerModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ApperIcon name="UserPlus" size={16} />
              <span className="hidden sm:inline">Add Customer</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Products</h2>
              <SearchBar
                placeholder="Search products by name, barcode, or category..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
            
            <div className="p-6">
<div className="grid grid-cols-1 gap-4 max-h-80 sm:max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.Id}
                    layout
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                      <span className="text-lg font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono bg-white px-2 py-1 rounded border">
                        {product.barcode}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </motion.div>
))}
              </div>
            </div>
          </div>
        </div>

        {/* Cart & Customer Section */}
        <div className="space-y-6">
          {/* Customer Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer</h2>
              
              {selectedCustomer ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-blue-900">{selectedCustomer.name}</h3>
                      <p className="text-sm text-blue-700">{selectedCustomer.email}</p>
                      <p className="text-sm text-blue-700">{selectedCustomer.phone}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCustomer(null)}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
<div className="space-y-3 max-h-60 sm:max-h-80 overflow-y-auto">
                  <SearchBar
                    placeholder="Search customers..."
                    value={customerSearchTerm}
                    onChange={setCustomerSearchTerm}
                  />
                  
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.Id}
                        className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.phone}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shopping Cart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Cart ({cart.length})</h2>
                {cart.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearCart}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="ShoppingCart" size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>Cart is empty</p>
                  <p className="text-sm">Scan or add products to start</p>
                </div>
              ) : (
                <div className="space-y-4">
<div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-3">
                    {cart.map((item) => (
                      <div key={item.Id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-gray-600">₹{item.price.toLocaleString()} each</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => updateCartQuantity(item.Id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => updateCartQuantity(item.Id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        
                        <div className="text-right min-w-0">
                          <p className="font-medium text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          onClick={() => removeFromCart(item.Id)}
                        >
                          <ApperIcon name="X" size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Cart Totals */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (3%):</span>
                      <span>₹{gstAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Process Sale Button */}
                  <Button
                    onClick={processSale}
                    disabled={processingPayment || cart.length === 0 || !selectedCustomer}
                    className="w-full"
                  >
                    {processingPayment ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="CreditCard" size={16} className="mr-2" />
                        Process Sale
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BarcodeScanner
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleBarcodeScan}
      />

      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        invoiceData={invoiceData}
      />

      <CustomerModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
};

export default Sales;