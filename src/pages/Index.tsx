
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  Linkedin,
  BookOpen,
  MessageSquare,
  Download
} from "lucide-react";

import ResumeBuilder from "@/components/ResumeBuilder";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import CoverLetterBuilder from "@/components/CoverLetterBuilder";
import SalaryGuide from "@/components/SalaryGuide";
import LinkedInOptimizer from "@/components/LinkedInOptimizer";
import RoadmapBuilder from "@/components/RoadmapBuilder";
import ProjectFeedback from "@/components/ProjectFeedback";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

type ActiveTool = 'resume-builder' | 'resume-analyzer' | 'cover-letter' | 'salary-guide' | 'linkedin-optimizer' | 'roadmap' | 'project-feedback' | null;

const Index = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);

  if (activeTool) {
    const renderTool = () => {
      switch (activeTool) {
        case 'resume-builder':
          return <ResumeBuilder />;
        case 'resume-analyzer':
          return <ResumeAnalyzer />;
        case 'cover-letter':
          return <CoverLetterBuilder />;
        case 'salary-guide':
          return <SalaryGuide />;
        case 'linkedin-optimizer':
          return <LinkedInOptimizer />;
        case 'roadmap':
          return <RoadmapBuilder />;
        case 'project-feedback':
          return <ProjectFeedback />;
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen">
        <div className="p-4">
          <Button 
            onClick={() => setActiveTool(null)}
            variant="outline"
            className="mb-4"
          >
            ← Back to Tools
          </Button>
        </div>
        {renderTool()}
      </div>
    );
  }

  const tools = [
    {
      id: 'resume-builder' as ActiveTool,
      title: "AI Resume Builder",
      description: "Create a professional resume with AI assistance",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      id: 'resume-analyzer' as ActiveTool,
      title: "Resume Analyzer",
      description: "Get AI feedback on your existing resume",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      id: 'cover-letter' as ActiveTool,
      title: "Cover Letter Builder",
      description: "Generate personalized cover letters",
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    },
    {
      id: 'linkedin-optimizer' as ActiveTool,
      title: "LinkedIn Profile Optimizer",
      description: "Optimize your LinkedIn profile with AI insights",
      icon: Linkedin,
      color: "from-blue-600 to-indigo-600",
      hoverColor: "hover:from-blue-700 hover:to-indigo-700"
    },
    {
      id: 'salary-guide' as ActiveTool,
      title: "Salary Guide",
      description: "Research salary ranges for your target roles",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      hoverColor: "hover:from-yellow-600 hover:to-orange-600"
    },
    {
      id: 'roadmap' as ActiveTool,
      title: "Career Roadmap",
      description: "Get a personalized career development plan",
      icon: BookOpen,
      color: "from-indigo-500 to-purple-500",
      hoverColor: "hover:from-indigo-600 hover:to-purple-600"
    },
    {
      id: 'project-feedback' as ActiveTool,
      title: "Project Feedback",
      description: "Get AI feedback on your portfolio projects",
      icon: Briefcase,
      color: "from-teal-500 to-cyan-500",
      hoverColor: "hover:from-teal-600 hover:to-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Career Tools
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your career with our comprehensive suite of AI-powered tools. 
            Build resumes, optimize LinkedIn profiles, get salary insights, and accelerate your professional growth.
          </p>
        </motion.div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            Choose Your Career Tool
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={() => setActiveTool(tool.id)}>
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center mb-6">
                        {tool.description}
                      </p>
                      <Button 
                        className={`w-full bg-gradient-to-r ${tool.color} ${tool.hoverColor} text-white font-medium py-2 px-4 rounded-lg transition-all duration-300`}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
