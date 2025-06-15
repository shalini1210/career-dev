
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, File } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: string;
}

const DownloadModal = ({ isOpen, onClose, documentType }: DownloadModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  const formats = [
    { id: 'pdf', name: 'PDF', icon: FileText, description: 'Best for sharing and printing' },
    { id: 'docx', name: 'Word Document', icon: File, description: 'Editable format' },
    { id: 'png', name: 'PNG Image', icon: Image, description: 'High-quality image format' }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Download {documentType}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose your preferred format to download your {documentType.toLowerCase()}.
          </p>
          
          <div className="space-y-2">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`w-full p-3 rounded-lg border transition-all ${
                  selectedFormat === format.id
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <format.icon className="h-5 w-5 mr-3 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium">{format.name}</div>
                    <div className="text-sm text-gray-500">{format.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isDownloading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDownload}
              className="flex-1"
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading...' : `Download ${selectedFormat.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadModal;
