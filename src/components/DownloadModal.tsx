
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, File } from 'lucide-react';
import { motion } from 'framer-motion';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
}

const DownloadModal = ({ isOpen, onClose, documentType }: DownloadModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  const formats = [
    { 
      id: 'pdf', 
      name: 'PDF', 
      icon: FileText, 
      description: 'Best for sharing and printing',
      color: 'from-red-500 to-pink-500'
    },
    { 
      id: 'docx', 
      name: 'Word Document', 
      icon: File, 
      description: 'Editable format',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'png', 
      name: 'PNG Image', 
      icon: Image, 
      description: 'High-quality image format',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      onClose();
      alert(`${documentType} downloaded as ${selectedFormat.toUpperCase()}!`);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <DialogHeader>
            <motion.div variants={itemVariants}>
              <DialogTitle className="flex items-center text-2xl">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <Download className="h-6 w-6 mr-3 text-purple-600" />
                </motion.div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Download {documentType}
                </span>
              </DialogTitle>
            </motion.div>
          </DialogHeader>
          
          <div className="space-y-6">
            <motion.p variants={itemVariants} className="text-gray-600 text-lg">
              Choose your preferred format to download your {documentType.toLowerCase()}.
            </motion.p>
            
            <motion.div variants={itemVariants} className="space-y-3">
              {formats.map((format) => (
                <motion.button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedFormat === format.id
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                  whileHover={{ 
                    scale: 1.02,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <motion.div 
                      className={`p-3 rounded-lg bg-gradient-to-r ${format.color} text-white mr-4 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <format.icon className="h-6 w-6" />
                    </motion.div>
                    <div className="text-left">
                      <div className="font-semibold text-lg text-gray-800">{format.name}</div>
                      <div className="text-gray-600">{format.description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex space-x-3 pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 text-lg"
                  disabled={isDownloading}
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button 
                  onClick={handleDownload}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg transform transition-all duration-200"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Downloading...
                    </motion.div>
                  ) : (
                    `Download ${selectedFormat.toUpperCase()}`
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadModal;
