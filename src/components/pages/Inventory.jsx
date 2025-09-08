import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";
import { pricingService } from "@/services/api/pricingService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ProductList from "@/components/organisms/ProductList";
import AddProductModal from "@/components/organisms/AddProductModal";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
const [editingProduct, setEditingProduct] = useState(null);

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err) {
      setError("Failed to load inventory");
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Handle product operations
  const handleAddProduct = async (productData) => {
    try {
      // Calculate price using pricing service
      const calculatedPrice = pricingService.calculateProductPrice(
        productData.goldType,
        productData.diamondType,
        parseFloat(productData.weight) || 0,
        parseFloat(productData.diamondWeight) || 0,
        productData.diamondQuality || 'SI',
        productData.diamondColor || 'F-G'
      );

      const newProduct = await productService.create({
        ...productData,
        weight: parseFloat(productData.weight),
        diamondWeight: parseFloat(productData.diamondWeight) || 0,
        price: calculatedPrice
      });

      setProducts(prev => [...prev, newProduct]);
      setShowAddModal(false);
      toast.success("Product added successfully!");
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      // Calculate price using pricing service
      const calculatedPrice = pricingService.calculateProductPrice(
        productData.goldType,
        productData.diamondType,
        parseFloat(productData.weight) || 0,
        parseFloat(productData.diamondWeight) || 0,
        productData.diamondQuality || 'SI',
        productData.diamondColor || 'F-G'
      );

      const updatedProduct = await productService.update(editingProduct.Id, {
        ...productData,
        weight: parseFloat(productData.weight),
        diamondWeight: parseFloat(productData.diamondWeight) || 0,
        price: calculatedPrice
      });

      setProducts(prev => prev.map(p => p.Id === updatedProduct.Id ? updatedProduct : p));
      setEditingProduct(null);
      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await productService.delete(productId);
      setProducts(prev => prev.filter(p => p.Id !== productId));
      toast.success("Product deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // Get inventory statistics
  const inventoryStats = [
    {
      label: "Total Products",
      value: products.length,
      icon: "Package",
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "Available",
      value: products.filter(p => p.status === "Available").length,
      icon: "CheckCircle",
      color: "from-green-500 to-green-600"
    },
    {
      label: "Reserved",
      value: products.filter(p => p.status === "Reserved").length,
      icon: "Clock",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      label: "Total Value",
      value: `₹${products.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}`,
      icon: "DollarSign",
      color: "from-gold-500 to-gold-600"
    }
  ];

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-900 to-gold-600 bg-clip-text text-transparent">
          Inventory Management
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor stock levels, track inventory movements, and manage your jewelry collection.
        </p>
      </motion.div>

      {/* Inventory Stats */}
{/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventoryStats.map((stat, index) => (
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

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search products, barcodes, or descriptions..."
                className="w-full"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={20} />
            Add Product
          </Button>
        </div>
      </motion.div>

      {/* Products List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {filteredProducts.length > 0 ? (
          <ProductList
            products={filteredProducts}
            onEdit={setEditingProduct}
            onDelete={handleDeleteProduct}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Package" className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {products.length === 0 ? "No products in inventory" : "No products match your filters"}
            </h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0 
                ? "Start by adding your first product to the inventory."
                : "Try adjusting your search terms or filters."
              }
            </p>
            {products.length === 0 && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Your First Product
              </Button>
            )}
          </div>
        )}
      </motion.div>

      {/* Add/Edit Product Modal */}
      <AddProductModal
        isOpen={showAddModal || !!editingProduct}
        onClose={() => {
          setShowAddModal(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        editProduct={editingProduct}
      />
    </div>
  );
};

export default Inventory;