import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const BarcodeScanner = ({ isOpen, onClose, onScan }) => {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    try {
      setError(null);
      setScanning(true);

      // Check for camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use rear camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize ZXing code reader
      codeReader.current = new BrowserMultiFormatReader();

      // Start decoding from video element
      codeReader.current.decodeFromVideoDevice(
        undefined, // Use default video device
        videoRef.current,
        (result, error) => {
          if (result) {
            const barcode = result.getText();
            handleScanSuccess(barcode);
          }
          // Continue scanning even if no barcode found
        }
      );

    } catch (err) {
      console.error('Error starting scanner:', err);
      setHasPermission(false);
      setError(err.message.includes('Permission denied') 
        ? 'Camera permission denied. Please allow camera access and try again.'
        : 'Unable to access camera. Please check your device settings.'
      );
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setScanning(false);
  };

  const handleScanSuccess = (barcode) => {
    toast.success(`Barcode scanned: ${barcode}`);
    onScan(barcode);
    onClose();
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl overflow-hidden w-full max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Scan Barcode</h2>
              <p className="text-sm text-gray-600 mt-1">
                Point camera at product barcode
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-2"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          {/* Scanner Content */}
          <div className="p-6">
            {error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={startScanning} variant="outline">
                  <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : hasPermission === false ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Camera" className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-gray-600 mb-4">
                  Camera access required for barcode scanning
                </p>
                <Button onClick={startScanning}>
                  Allow Camera Access
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Video Preview */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Scanner Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-32 border-2 border-white border-dashed rounded-lg bg-transparent">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-gold-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-gold-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-gold-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-gold-400 rounded-br-lg"></div>
                    </div>
                  </div>

                  {/* Scanning indicator */}
                  {scanning && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center space-x-2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full">
                        <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
                        <span className="text-sm">Scanning...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Position the barcode within the frame above
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BarcodeScanner;