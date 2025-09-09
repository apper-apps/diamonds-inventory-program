import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categoryService } from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const AddProductModal = ({ isOpen, onClose, onSubmit, editProduct = null }) => {
const [formData, setFormData] = useState({
    Name: "",
    category_c: "",
    gold_type_c: "",
    diamond_type_c: "",
    diamond_quality_c: "",
    diamond_color_c: "",
    certificate_number_c: "",
    weight_c: "",
    diamond_weight_c: "",
    dimensions_c: "",
    specifications_c: "",
    price_c: "0",
    description_c: "",
    status_c: "Available",
    barcode_c: "",
    images_c: "",
    making_charge_c: "0",
    labour_charge_c: "0",
    manualPricing: false
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState({ gold: 0, diamond: 0, total: 0 });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (editProduct) {
setFormData({
          Name: editProduct.name || "",
          category_c: editProduct.category || "",
          gold_type_c: editProduct.goldType || "",
          diamond_type_c: editProduct.diamondType || "",
          diamond_quality_c: editProduct.diamondQuality || "",
          diamond_color_c: editProduct.diamondColor || "",
          certificate_number_c: editProduct.certificateNumber || "",
          weight_c: editProduct.weight?.toString() || "",
          diamond_weight_c: editProduct.diamondWeight?.toString() || "",
          dimensions_c: editProduct.dimensions || "",
          specifications_c: editProduct.specifications || "",
          price_c: editProduct.price?.toString() || "0",
          description_c: editProduct.description || "",
          status_c: editProduct.status || "Available",
          barcode_c: editProduct.barcode || "",
          images_c: editProduct.images || "",
          making_charge_c: editProduct.makingCharge?.toString() || "0",
          labour_charge_c: editProduct.labourCharge?.toString() || "0",
          manualPricing: false
        });
      } else {
setFormData({
          Name: "",
          category_c: "",
          gold_type_c: "",
          diamond_type_c: "",
          diamond_quality_c: "",
          diamond_color_c: "",
          certificate_number_c: "",
          weight_c: "",
          diamond_weight_c: "",
          dimensions_c: "",
          specifications_c: "",
          price_c: "0",
          description_c: "",
          status_c: "Available",
          barcode_c: "",
          images_c: "",
          making_charge_c: "0",
          labour_charge_c: "0",
          manualPricing: false
        });
        setCalculatedPrice(0);
        setPriceBreakdown({ gold: 0, diamond: 0, total: 0 });
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

const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Calculate price automatically when relevant fields change
    if (['gold_type_c', 'diamond_type_c', 'diamond_quality_c', 'diamond_color_c', 'weight_c', 'diamond_weight_c'].includes(name) || name === 'manualPricing') {
      setTimeout(() => calculatePrice({ ...formData, [name]: newValue }), 100);
    }
  };
  
const calculatePrice = async (data = formData) => {
    if (data.manualPricing) return;
    
    try {
      const { pricingService } = await import('@/services/api/pricingService');
      
      if (data.gold_type_c && data.weight_c && parseFloat(data.weight_c) > 0) {
        const goldWeight = parseFloat(data.weight_c) || 0;
        const diamondWeight = parseFloat(data.diamond_weight_c) || 0;
        const makingCharge = parseFloat(data.making_charge_c) || 0;
        const labourCharge = parseFloat(data.labour_charge_c) || 0;
        
        const calculatedPrice = await pricingService.calculateProductPrice(
          data.gold_type_c,
          data.diamond_type_c || '',
          goldWeight,
          diamondWeight,
          data.diamond_quality_c || 'SI',
          data.diamond_color_c || 'F-G',
          makingCharge,
          labourCharge
        );
        
        // Calculate breakdown
        const goldRates = await pricingService.getGoldRates();
        const goldCost = goldWeight * (goldRates[data.gold_type_c] || 0);
        
        let diamondCost = 0;
        if (diamondWeight > 0 && data.diamond_type_c) {
          const diamondPrice = await pricingService.getDiamondPriceByCombo(
            data.diamond_type_c,
            data.diamond_quality_c || 'SI',
            data.diamond_color_c || 'F-G'
          );
          diamondCost = diamondWeight * (diamondPrice || 0);
        }
        
        setCalculatedPrice(calculatedPrice);
        setPriceBreakdown({
          gold: goldCost,
          diamond: diamondCost,
          making: makingCharge,
          labour: labourCharge,
          total: calculatedPrice
        });
        
        setFormData(prev => ({ ...prev, price_c: calculatedPrice.toString() }));
      }
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };
  
  // Calculate price when component mounts or edit product changes
  useEffect(() => {
    if (isOpen && !formData.manualPricing) {
      calculatePrice();
    }
  }, [isOpen, editProduct]);

const generateBarcode = () => {
    const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    return `4CD-${randomDigits}`;
  };

const validateForm = () => {
    const newErrors = {};

if (!formData.Name.trim()) newErrors.Name = "Product name is required";
    if (!formData.category_c) newErrors.category_c = "Category is required";
    if (!formData.gold_type_c) newErrors.gold_type_c = "Gold type is required";
    if (!formData.weight_c || parseFloat(formData.weight_c) <= 0) {
      newErrors.weight_c = "Valid gold weight is required";
    }
    
    // Validate making and labour charges
    const makingCharge = parseFloat(formData.making_charge_c);
    if (formData.making_charge_c && (isNaN(makingCharge) || makingCharge < 0)) {
      newErrors.making_charge_c = "Making charge must be a valid positive number";
    }
    
    const labourCharge = parseFloat(formData.labour_charge_c);
    if (formData.labour_charge_c && (isNaN(labourCharge) || labourCharge < 0)) {
      newErrors.labour_charge_c = "Labour charge must be a valid positive number";
    }
    
    // For diamonds, require quality and color if diamond weight is provided
    if (formData.diamond_weight_c && parseFloat(formData.diamond_weight_c) > 0) {
      if (!formData.diamond_type_c) newErrors.diamond_type_c = "Diamond type is required when diamond weight is specified";
      if (!formData.diamond_quality_c) newErrors.diamond_quality_c = "Diamond quality is required when diamond weight is specified";
      if (!formData.diamond_color_c) newErrors.diamond_color_c = "Diamond color is required when diamond weight is specified";
    }
    
    const priceValue = parseFloat(formData.price_c);
    if (!formData.price_c || isNaN(priceValue) || priceValue < 0) {
      newErrors.price_c = "Valid price is required";
    }
    if (!formData.description_c.trim()) newErrors.description_c = "Description is required";
    if (formData.certificate_number_c && !/^[A-Za-z0-9-]+$/.test(formData.certificate_number_c)) {
      newErrors.certificate_number_c = "Certificate number must be alphanumeric";
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
        Name: formData.Name,
        category_c: formData.category_c,
        gold_type_c: formData.gold_type_c,
        diamond_type_c: formData.diamond_type_c || '',
        diamond_quality_c: formData.diamond_quality_c || '',
        diamond_color_c: formData.diamond_color_c || '',
        certificate_number_c: formData.certificate_number_c || '',
        weight_c: parseFloat(formData.weight_c) || 0,
        diamond_weight_c: parseFloat(formData.diamond_weight_c) || 0,
        dimensions_c: formData.dimensions_c || '',
        specifications_c: formData.specifications_c || '',
        price_c: parseFloat(formData.price_c) || 0,
        description_c: formData.description_c,
        status_c: formData.status_c || 'Available',
        barcode_c: formData.barcode_c || generateBarcode(),
        images_c: formData.images_c || '',
        making_charge_c: parseFloat(formData.making_charge_c) || 0,
        labour_charge_c: parseFloat(formData.labour_charge_c) || 0
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
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="Enter product name"
              error={errors.Name}
              required
            />

            <FormField
              label="Category"
              name="category_c"
              type="select"
              value={formData.category_c}
              onChange={handleChange}
              options={[
                { value: "Rings", label: "Rings" },
                { value: "Earrings", label: "Earrings" },
                { value: "Necklaces", label: "Necklaces" },
                { value: "Bracelets", label: "Bracelets" }
              ]}
              error={errors.category_c}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Gold Type"
                name="gold_type_c"
                type="select"
                value={formData.gold_type_c}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Gold Type" },
                  { value: "14k", label: "14k Gold" },
                  { value: "18k", label: "18k Gold" },
                  { value: "22k", label: "22k Gold" },
                  { value: "24k Gold", label: "24k Gold" },
                  { value: "Silver", label: "Silver" }
                ]}
                error={errors.gold_type_c}
                required
              />

              <FormField
                label="Diamond Type"
                name="diamond_type_c"
                type="select"
                value={formData.diamond_type_c}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Diamond Type" },
                  { value: "round-brilliant", label: "Round Brilliant" },
                  { value: "marquise", label: "Marquise" },
                  { value: "princess", label: "Princess" },
                  { value: "baguette", label: "Baguette" }
                ]}
                error={errors.diamond_type_c}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label="Diamond Quality"
                name="diamond_quality_c"
                value={formData.diamond_quality_c}
                onChange={handleChange}
                error={errors.diamond_quality_c}
                type="select"
                options={[
                  { value: "", label: "Select Diamond Quality" },
                  { value: "SI", label: "SI - Slightly Included" },
                  { value: "VS-SI", label: "VS-SI - Very Slightly to Slightly Included" },
                  { value: "VS", label: "VS - Very Slightly Included" },
                  { value: "VS-VVS", label: "VS-VVS - Very Slightly to Very Very Slightly Included" },
                  { value: "VVS", label: "VVS - Very Very Slightly Included" },
                  { value: "IF", label: "IF - Internally Flawless" }
                ]}
              />

              <FormField
                label="Diamond Color"
                name="diamond_color_c"
                value={formData.diamond_color_c}
                onChange={handleChange}
                error={errors.diamond_color_c}
                type="select"
                options={[
                  { value: "", label: "Select Diamond Color" },
                  { value: "F-G", label: "F-G Grade" },
                  { value: "G-H", label: "G-H Grade" },
                  { value: "E-F", label: "E-F Grade" }
                ]}
              />

              <FormField
                label="Certificate Number"
                name="certificate_number_c"
                value={formData.certificate_number_c}
                onChange={handleChange}
                error={errors.certificate_number_c}
                placeholder="e.g., GIA-1234567890"
              />
            </div>

            {/* Weight Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Gold Weight (grams)"
                name="weight_c"
                type="number"
                step="0.01"
                min="0"
                value={formData.weight_c}
                onChange={handleChange}
                error={errors.weight_c}
                placeholder="0.00"
                required
              />

              <FormField
                label="Diamond Weight (carats)"
                name="diamond_weight_c"
                type="number"
                step="0.01"
                min="0"
                value={formData.diamond_weight_c}
                onChange={handleChange}
                error={errors.diamond_weight_c}
                placeholder="0.00"
              />
</div>

            {/* Making and Labour Charges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Making Charge (₹)"
                name="making_charge_c"
                type="number"
                step="0.01"
                min="0"
                value={formData.making_charge_c}
                onChange={handleChange}
                error={errors.making_charge_c}
                placeholder="0.00"
              />

              <FormField
                label="Labour Charge (₹)"
                name="labour_charge_c"
                type="number"
                step="0.01"
                min="0"
                value={formData.labour_charge_c}
                onChange={handleChange}
                error={errors.labour_charge_c}
                placeholder="0.00"
              />
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Pricing</h3>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="manualPricing"
                    checked={formData.manualPricing}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Manual Pricing (Solitaire/Colorstone)
                </label>
              </div>
              
              {!formData.manualPricing && calculatedPrice > 0 && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Gold Cost:</span>
                    <span>₹{priceBreakdown.gold.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diamond Cost:</span>
                    <span>₹{priceBreakdown.diamond.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Making Charge:</span>
                    <span>₹{priceBreakdown.making.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labour Charge:</span>
                    <span>₹{priceBreakdown.labour.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total Price:</span>
                    <span>₹{priceBreakdown.total.toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              <FormField
                label={formData.manualPricing ? "Manual Price (₹)" : "Calculated Price (₹)"}
                name="price_c"
                type="number"
                step="0.01"
                min="0"
                value={formData.price_c}
                onChange={handleChange}
                error={errors.price_c}
                placeholder="0.00"
                disabled={!formData.manualPricing}
                required
              />
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Dimensions"
                name="dimensions_c"
                value={formData.dimensions_c}
                onChange={handleChange}
                placeholder="e.g., 20mm x 15mm"
              />

              <FormField
                label="Status"
                name="status_c"
                type="select"
                value={formData.status_c}
                onChange={handleChange}
                options={[
                  { value: "Available", label: "Available" },
                  { value: "Reserved", label: "Reserved" },
                  { value: "Sold", label: "Sold" }
                ]}
              />
            </div>

            <FormField
              label="Specifications"
              name="specifications_c"
              type="textarea"
              value={formData.specifications_c}
              onChange={handleChange}
              placeholder="Technical specifications and details"
              rows={3}
            />

            <FormField
              label="Description"
              name="description_c"
              type="textarea"
              value={formData.description_c}
              onChange={handleChange}
              error={errors.description_c}
              placeholder="Product description"
              rows={3}
              required
            />

            <FormField
              label="Barcode"
              name="barcode_c"
              value={formData.barcode_c}
              onChange={handleChange}
              placeholder="Product barcode (auto-generated if empty)"
            />

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
                          images_c: prev.images_c ? prev.images_c + ',' + event.target.result : event.target.result
                        }));
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
{formData.images_c?.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images_c.split(',').filter(img => img.trim()).map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image.trim()} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const imageArray = formData.images_c.split(',').filter(img => img.trim());
                            imageArray.splice(index, 1);
                            setFormData(prev => ({
                              ...prev,
                              images_c: imageArray.join(',')
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