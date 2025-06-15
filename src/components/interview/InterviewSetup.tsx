
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface InterviewSetupProps {
  jobTitle: string;
  setJobTitle: (title: string) => void;
  onStartInterview: () => void;
}

const InterviewSetup = ({ jobTitle, setJobTitle, onStartInterview }: InterviewSetupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Start Voice Interview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title / Position
            </label>
            <Input
              id="jobTitle"
              placeholder="e.g., Software Engineer, Marketing Manager, Data Scientist"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 mb-2 font-medium">Before starting:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Make sure your microphone is working</li>
              <li>• Find a quiet environment</li>
              <li>• Speak clearly and at normal pace</li>
              <li>• The AI will ask questions and wait for your responses</li>
            </ul>
          </div>
          <Button 
            onClick={onStartInterview} 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 text-lg"
          >
            Start Voice Interview
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InterviewSetup;
