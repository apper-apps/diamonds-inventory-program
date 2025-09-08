import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";

const AddProductModal = ({ isOpen, onClose, onSubmit, editProduct = null }) => {
const [formData, setFormData] = useState({
    name: "",
    category: "",
    goldType: "",
    diamondType: "",
    diamondQuality: "",
    certificateNumber: "",
    weight: "",
    dimensions: "",
    specifications: "",
    price: "",
    description: "",
    status: "Available",
    barcode: "",
    images: []
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (editProduct) {
        setFormData({
name: editProduct.name || "",
          category: editProduct.category || "",
          goldType: editProduct.goldType || "",
          diamondType: editProduct.diamondType || "",
          diamondQuality: editProduct.diamondQuality || "",
          certificateNumber: editProduct.certificateNumber || "",
          weight: editProduct.weight?.toString() || "",
          dimensions: editProduct.dimensions || "",
          specifications: editProduct.specifications || "",
          price: editProduct.price?.toString() || "",
          description: editProduct.description || "",
          status: editProduct.status || "Available",
          barcode: editProduct.barcode || "",
          images: editProduct.images || []
        });
      } else {
setFormData({
          name: "",
          category: "",
          goldType: "",
          diamondType: "",
          diamondQuality: "",
          certificateNumber: "",
          weight: "",
          dimensions: "",
          specifications: "",
          price: "",
          description: "",
          status: "Available",
          barcode: "",
          images: []
        });
      }
      setErrors({});
    }
  }, [isOpen, editProduct]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData.map(cat => ({ value: cat.name, label: cat.name })));
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

const generateBarcode = () => {
    const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    return `4CD-${randomDigits}`;
  };

  const validateForm = () => {
const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.goldType) newErrors.goldType = "Gold type is required";
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = "Valid weight is required";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.description.trim()) newErrors.description = "Description is required";
if (formData.certificateNumber && !/^[A-Za-z0-9-]+$/.test(formData.certificateNumber)) {
      newErrors.certificateNumber = "Certificate number must be alphanumeric";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
const productData = {
        ...formData,
        weight: parseFloat(formData.weight),
        price: parseFloat(formData.price),
        barcode: formData.barcode || generateBarcode()
      };

      await onSubmit(productData);
      onClose();
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-900 to-gold-600 bg-clip-text text-transparent">
              {editProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              error={errors.name}
              required
            />

<FormField
              label="Category"
              name="category"
              type="select"
              value={formData.category}
              onChange={handleChange}
              options={categories}
              error={errors.category}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Gold Type"
                name="goldType"
                type="select"
                value={formData.goldType}
                onChange={handleChange}
                options={[
                  { value: "18k", label: "18k Gold" },
                  { value: "22k", label: "22k Gold" },
                  { value: "24k", label: "24k Gold" },
                  { value: "white-gold", label: "White Gold" },
                  { value: "rose-gold", label: "Rose Gold" }
                ]}
                error={errors.goldType}
                required
              />

              <FormField
                label="Diamond Type"
                name="diamondType"
                type="select"
                value={formData.diamondType}
                onChange={handleChange}
                options={[
                  { value: "solitaire", label: "Solitaire" },
                  { value: "emerald-cut", label: "Emerald Cut" },
                  { value: "princess-cut", label: "Princess Cut" },
                  { value: "round-brilliant", label: "Round Brilliant" },
                  { value: "pear-cut", label: "Pear Cut" },
                  { value: "oval-cut", label: "Oval Cut" },
                  { value: "cushion-cut", label: "Cushion Cut" }
                ]}
                error={errors.diamondType}
              />
            </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Diamond Quality"
                id="diamondQuality"
                name="diamondQuality"
                value={formData.diamondQuality}
                onChange={handleChange}
                error={errors.diamondQuality}
                type="select"
                options={[
                  { value: "", label: "Select Diamond Quality" },
                  { value: "FL", label: "FL - Flawless" },
                  { value: "IF", label: "IF - Internally Flawless" },
                  { value: "VVS1", label: "VVS1 - Very Very Slightly Included 1" },
                  { value: "VVS2", label: "VVS2 - Very Very Slightly Included 2" },
                  { value: "VS1", label: "VS1 - Very Slightly Included 1" },
                  { value: "VS2", label: "VS2 - Very Slightly Included 2" },
                  { value: "SI1", label: "SI1 - Slightly Included 1" },
                  { value: "SI2", label: "SI2 - Slightly Included 2" },
                  { value: "I1", label: "I1 - Included 1" },
                  { value: "I2", label: "I2 - Included 2" },
                  { value: "I3", label: "I3 - Included 3" }
                ]}
              />

              <FormField
                label="Certificate Number"
                id="certificateNumber"
                name="certificateNumber"
                value={formData.certificateNumber}
                onChange={handleChange}
                error={errors.certificateNumber}
                placeholder="e.g., GIA-1234567890"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData(prev => ({
                          ...prev,
                          images: [...prev.images, event.target.result]
                        }));
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Weight (grams)"
                name="weight"
                type="number"
                step="0.01"
                min="0"
                value={formData.weight}
                onChange={handleChange}
                placeholder="0.00"
                error={errors.weight}
                required
              />

              <FormField
                label="Dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="e.g., 15mm x 10mm"
                error={errors.dimensions}
              />
</div>

            <FormField
              label="Specifications"
              name="specifications"
              type="textarea"
              value={formData.specifications}
              onChange={handleChange}
              placeholder="Additional specifications (clarity, color grade, etc.)"
              rows={3}
/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Price (₹)"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                error={errors.price}
                required
              />

              <FormField
                label="Status"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "Available", label: "Available" },
                  { value: "Reserved", label: "Reserved" },
                  { value: "Sold", label: "Sold" }
                ]}
                error={errors.status}
                required
              />
            </div>

            <FormField
              label="Barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Leave empty to auto-generate (4CD-XXXXXX)"
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              error={errors.description}
              required
            />

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    {editProduct ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name={editProduct ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                    {editProduct ? "Update Product" : "Add Product"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddProductModal;