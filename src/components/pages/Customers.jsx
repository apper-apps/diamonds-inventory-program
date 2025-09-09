import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { customerService } from "@/services/api/customerService";
import { salesService } from "@/services/api/salesService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import CustomerModal from "@/components/organisms/CustomerModal";

const Customers = () => {
  // State management
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [customerStats, setCustomerStats] = useState({
    total: 0,
    newThisMonth: 0,
    vip: 0,
    repeatBuyers: 0
  });
  const [customerPurchases, setCustomerPurchases] = useState({});

  // Load data on component mount
  useEffect(() => {
    loadCustomers();
    loadCustomerPurchases();
  }, []);

  // Filter customers based on search and filter criteria
  useEffect(() => {
    let filtered = customers;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.includes(search) ||
        customer.city.toLowerCase().includes(search) ||
        (customer.gstNumber && customer.gstNumber.toLowerCase().includes(search))
      );
    }

    // Apply category filter
    if (selectedFilter !== "all") {
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      switch (selectedFilter) {
        case "recent":
          filtered = filtered.filter(customer => 
            new Date(customer.createdAt) >= oneMonthAgo
          );
          break;
        case "vip":
          filtered = filtered.filter(customer => {
            const purchases = customerPurchases[customer.Id] || [];
            const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
            return totalSpent >= 100000; // VIP threshold: ₹1,00,000+
          });
          break;
        case "business":
          filtered = filtered.filter(customer => customer.gstNumber && customer.gstNumber.trim() !== "");
          break;
        default:
          break;
      }
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, selectedFilter, customerPurchases]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const customersData = await customerService.getAll();
      setCustomers(customersData);
      
      // Calculate stats
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      const stats = {
        total: customersData.length,
        newThisMonth: customersData.filter(c => new Date(c.createdAt) >= oneMonthAgo).length,
        vip: 0, // Will be updated after loading purchases
        repeatBuyers: 0 // Will be updated after loading purchases
      };
      
      setCustomerStats(stats);
    } catch (err) {
      setError("Failed to load customers");
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerPurchases = async () => {
    try {
      const sales = await salesService.getAll();
      const purchasesByCustomer = {};
      
      // Group sales by customer
      sales.forEach(sale => {
        if (!purchasesByCustomer[sale.customerId]) {
          purchasesByCustomer[sale.customerId] = [];
        }
        purchasesByCustomer[sale.customerId].push(sale);
      });
      
      setCustomerPurchases(purchasesByCustomer);
      
      // Update VIP and repeat buyer stats
      const vipCount = Object.keys(purchasesByCustomer).filter(customerId => {
        const purchases = purchasesByCustomer[customerId];
        const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
        return totalSpent >= 100000;
      }).length;
      
      const repeatBuyerCount = Object.keys(purchasesByCustomer).filter(customerId => 
        purchasesByCustomer[customerId].length > 1
      ).length;
      
      setCustomerStats(prev => ({
        ...prev,
        vip: vipCount,
        repeatBuyers: repeatBuyerCount
      }));
      
    } catch (err) {
      console.error("Error loading customer purchases:", err);
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setCustomerModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setCustomerModalOpen(true);
  };

  const handleDeleteCustomer = async (customer) => {
    if (!window.confirm(`Are you sure you want to delete ${customer.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingCustomer(customer.Id);
      await customerService.delete(customer.Id);
      setCustomers(customers.filter(c => c.Id !== customer.Id));
      toast.success(`${customer.name} deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error("Error deleting customer:", error);
    } finally {
      setDeletingCustomer(null);
    }
  };

  const handleSubmitCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        // Update existing customer
        const updatedCustomer = await customerService.update(editingCustomer.Id, customerData);
        setCustomers(customers.map(c => c.Id === editingCustomer.Id ? updatedCustomer : c));
        toast.success("Customer updated successfully");
      } else {
        // Create new customer
        const newCustomer = await customerService.create(customerData);
        setCustomers([...customers, newCustomer]);
        toast.success("Customer added successfully");
      }
      setCustomerModalOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      toast.error(`Failed to ${editingCustomer ? 'update' : 'add'} customer`);
      console.error("Error submitting customer:", error);
    }
  };

  const getCustomerPurchaseStats = (customerId) => {
    const purchases = customerPurchases[customerId] || [];
    const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
    const totalPurchases = purchases.length;
    const isVip = totalSpent >= 100000;
    const isRepeatBuyer = totalPurchases > 1;
    
    return { totalSpent, totalPurchases, isVip, isRepeatBuyer };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCustomers} />;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
className="flex flex-col gap-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-900 to-gold-600 bg-clip-text text-transparent">
              Customer Management
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage customer relationships and track purchase history
            </p>
          </div>
          
          <Button
            onClick={handleAddCustomer}
            className="flex items-center gap-2 w-full sm:w-auto min-h-[44px]"
          >
            <ApperIcon name="UserPlus" size={16} />
            Add Customer
          </Button>
        </div>
      </motion.div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Total Customers", 
            value: customerStats.total.toLocaleString(), 
            icon: "Users", 
            color: "from-blue-500 to-blue-600" 
          },
          { 
            label: "New This Month", 
            value: customerStats.newThisMonth.toString(), 
            icon: "UserPlus", 
            color: "from-green-500 to-green-600" 
          },
          { 
            label: "VIP Customers", 
            value: customerStats.vip.toString(), 
            icon: "Crown", 
            color: "from-gold-500 to-gold-600" 
          },
          { 
            label: "Repeat Buyers", 
            value: customerStats.repeatBuyers.toString(), 
            icon: "Repeat", 
            color: "from-purple-500 to-purple-600" 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search customers by name, email, phone, city, or GST number..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          
<div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All Customers" },
              { value: "recent", label: "New This Month" },
              { value: "vip", label: "VIP Customers" },
              { value: "business", label: "Business Customers" }
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={selectedFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.value)}
                className="min-h-[36px] text-xs sm:text-sm"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Customer List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Customers ({filteredCustomers.length})
          </h2>
        </div>
        
        <div className="p-6">
          {filteredCustomers.length === 0 ? (
            <Empty 
              message={searchTerm ? "No customers found matching your search" : "No customers found"}
              description={searchTerm ? "Try adjusting your search terms" : "Add your first customer to get started"}
            />
          ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence>
                {filteredCustomers.map((customer, index) => {
                  const stats = getCustomerPurchaseStats(customer.Id);
                  
                  return (
                    <motion.div
                      key={customer.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border border-gray-100 hover:border-gray-200"
                    >
                      {/* Customer Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {stats.isVip && (
                                <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <ApperIcon name="Crown" size={12} />
                                  VIP
                                </span>
                              )}
                              {stats.isRepeatBuyer && (
                                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                                  Repeat Buyer
                                </span>
                              )}
                              {customer.gstNumber && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                  Business
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCustomer(customer)}
                            className="p-2"
                          >
                            <ApperIcon name="Edit" size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCustomer(customer)}
                            disabled={deletingCustomer === customer.Id}
                            className="p-2 text-red-600 hover:bg-red-50"
                          >
                            {deletingCustomer === customer.Id ? (
                              <ApperIcon name="Loader2" size={14} className="animate-spin" />
                            ) : (
                              <ApperIcon name="Trash2" size={14} />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-2 mb-4">
                        {customer.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ApperIcon name="Mail" size={14} />
                            <span className="truncate">{customer.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ApperIcon name="Phone" size={14} />
                          <span>{customer.phone}</span>
                        </div>
                        {customer.city && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ApperIcon name="MapPin" size={14} />
                            <span>{customer.city}, {customer.state}</span>
                          </div>
                        )}
                      </div>

                      {/* Purchase Statistics */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                              {stats.totalPurchases}
                            </p>
                            <p className="text-xs text-gray-600">Purchases</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                              {stats.totalSpent > 0 ? formatCurrency(stats.totalSpent).replace('₹', '₹') : '₹0'}
                            </p>
                            <p className="text-xs text-gray-600">Total Spent</p>
                          </div>
                        </div>
                        
                        {stats.totalPurchases > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center">
                              Customer since {new Date(customer.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={customerModalOpen}
        onClose={() => {
          setCustomerModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleSubmitCustomer}
        initialData={editingCustomer}
      />
    </div>
  );
};

export default Customers;