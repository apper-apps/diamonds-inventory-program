import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProductList = ({ products, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  return (
    <div
    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
        <table className="w-full">
            <thead
                className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Barcode</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => <motion.tr
                    key={product.Id}
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
                    <td className="py-4 px-6">
                        <div>
                            <div className="font-semibold text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {product.description}
                            </div>
                        </div>
                    </td>
                    <td className="py-4 px-6">
                        <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {product.category}
                        </span>
                    </td>
                    <td className="py-4 px-6">
                        <div
                            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-3 py-2 inline-block">
                            <span className="font-mono text-lg font-bold text-gray-800">{product.barcode}</span>
                        </div>
                    </td>
                    <td className="py-4 px-6">
                        <span
                            className="font-bold text-lg bg-gradient-to-r from-gold-600 to-gold-800 bg-clip-text text-transparent">
                            {formatPrice(product.price)}
                        </span>
                    </td>
                    <td className="py-4 px-6">
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(product)}
                                className="hover:bg-blue-50 hover:border-blue-300">
                                <ApperIcon name="Edit2" className="w-4 h-4 mr-1" />Edit
                                                    </Button>
                            <Button variant="danger" size="sm" onClick={() => onDelete(product.Id)}>
                                <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />Delete
                                                    </Button>
                        </div>
                    </td>
                </motion.tr>)}
            </tbody>
        </table>
    </div>
</div>
  );
};

export default ProductList;