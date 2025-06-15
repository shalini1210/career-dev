
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InterviewScore } from '@/types/interview';

interface InterviewResultsProps {
  showScore: boolean;
  interviewScore: InterviewScore | null;
}

const InterviewResults = ({ showScore, interviewScore }: InterviewResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <AnimatePresence>
      {showScore && interviewScore ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Award className="h-6 w-6" />
                Interview Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(interviewScore.overall_score)}`}>
                  {interviewScore.overall_score}/10
                </div>
                <p className={`text-lg font-medium ${getScoreColor(interviewScore.overall_score)}`}>
                  {getScoreLabel(interviewScore.overall_score)}
                </p>
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Communication</span>
                  <span className={`font-bold ${getScoreColor(interviewScore.communication_score)}`}>
                    {interviewScore.communication_score}/10
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Technical Skills</span>
                  <span className={`font-bold ${getScoreColor(interviewScore.technical_score)}`}>
                    {interviewScore.technical_score}/10
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Experience</span>
                  <span className={`font-bold ${getScoreColor(interviewScore.experience_score)}`}>
                    {interviewScore.experience_score}/10
                  </span>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Strengths:</h4>
                <ul className="space-y-1">
                  {interviewScore.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-green-700">• {strength}</li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">Areas for Improvement:</h4>
                <ul className="space-y-1">
                  {interviewScore.areas_for_improvement.map((area, index) => (
                    <li key={index} className="text-sm text-orange-700">• {area}</li>
                  ))}
                </ul>
              </div>

              {/* Detailed Feedback */}
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">Detailed Feedback:</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{interviewScore.detailed_feedback}</p>
              </div>

              {/* Recommendation */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Recommendation:</h4>
                <p className="text-sm text-blue-700">{interviewScore.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Interview in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Complete the interview to see your results...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </AnimatePresence>
  );
};

export default InterviewResults;
