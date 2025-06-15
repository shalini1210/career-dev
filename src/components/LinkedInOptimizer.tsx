
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Linkedin, Search, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import LinkedInAnalysisResults from './linkedin/LinkedInAnalysisResults';
import { LinkedInAnalysis } from '@/types/linkedin';
import { supabase } from '@/integrations/supabase/client';

const LinkedInOptimizer = () => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);
  const { toast } = useToast();

  const validateLinkedInUrl = (url: string): boolean => {
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedinPattern.test(url);
  };

  const handleAnalyze = async () => {
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

    setIsAnalyzing(true);
    try {
      console.log('Starting LinkedIn profile analysis for:', linkedinUrl);
      
      const { data, error } = await supabase.functions.invoke('analyze-linkedin-profile', {
        body: { url: linkedinUrl },
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
            Get AI-powered insights and suggestions to optimize your LinkedIn profile for better visibility and opportunities.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Analyze Your LinkedIn Profile
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
                  disabled={isAnalyzing}
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
              <div className="flex gap-3">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing}
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
                {analysis && (
                  <Button variant="outline" onClick={handleReset}>
                    Analyze Another
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LinkedInAnalysisResults analysis={analysis} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LinkedInOptimizer;
