import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProductList = ({ products, onEdit, onDelete }) => {
const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(price);
  };

  return (
<div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
<div className="overflow-x-auto">
        <table className="w-full">
            <thead
                className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
<tr>
                  <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700 text-sm sm:text-base">Product</th>
                  <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700 text-sm sm:text-base hidden sm:table-cell">Category</th>
                  <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700 text-sm sm:text-base hidden md:table-cell">Barcode</th>
                  <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700 text-sm sm:text-base hidden lg:table-cell">Diamond Quality</th>
                  <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700 text-sm sm:text-base">Price</th>
                  <th className="text-left py-3 px-3 sm:py-4 sm:px-6 font-semibold text-gray-700 text-sm sm:text-base">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => <motion.tr
key={product.Id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.3,
                        delay: index * 0.1
                    }}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200">
<td className="py-3 px-3 sm:py-4 sm:px-6">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{product.name}</div>
                        <div className="text-xs text-gray-500 sm:hidden">{product.category}</div>
                        <div className="text-xs text-gray-400 md:hidden">{product.barcode}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3 sm:py-4 sm:px-6 hidden sm:table-cell text-sm sm:text-base">
                        <div>
                            <div className="font-semibold text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {product.description}
                            </div>
                        </div>
                    </td>
<td className="py-3 px-3 sm:py-4 sm:px-6 hidden md:table-cell text-sm sm:text-base">
                        <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {product.category}
                        </span>
                    </td>
<td className="py-3 px-3 sm:py-4 sm:px-6 hidden lg:table-cell text-sm sm:text-base">
                        <div
                            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-3 py-2 inline-block">
                            <span className="font-mono text-sm font-bold text-gray-800">{product.barcode}</span>
                        </div>
                    </td>
<td className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.diamondQuality || 'N/A'}
                        </span>
                        {product.certificateNumber && (
                            <div className="text-xs text-gray-500 mt-1">
                                {product.certificateNumber}
                            </div>
                        )}
                    </td>
                    <td className="py-4 px-6">
<td className="py-3 px-3 sm:py-4 sm:px-6">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(product)}
                          className="text-xs sm:text-sm min-h-[32px] sm:min-h-[36px] px-2 sm:px-3"
                        >
                          <ApperIcon name="Edit2" className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => onDelete(product.Id)}
                          className="text-xs sm:text-sm min-h-[32px] sm:min-h-[36px] px-2 sm:px-3"
                        >
                          <ApperIcon name="Trash2" className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const formatPrice = (price) => {
  if (typeof price === 'number') {
    return `₹${price.toLocaleString('en-IN')}`;
  }
  return '₹0';
};

export default ProductList;
                            className="font-bold text-lg bg-gradient-to-r from-gold-600 to-gold-800 bg-clip-text text-transparent">
                            {formatPrice(product.price)}
                        </span>
                    </td>
                    <td className="py-4 px-6">
// Content handled in combined block above
                    </td>
                </motion.tr>)}
            </tbody>
        </table>
    </div>
</div>
  );
};
