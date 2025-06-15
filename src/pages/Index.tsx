
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BarChart3, MapPin, Mail, Plus, Download, Eye, Star, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
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
      color: 'from-purple-500 via-pink-500 to-red-500',
      features: ['ATS-Friendly Templates', 'Real-time Preview', 'Multiple Formats']
    },
    {
      id: 'resume-analyzer',
      title: 'Resume Analyzer',
      description: 'Get AI-powered insights and improvement suggestions',
      icon: BarChart3,
      color: 'from-blue-500 via-cyan-500 to-teal-500',
      features: ['ATS Score', 'Keyword Analysis', 'Improvement Tips']
    },
    {
      id: 'roadmap-builder',
      title: 'Career Roadmap',
      description: 'Plan your career path with visual timelines',
      icon: MapPin,
      color: 'from-green-500 via-emerald-500 to-lime-500',
      features: ['Goal Setting', 'Milestone Tracking', 'Timeline View']
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Builder',
      description: 'Generate compelling cover letters for any job',
      icon: Mail,
      color: 'from-orange-500 via-amber-500 to-yellow-500',
      features: ['Job-Specific Content', 'AI Writing', 'Professional Templates']
    }
  ];

  const handleDownload = (type: string) => {
    setDownloadType(type);
    setShowDownloadModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'auth':
        return <AuthForm onBack={() => setActiveTab('dashboard')} />;
      case 'resume-builder':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Resume Builder</h1>
              <Button onClick={() => handleDownload('Resume')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200">
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            </div>
            <ResumeBuilder />
          </motion.div>
        );
      case 'resume-analyzer':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResumeAnalyzer />
          </motion.div>
        );
      case 'roadmap-builder':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RoadmapBuilder />
          </motion.div>
        );
      case 'cover-letter':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">Cover Letter Builder</h1>
              <Button onClick={() => handleDownload('Cover Letter')} className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 transform hover:scale-105 transition-all duration-200">
                <Download className="h-4 w-4 mr-2" />
                Download Letter
              </Button>
            </div>
            <CoverLetterBuilder />
          </motion.div>
        );
      default:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Hero Section */}
            <motion.div
              variants={itemVariants}
              className="text-center py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl text-white relative overflow-hidden"
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-20">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute bottom-10 right-10 w-16 h-16 bg-yellow-300 rounded-full"
                />
                <motion.div
                  animate={{
                    y: [-20, 20, -20],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/2 left-1/4 w-8 h-8 bg-green-400 rotate-45"
                />
              </div>
              
              <div className="relative z-10">
                <motion.h1
                  variants={itemVariants}
                  className="text-5xl md:text-7xl font-bold mb-6"
                >
                  Build Your Career
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-xl md:text-2xl opacity-90 mb-8"
                >
                  Professional tools to create, analyze, and optimize your job applications
                </motion.p>
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <Button 
                    onClick={() => setActiveTab('resume-builder')}
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Start Building
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('auth')}
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-200"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Tools Grid */}
            <motion.div
              variants={itemVariants}
              className="grid md:grid-cols-2 gap-8"
            >
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className="group cursor-pointer transition-all duration-300 hover:shadow-2xl overflow-hidden border-0 shadow-lg bg-white/90 backdrop-blur-sm"
                    onClick={() => setActiveTab(tool.id)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <motion.div 
                          className={`p-4 rounded-xl bg-gradient-to-r ${tool.color} text-white shadow-lg`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <tool.icon className="h-8 w-8" />
                        </motion.div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300">
                          Launch Tool
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{tool.title}</h3>
                      <p className="text-gray-600 mb-4 text-lg">{tool.description}</p>
                      <div className="space-y-3">
                        {tool.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center text-sm"
                          >
                            <Star className="h-4 w-4 text-yellow-500 mr-3 fill-current" />
                            {feature}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <Testimonials />

            {/* Stats Section */}
            <motion.div
              variants={itemVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                { value: "10,000+", label: "Resumes Created", color: "from-purple-500 to-pink-500" },
                { value: "95%", label: "ATS Pass Rate", color: "from-blue-500 to-cyan-500" },
                { value: "5,000+", label: "Jobs Landed", color: "from-green-500 to-emerald-500" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="text-center p-8 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300">
                    <motion.div
                      className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-gray-600 text-lg">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
    }
  };

  if (activeTab === 'auth') {
    return <AuthForm onBack={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-100 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
                onClick={() => setActiveTab('dashboard')}
              >
                CareerCraft
              </div>
            </motion.div>
            <div className="hidden md:flex space-x-1">
              {tools.map((tool) => (
                <motion.div
                  key={tool.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={activeTab === tool.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tool.id)}
                    className={`flex items-center ${
                      activeTab === tool.id 
                        ? `bg-gradient-to-r ${tool.color} text-white` 
                        : 'hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100'
                    }`}
                  >
                    <tool.icon className="h-4 w-4 mr-1" />
                    {tool.title}
                  </Button>
                </motion.div>
              ))}
            </div>
            <div className="flex space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab('auth')}
                  className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('dashboard')}
                  className="border-purple-300 text-purple-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100"
                >
                  Dashboard
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="flex overflow-x-auto space-x-1 p-2">
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeTab === tool.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tool.id)}
                className={`flex items-center whitespace-nowrap ${
                  activeTab === tool.id 
                    ? `bg-gradient-to-r ${tool.color} text-white` 
                    : 'hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100'
                }`}
              >
                <tool.icon className="h-4 w-4 mr-1" />
                {tool.title}
              </Button>
            </motion.div>
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
