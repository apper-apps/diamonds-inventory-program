import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const InvoiceModal = ({ isOpen, onClose, invoiceData }) => {
  const printRef = useRef();

  if (!invoiceData) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '_blank');
    
    windowPrint.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .invoice-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; color: #d4af37; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .customer-details, .invoice-info { width: 45%; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .table th { background-color: #f5f5f5; font-weight: bold; }
            .totals { text-align: right; margin-top: 20px; }
            .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
            .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; }
            .gst-info { margin-top: 30px; font-size: 12px; color: #666; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    windowPrint.document.close();
    windowPrint.focus();
    windowPrint.print();
    windowPrint.close();
  };

  const handleEmail = () => {
    const subject = `Invoice ${invoiceData.invoiceNumber}`;
    const body = `Dear ${invoiceData.customer.name},

Please find your invoice details below:

Invoice Number: ${invoiceData.invoiceNumber}
Date: ${invoiceData.invoiceDate}
Total Amount: ₹${invoiceData.totalAmount.toLocaleString()}

Thank you for your business!

Best regards,
${invoiceData.company.name}`;

    const mailtoLink = `mailto:${invoiceData.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoiceData.invoiceNumber}`,
          text: `Invoice from ${invoiceData.company.name} for ₹${invoiceData.totalAmount.toLocaleString()}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
        toast.info('Share failed - copied invoice number to clipboard');
        navigator.clipboard.writeText(invoiceData.invoiceNumber);
      }
    } else {
      navigator.clipboard.writeText(invoiceData.invoiceNumber);
      toast.success('Invoice number copied to clipboard');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">
                Invoice Generated Successfully
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Printer" size={16} />
                  Print
                </Button>
                
                <Button
                  onClick={handleEmail}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Mail" size={16} />
                  Email
                </Button>
                
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Share" size={16} />
                  Share
                </Button>
                
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div ref={printRef} className="p-8 bg-white">
                {/* Invoice Header */}
                <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                  <h1 className="text-3xl font-bold text-gold-600 mb-2">
                    {invoiceData.company.name}
                  </h1>
                  <p className="text-gray-600">{invoiceData.company.address}</p>
                  <p className="text-gray-600">
                    {invoiceData.company.city}, {invoiceData.company.state} - {invoiceData.company.pincode}
                  </p>
                  <div className="flex justify-center gap-6 mt-2 text-sm text-gray-600">
                    <span>Phone: {invoiceData.company.phone}</span>
                    <span>Email: {invoiceData.company.email}</span>
                    <span>Website: {invoiceData.company.website}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    GST No: {invoiceData.company.gstNumber}
                  </p>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
                    <div className="text-gray-700">
                      <p className="font-medium text-lg">{invoiceData.customer.name}</p>
                      <p>{invoiceData.customer.address}</p>
                      <p>{invoiceData.customer.city}, {invoiceData.customer.state}</p>
                      <p>PIN: {invoiceData.customer.pincode}</p>
                      <p>Phone: {invoiceData.customer.phone}</p>
                      <p>Email: {invoiceData.customer.email}</p>
                      {invoiceData.customer.gstNumber && (
                        <p className="font-medium">GST No: {invoiceData.customer.gstNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Invoice Details:</h3>
                    <div className="text-gray-700 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Invoice Number:</span>
                        <span className="font-mono">{invoiceData.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Invoice Date:</span>
                        <span>{invoiceData.invoiceDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Due Date:</span>
                        <span>{invoiceData.dueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Payment Method:</span>
                        <span className="capitalize">{invoiceData.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Items:</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left">S.No</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Product</th>
                          <th className="border border-gray-300 px-4 py-3 text-left">Barcode</th>
                          <th className="border border-gray-300 px-4 py-3 text-right">Qty</th>
                          <th className="border border-gray-300 px-4 py-3 text-right">Rate (₹)</th>
                          <th className="border border-gray-300 px-4 py-3 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.itemsWithDetails.map((item, index) => (
                          <tr key={item.productId}>
                            <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-3">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600">{item.category}</div>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 font-mono text-sm">
                              {item.barcode}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right">
                              {item.quantity}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right">
                              {item.price.toLocaleString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                              {item.total.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Subtotal:</span>
                      <span>₹{invoiceData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium">GST ({invoiceData.gstRate}%):</span>
                      <span>₹{invoiceData.gstAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-gray-800 font-bold text-lg">
                      <span>Grand Total:</span>
                      <span>₹{invoiceData.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* GST Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2 font-medium">GST Summary:</p>
                  <div className="text-xs text-gray-500">
                    <p>• This is a computer generated invoice and does not require signature.</p>
                    <p>• GST is calculated as per prevailing tax rates on jewelry items.</p>
                    <p>• All disputes subject to Mumbai jurisdiction only.</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center">
                  <p className="text-sm text-gray-600 mb-2">Thank you for your business!</p>
                  <p className="text-xs text-gray-500">
                    For any queries regarding this invoice, please contact us at {invoiceData.company.email}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InvoiceModal;