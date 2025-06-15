
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BarChart3, MapPin, Mail, Plus, Download, Eye, Star, LogIn, UserPlus } from 'lucide-react';
import ResumeBuilder from '@/components/ResumeBuilder';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import RoadmapBuilder from '@/components/RoadmapBuilder';
import CoverLetterBuilder from '@/components/CoverLetterBuilder';
import AuthForm from '@/components/AuthForm';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import DownloadModal from '@/components/DownloadModal';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadType, setDownloadType] = useState('');

  const tools = [
    {
      id: 'resume-builder',
      title: 'Resume Builder',
      description: 'Create professional resumes with our modern templates',
      icon: FileText,
      color: 'from-gray-900 to-gray-600',
      features: ['ATS-Friendly Templates', 'Real-time Preview', 'Multiple Formats']
    },
    {
      id: 'resume-analyzer',
      title: 'Resume Analyzer',
      description: 'Get AI-powered insights and improvement suggestions',
      icon: BarChart3,
      color: 'from-gray-700 to-gray-500',
      features: ['ATS Score', 'Keyword Analysis', 'Improvement Tips']
    },
    {
      id: 'roadmap-builder',
      title: 'Career Roadmap',
      description: 'Plan your career path with visual timelines',
      icon: MapPin,
      color: 'from-gray-800 to-gray-600',
      features: ['Goal Setting', 'Milestone Tracking', 'Timeline View']
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Builder',
      description: 'Generate compelling cover letters for any job',
      icon: Mail,
      color: 'from-gray-600 to-gray-400',
      features: ['Job-Specific Content', 'AI Writing', 'Professional Templates']
    }
  ];

  const handleDownload = (type: string) => {
    setDownloadType(type);
    setShowDownloadModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'auth':
        return <AuthForm onBack={() => setActiveTab('dashboard')} />;
      case 'resume-builder':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
              <Button onClick={() => handleDownload('Resume')} className="bg-gray-900 hover:bg-gray-800">
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            </div>
            <ResumeBuilder />
          </div>
        );
      case 'resume-analyzer':
        return <ResumeAnalyzer />;
      case 'roadmap-builder':
        return <RoadmapBuilder />;
      case 'cover-letter':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Cover Letter Builder</h1>
              <Button onClick={() => handleDownload('Cover Letter')} className="bg-gray-900 hover:bg-gray-800">
                <Download className="h-4 w-4 mr-2" />
                Download Letter
              </Button>
            </div>
            <CoverLetterBuilder />
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 rounded-2xl text-white relative overflow-hidden">
              {/* Decorative lines */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
                <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
              </div>
              
              <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Build Your Career
                </h1>
                <p className="text-xl md:text-2xl opacity-90 mb-8">
                  Professional tools to create, analyze, and optimize your job applications
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    onClick={() => setActiveTab('resume-builder')}
                    size="lg" 
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Start Building
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('auth')}
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-gray-900"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool) => (
                <Card 
                  key={tool.id} 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-gray-200"
                  onClick={() => setActiveTab(tool.id)}
                >
                  <div className={`h-1 bg-gradient-to-r ${tool.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${tool.color} text-white`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-900">
                        Launch Tool
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{tool.title}</h3>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <div className="space-y-2">
                      {tool.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Star className="h-4 w-4 text-gray-600 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Testimonials />

            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center p-6 border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
                <div className="text-gray-600">Resumes Created</div>
              </Card>
              <Card className="text-center p-6 border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
                <div className="text-gray-600">ATS Pass Rate</div>
              </Card>
              <Card className="text-center p-6 border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">5,000+</div>
                <div className="text-gray-600">Jobs Landed</div>
              </Card>
            </div>
          </div>
        );
    }
  };

  if (activeTab === 'auth') {
    return <AuthForm onBack={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div 
                className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent cursor-pointer"
                onClick={() => setActiveTab('dashboard')}
              >
                CareerCraft
              </div>
            </div>
            <div className="hidden md:flex space-x-1">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTab === tool.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tool.id)}
                  className="flex items-center"
                >
                  <tool.icon className="h-4 w-4 mr-1" />
                  {tool.title}
                </Button>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveTab('auth')}
                className="text-gray-700 hover:text-gray-900"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab('dashboard')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex overflow-x-auto space-x-1 p-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTab === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tool.id)}
              className="flex items-center whitespace-nowrap"
            >
              <tool.icon className="h-4 w-4 mr-1" />
              {tool.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      {activeTab === 'dashboard' && <Footer />}

      {/* Download Modal */}
      <DownloadModal 
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        documentType={downloadType}
      />
    </div>
  );
};

export default Index;
