import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";

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

// Enhanced camera device selection with fallback
  const getAvailableCamera = async () => {
    try {
const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error('No camera devices found');
      }
      
      // Prefer rear camera (environment facing) for mobile
      const rearCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      
      return rearCamera ? rearCamera.deviceId : videoDevices[0].deviceId;
    } catch (err) {
      console.warn('Device enumeration failed:', err);
      return null;
    }
  };
const startScanning = async (retryCount = 0) => {
    try {
      setError(null);
      setScanning(true);

      // Try to get optimal camera device
      const preferredDeviceId = await getAvailableCamera();
      
      // Configure video constraints optimized for mobile
      const videoConstraints = {
        width: { ideal: window.innerWidth < 768 ? 640 : 1280, min: 320 },
        height: { ideal: window.innerWidth < 768 ? 480 : 720, min: 240 },
        facingMode: preferredDeviceId ? undefined : 'environment'
      };
      
      if (preferredDeviceId) {
        videoConstraints.deviceId = { exact: preferredDeviceId };
      }

      // Get camera stream with enhanced error handling
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: videoConstraints
        });
      } catch (deviceError) {
        // Fallback: try any available camera
        if (preferredDeviceId && retryCount === 0) {
          console.warn('Preferred camera failed, trying fallback:', deviceError);
          return startScanning(1); // Retry once without device preference
        }
        
        // Final fallback: basic video request for mobile compatibility
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        });
      }
      
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });
      }

      // Initialize ZXing code reader with proper error handling
      codeReader.current = new BrowserMultiFormatReader();

      // Get actual device ID from stream for more reliable scanning
      const track = stream.getVideoTracks()[0];
      const actualDeviceId = track.getSettings().deviceId;

      // Start decoding with enhanced error handling
codeReader.current.decodeFromVideoDevice(
        actualDeviceId || undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            const barcode = result.getText();
            handleScanSuccess(barcode);
          }
          // Log scanning errors for debugging but continue scanning
          if (error && error.name !== 'NotFoundException') {
            console.warn('Scanning error:', error);
          }
        }
      );

    } catch (err) {
      console.error('Error starting scanner:', err);
      setHasPermission(false);
      
      // Enhanced error messaging
      let errorMessage;
      if (err.message.includes('Permission denied') || err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (err.message.includes('not found') || err.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please check that your device has a working camera.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not support the required settings.';
      } else {
        errorMessage = 'Unable to access camera. Please check your device settings and try again.';
}
      
      setError(errorMessage);
      setScanning(false);
    }
  };

  const stopScanning = () => {
// Enhanced cleanup with proper resource disposal
    try {
      // Stop and dispose of code reader
      if (codeReader.current) {
        codeReader.current.reset();
        codeReader.current = null;
      }
      
      // Stop video tracks with mobile compatibility
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => {
          track.stop();
          console.log('Stopped video track:', track.label);
        });
        videoRef.current.srcObject = null;
      }
    } catch (cleanupError) {
      console.warn('Error during scanner cleanup:', cleanupError);
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
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl overflow-hidden w-full max-w-md mx-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
<div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Scan Barcode</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
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
          <div className="p-3 sm:p-6">
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
                  
                  {/* Scanner Overlay - Responsive */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-28 sm:w-48 sm:h-32 border-2 border-white border-dashed rounded-lg bg-transparent">
                      <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t-4 border-l-4 border-gold-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-t-4 border-r-4 border-gold-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-b-4 border-l-4 border-gold-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b-4 border-r-4 border-gold-400 rounded-br-lg"></div>
                    </div>
                  </div>

                  {/* Scanning indicator */}
                  {scanning && (
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center space-x-2 bg-black bg-opacity-50 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full">
                        <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm">Scanning...</span>
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