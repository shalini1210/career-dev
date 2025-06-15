
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Linkedin, Search, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import LinkedInAnalysisResults from './linkedin/LinkedInAnalysisResults';
import { LinkedInAnalysis } from '@/types/linkedin';
import { supabase } from '@/integrations/supabase/client';

const LinkedInOptimizer = () => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [showDomainSelection, setShowDomainSelection] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);
  const { toast } = useToast();

  const domains = [
    { value: 'software-development', label: 'Software Development' },
    { value: 'data-science', label: 'Data Science & Analytics' },
    { value: 'product-management', label: 'Product Management' },
    { value: 'design', label: 'UI/UX Design' },
    { value: 'marketing', label: 'Digital Marketing' },
    { value: 'sales', label: 'Sales & Business Development' },
    { value: 'finance', label: 'Finance & Accounting' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'engineering', label: 'Engineering (Non-Software)' },
    { value: 'operations', label: 'Operations & Supply Chain' },
    { value: 'legal', label: 'Legal' },
    { value: 'other', label: 'Other' }
  ];

  const validateLinkedInUrl = (url: string): boolean => {
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedinPattern.test(url);
  };

  const handleUrlSubmit = () => {
    if (!linkedinUrl.trim()) {
      toast({
        title: 'LinkedIn URL Required',
        description: 'Please enter your LinkedIn profile URL.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateLinkedInUrl(linkedinUrl)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)',
        variant: 'destructive',
      });
      return;
    }

    setShowDomainSelection(true);
  };

  const handleAnalyze = async () => {
    if (!selectedDomain) {
      toast({
        title: 'Domain Required',
        description: 'Please select your professional domain.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Starting LinkedIn profile analysis for:', linkedinUrl, 'Domain:', selectedDomain);
      
      const { data, error } = await supabase.functions.invoke('analyze-linkedin-profile', {
        body: { 
          url: linkedinUrl,
          domain: selectedDomain 
        },
      });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to analyze profile');
      }

      if (!data) {
        throw new Error('No data returned from analysis');
      }

      setAnalysis(data);
      
      toast({
        title: 'Analysis Complete!',
        description: 'Your LinkedIn profile has been analyzed successfully.',
      });
    } catch (error) {
      console.error('Error analyzing LinkedIn profile:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze your LinkedIn profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setLinkedinUrl('');
    setSelectedDomain('');
    setShowDomainSelection(false);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Linkedin className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">LinkedIn Profile Optimizer</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get AI-powered insights and suggestions tailored to your professional domain to optimize your LinkedIn profile for better visibility and opportunities.
          </p>
        </motion.div>

        {/* URL Input Section */}
        {!showDomainSelection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Enter Your LinkedIn Profile URL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile URL
                  </label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/yourname"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2 font-medium">How to find your LinkedIn URL:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Go to your LinkedIn profile</li>
                    <li>• Click "Edit public profile & URL" on the right</li>
                    <li>• Copy the URL from the "Public profile URL" section</li>
                    <li>• Make sure your profile is set to public for best analysis</li>
                  </ul>
                </div>
                <Button 
                  onClick={handleUrlSubmit} 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 text-lg"
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Domain Selection Section */}
        {showDomainSelection && !analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Select Your Professional Domain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                    What's your primary professional domain?
                  </label>
                  <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                    <SelectTrigger className="text-lg">
                      <SelectValue placeholder="Choose your domain..." />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain.value} value={domain.value}>
                          {domain.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800 mb-2 font-medium">Why we ask for your domain:</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Get industry-specific optimization suggestions</li>
                    <li>• Receive relevant skill recommendations</li>
                    <li>• Get tailored headline and summary advice</li>
                    <li>• Learn domain-specific best practices</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDomainSelection(false)}
                    className="flex-1"
                  >
                    ← Back
                  </Button>
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing || !selectedDomain}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 text-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing Profile...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analyze Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4">
              <Button variant="outline" onClick={handleReset}>
                ← Analyze Another Profile
              </Button>
            </div>
            <LinkedInAnalysisResults analysis={analysis} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LinkedInOptimizer;
