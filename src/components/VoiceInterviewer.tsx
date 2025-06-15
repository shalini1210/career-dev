
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useVoiceInterview } from '@/hooks/useVoiceInterview';
import InterviewSetup from './interview/InterviewSetup';
import InterviewStatus from './interview/InterviewStatus';
import InterviewMessages from './interview/InterviewMessages';
import InterviewResults from './interview/InterviewResults';

const VoiceInterviewer = () => {
  const {
    jobTitle,
    setJobTitle,
    isConnected,
    isRecording,
    isSpeaking,
    messages,
    currentTranscript,
    aiTranscript,
    interviewScore,
    showScore,
    startInterview,
    endInterview
  } = useVoiceInterview();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
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
              AI Voice Interview
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Practice with a voice-enabled AI interviewer and get real-time feedback
            </p>
          </CardHeader>
        </Card>
      </motion.div>

      {!isConnected ? (
        <InterviewSetup 
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          onStartInterview={startInterview}
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Interview Status & Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <InterviewStatus
              jobTitle={jobTitle}
              isRecording={isRecording}
              isSpeaking={isSpeaking}
              currentTranscript={currentTranscript}
              aiTranscript={aiTranscript}
              onEndInterview={endInterview}
            />

            <InterviewMessages messages={messages} />
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <InterviewResults 
              showScore={showScore}
              interviewScore={interviewScore}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VoiceInterviewer;
