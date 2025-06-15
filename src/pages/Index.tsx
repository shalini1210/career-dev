
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BarChart3, MapPin, Mail, Plus, Download, Eye, Star } from 'lucide-react';
import ResumeBuilder from '@/components/ResumeBuilder';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import RoadmapBuilder from '@/components/RoadmapBuilder';
import CoverLetterBuilder from '@/components/CoverLetterBuilder';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tools = [
    {
      id: 'resume-builder',
      title: 'Resume Builder',
      description: 'Create professional resumes with our modern templates',
      icon: FileText,
      color: 'from-blue-500 to-purple-600',
      features: ['ATS-Friendly Templates', 'Real-time Preview', 'Multiple Formats']
    },
    {
      id: 'resume-analyzer',
      title: 'Resume Analyzer',
      description: 'Get AI-powered insights and improvement suggestions',
      icon: BarChart3,
      color: 'from-green-500 to-teal-600',
      features: ['ATS Score', 'Keyword Analysis', 'Improvement Tips']
    },
    {
      id: 'roadmap-builder',
      title: 'Career Roadmap',
      description: 'Plan your career path with visual timelines',
      icon: MapPin,
      color: 'from-orange-500 to-red-600',
      features: ['Goal Setting', 'Milestone Tracking', 'Timeline View']
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Builder',
      description: 'Generate compelling cover letters for any job',
      icon: Mail,
      color: 'from-purple-500 to-pink-600',
      features: ['Job-Specific Content', 'AI Writing', 'Professional Templates']
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'resume-builder':
        return <ResumeBuilder />;
      case 'resume-analyzer':
        return <ResumeAnalyzer />;
      case 'roadmap-builder':
        return <RoadmapBuilder />;
      case 'cover-letter':
        return <CoverLetterBuilder />;
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl text-white">
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
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Start Building
                </Button>
                <Button 
                  onClick={() => setActiveTab('resume-analyzer')}
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analyze Resume
                </Button>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {tools.map((tool) => (
                <Card 
                  key={tool.id} 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                  onClick={() => setActiveTab(tool.id)}
                >
                  <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${tool.color} text-white`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Launch Tool
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                    <p className="text-muted-foreground mb-4">{tool.description}</p>
                    <div className="space-y-2">
                      {tool.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Star className="h-4 w-4 text-yellow-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-muted-foreground">Resumes Created</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-muted-foreground">ATS Pass Rate</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">5,000+</div>
                <div className="text-muted-foreground">Jobs Landed</div>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div 
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b">
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
    </div>
  );
};

export default Index;
