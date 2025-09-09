import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import BarcodeScanner from "@/components/organisms/BarcodeScanner";
import ProductList from "@/components/organisms/ProductList";
import AddProductModal from "@/components/organisms/AddProductModal";
const Products = () => {
const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  useEffect(() => {
    loadProducts();
  }, []);

const filterProducts = () => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.diamondQuality && product.diamondQuality.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.certificateNumber && product.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.status && product.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterProducts]);

const handleBarcodeScan = async (barcode) => {
    setIsScannerOpen(false);
    try {
      const product = await productService.getByBarcode(barcode);
      if (product) {
        // Filter to show the found product
        setSearchTerm(barcode);
// Show product details with action buttons
        const productDetails = `📦 ${product.name}\n💰 ₹${product.price?.toLocaleString('en-IN') || 'Price not set'}\n📊 Status: ${product.status || 'Available'}\n🏷️ Category: ${product.category || 'Uncategorized'}`;
        
        toast.success(
          <div>
            <div className="font-semibold mb-2">Product Found!</div>
            <div className="whitespace-pre-line text-sm">{productDetails}</div>
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => {
                  toast.dismiss();
                  window.location.href = '/sales';
                }}
                className="bg-gold-500 text-white px-3 py-1 rounded text-sm hover:bg-gold-600 transition-colors"
              >
                Add to Sale
              </button>
            </div>
          </div>, 
          {
            duration: 8000,
            autoClose: false
          }
        );
      } else {
        toast.error('Product not found with this barcode. Check the barcode and try again.');
      }
    } catch (error) {
      console.error('Barcode scan error:', error);
      toast.error('Error scanning barcode. Please try again.');
    }
  };

const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleAddProduct = async (productData) => {
    try {
      const newProduct = await productService.create(productData);
      setProducts(prev => [...prev, newProduct]);
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product");
      throw error;
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      const updatedProduct = await productService.update(editProduct.Id, productData);
      setProducts(prev => 
        prev.map(p => p.Id === editProduct.Id ? updatedProduct : p)
      );
      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error("Failed to update product");
      throw error;
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await productService.delete(productId);
      setProducts(prev => prev.filter(p => p.Id !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    }
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditProduct(null);
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  return (
<div className="space-y-6">
      {/* Header */}
<div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage your jewelry inventory with {products.length} total items
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setIsScannerOpen(true)}
              variant="outline"
              className="w-full sm:w-auto min-h-[44px]"
            >
              <ApperIcon name="Camera" className="w-4 h-4 mr-2" />
              Scan Barcode
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto min-h-[44px]"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
<div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, category, barcode..."
              className="w-full"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto min-h-[44px]">
            <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
          Filters
        </Button>
</div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <Empty
          title="No products found"
          description={searchTerm 
            ? `No products match your search for "${searchTerm}"`
            : "Start building your jewelry inventory by adding your first product."
          }
          actionLabel="Add Product"
          onAction={() => setIsModalOpen(true)}
          icon="Package"
        />
      ) : (
        <ProductList
          products={filteredProducts}
          onEdit={openEditModal}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Barcode Scanner */}
      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScan}
      />

      {/* Add/Edit Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editProduct ? handleEditProduct : handleAddProduct}
        editProduct={editProduct}
      />
    </div>
    </div>
  );
};

export default Products;