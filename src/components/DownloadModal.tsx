
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
  content?: string;
}

const DownloadModal = ({ isOpen, onClose, documentType, content }: DownloadModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

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
      id: 'txt', 
      name: 'Text File', 
      icon: FileText, 
      description: 'Simple text format',
      color: 'from-gray-500 to-gray-600'
    },
    { 
      id: 'png', 
      name: 'PNG Image', 
      icon: Image, 
      description: 'High-quality image format',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const downloadAsTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePDFContent = (content: string) => {
    // Create a simple HTML content for PDF conversion
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${documentType}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              margin: 40px; 
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .content {
              white-space: pre-line;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${documentType}</h1>
          </div>
          <div class="content">${content}</div>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentType.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    if (!content) {
      toast({
        title: "No content to download",
        description: "Please generate content first before downloading.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    
    try {
      const filename = `${documentType.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      
      switch (selectedFormat) {
        case 'txt':
          downloadAsTextFile(content, `${filename}.txt`);
          break;
        case 'pdf':
          // For now, we'll download as HTML which can be converted to PDF
          generatePDFContent(content);
          break;
        case 'docx':
          // Download as rich text format that can be opened in Word
          const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}} \\f0\\fs24 ${content.replace(/\n/g, '\\par ')}}`;
          const blob = new Blob([rtfContent], { type: 'application/rtf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.rtf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          break;
        case 'png':
          // Create a canvas with the text content
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 800;
          canvas.height = 1000;
          
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.font = '14px Arial';
            
            const lines = content.split('\n');
            let y = 40;
            lines.forEach(line => {
              if (y < canvas.height - 20) {
                ctx.fillText(line, 40, y);
                y += 20;
              }
            });
            
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${filename}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
            });
          }
          break;
        default:
          downloadAsTextFile(content, `${filename}.txt`);
      }

      toast({
        title: "Download started",
        description: `Your ${documentType.toLowerCase()} is being downloaded as ${selectedFormat.toUpperCase()}.`,
      });

      setTimeout(() => {
        setIsDownloading(false);
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your file. Please try again.",
        variant: "destructive",
      });
      setIsDownloading(false);
    }
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
