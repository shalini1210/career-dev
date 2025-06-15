
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mic, MicOff, Play, Pause, RotateCcw, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const MockInterviewer = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const startInterview = async () => {
    if (!jobTitle.trim()) {
      toast({
        title: 'Job Title Required',
        description: 'Please enter the job title you want to practice for.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setInterviewStarted(true);
    setQuestionIndex(1);

    try {
      const { data, error } = await supabase.functions.invoke('generate-resume-content', {
        body: {
          prompt: `Generate a challenging interview question for a ${jobTitle} position. Make it specific to the role and include behavioral or technical aspects. Just return the question without any extra text.`
        }
      });

      if (error) throw error;

      setCurrentQuestion(data.content);
      toast({
        title: 'Interview Started!',
        description: 'Answer the question below to begin your mock interview.',
      });
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: 'Error',
        description: 'Failed to start the interview. Please try again.',
        variant: 'destructive',
      });
      setInterviewStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast({
        title: 'Answer Required',
        description: 'Please provide an answer before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-resume-content', {
        body: {
          prompt: `As an expert interviewer for a ${jobTitle} position, provide constructive feedback on this answer: "${userAnswer}" to the question: "${currentQuestion}". Include: 1) What was good about the answer, 2) Areas for improvement, 3) A better way to structure the response. Keep it encouraging but honest.`
        }
      });

      if (error) throw error;

      setFeedback(data.content);
      toast({
        title: 'Feedback Generated',
        description: 'Review your feedback and prepare for the next question.',
      });
    } catch (error) {
      console.error('Error getting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = async () => {
    setIsLoading(true);
    setUserAnswer('');
    setFeedback('');
    setQuestionIndex(prev => prev + 1);

    try {
      const { data, error } = await supabase.functions.invoke('generate-resume-content', {
        body: {
          prompt: `Generate another challenging interview question for a ${jobTitle} position. Make it different from the previous one and focus on a different aspect (leadership, problem-solving, technical skills, etc.). Just return the question without any extra text.`
        }
      });

      if (error) throw error;

      setCurrentQuestion(data.content);
    } catch (error) {
      console.error('Error generating next question:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate next question. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setCurrentQuestion('');
    setUserAnswer('');
    setFeedback('');
    setQuestionIndex(0);
    setJobTitle('');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Note: Actual voice recording would require additional setup
    toast({
      title: isRecording ? 'Recording Stopped' : 'Recording Started',
      description: isRecording ? 'Voice recording stopped.' : 'Voice recording started.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Mock Interviewer
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Practice your interview skills with AI-generated questions tailored to your target role
            </p>
          </CardHeader>
        </Card>
      </motion.div>

      {!interviewStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Start Your Mock Interview
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
              <Button 
                onClick={startInterview} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 text-lg"
              >
                {isLoading ? 'Preparing Interview...' : 'Start Mock Interview'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Interview Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">Mock Interview for: {jobTitle}</h3>
                    <p className="text-gray-600">Question {questionIndex}</p>
                  </div>
                  <Button variant="outline" onClick={resetInterview}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    Q
                  </div>
                  Interview Question
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-lg leading-relaxed">{currentQuestion}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Answer Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Answer</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleRecording}
                    className={isRecording ? 'bg-red-50 border-red-200' : ''}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isRecording ? 'Stop Recording' : 'Voice Recording'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your answer here... Take your time to think through your response."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="min-h-[150px] text-base"
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={submitAnswer} 
                    disabled={isLoading || !userAnswer.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Generating Feedback...' : 'Submit Answer'}
                  </Button>
                  {feedback && (
                    <Button 
                      onClick={nextQuestion} 
                      disabled={isLoading}
                      variant="outline"
                    >
                      Next Question
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feedback */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      F
                    </div>
                    Interview Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="whitespace-pre-wrap text-base leading-relaxed">{feedback}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default MockInterviewer;
