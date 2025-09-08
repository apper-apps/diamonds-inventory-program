import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const CustomerModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    gstNumber: initialData?.gstNumber || ""
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = "Please enter a valid GST number (format: 22AAAAA0000A1Z5)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error submitting customer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      gstNumber: ""
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {initialData ? "Edit Customer" : "Add New Customer"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter customer details for invoice generation
              </p>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                    placeholder="Enter customer's full name"
                  />
                  
                  <FormField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                    placeholder="+91 98765 43210"
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      placeholder="customer@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="space-y-4">
                  <FormField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    placeholder="Street address, area, landmark"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                      required
                      placeholder="City name"
                    />
                    
                    <FormField
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      error={errors.state}
                      required
                      placeholder="State name"
                    />
                    
                    <FormField
                      label="PIN Code"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      error={errors.pincode}
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information (Optional)</h3>
                <FormField
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  error={errors.gstNumber}
                  placeholder="22AAAAA0000A1Z5"
                  help="15-character GST identification number for business customers"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    {initialData ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} />
                    {initialData ? "Update Customer" : "Add Customer"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomerModal;