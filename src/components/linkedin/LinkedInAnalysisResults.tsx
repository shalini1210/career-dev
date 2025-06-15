
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  User,
  FileText,
  Briefcase,
  Award,
  Camera
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LinkedInAnalysis } from '@/types/linkedin';

interface LinkedInAnalysisResultsProps {
  analysis: LinkedInAnalysis;
}

const LinkedInAnalysisResults = ({ analysis }: LinkedInAnalysisResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <TrendingUp className="h-6 w-6" />
            Overall Profile Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getScoreColor(analysis.overall_score)}`}>
              {analysis.overall_score}/100
            </div>
            <p className={`text-xl font-medium mt-2 ${getScoreColor(analysis.overall_score)}`}>
              {getScoreLabel(analysis.overall_score)}
            </p>
            <Progress 
              value={analysis.overall_score} 
              className="mt-4 h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Headline</span>
              </div>
              <div className="text-right">
                <span className={`font-bold ${getScoreColor(analysis.headline_score)}`}>
                  {analysis.headline_score}/100
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                <span className="font-medium">Summary</span>
              </div>
              <div className="text-right">
                <span className={`font-bold ${getScoreColor(analysis.summary_score)}`}>
                  {analysis.summary_score}/100
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Experience</span>
              </div>
              <div className="text-right">
                <span className={`font-bold ${getScoreColor(analysis.experience_score)}`}>
                  {analysis.experience_score}/100
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Skills</span>
              </div>
              <div className="text-right">
                <span className={`font-bold ${getScoreColor(analysis.skills_score)}`}>
                  {analysis.skills_score}/100
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-indigo-500" />
                <span className="font-medium">Profile Photo</span>
              </div>
              <div className="text-right">
                <span className={`font-bold ${getScoreColor(analysis.profile_photo_score)}`}>
                  {analysis.profile_photo_score}/100
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Your Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 p-2 bg-green-50 rounded-lg"
              >
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-green-800">{strength}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertCircle className="h-5 w-5" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysis.improvements.map((improvement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg"
              >
                <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span className="text-orange-800">{improvement}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Lightbulb className="h-5 w-5" />
            AI-Powered Optimization Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Optimized Headline */}
          {analysis.optimized_suggestions.headline && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📝 Suggested Headline:</h4>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 font-medium">{analysis.optimized_suggestions.headline}</p>
              </div>
            </div>
          )}

          {/* Optimized Summary */}
          {analysis.optimized_suggestions.summary && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📄 Suggested Summary:</h4>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-green-800">{analysis.optimized_suggestions.summary}</p>
              </div>
            </div>
          )}

          {/* Skills to Add */}
          {analysis.optimized_suggestions.skills_to_add.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🎯 Skills to Add:</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.optimized_suggestions.skills_to_add.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Experience Tips */}
          {analysis.optimized_suggestions.experience_tips.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">💼 Experience Section Tips:</h4>
              <div className="space-y-2">
                {analysis.optimized_suggestions.experience_tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-yellow-800">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed AI Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{analysis.detailed_feedback}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInAnalysisResults;
