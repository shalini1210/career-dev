
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Square } from 'lucide-react';

interface InterviewStatusProps {
  jobTitle: string;
  isRecording: boolean;
  isSpeaking: boolean;
  currentTranscript: string;
  aiTranscript: string;
  onEndInterview: () => void;
}

const InterviewStatus = ({ 
  jobTitle, 
  isRecording, 
  isSpeaking, 
  currentTranscript, 
  aiTranscript, 
  onEndInterview 
}: InterviewStatusProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Interview for: {jobTitle}</span>
          <Button variant="outline" onClick={onEndInterview}>
            <Square className="h-4 w-4 mr-2" />
            End Interview
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-8">
          {/* Recording Status */}
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
            }`}>
              {isRecording ? 
                <Mic className="h-8 w-8 text-white" /> : 
                <MicOff className="h-8 w-8 text-gray-600" />
              }
            </div>
            <span className="text-sm mt-2 font-medium">
              {isRecording ? 'Listening...' : 'Waiting'}
            </span>
          </div>

          {/* Speaking Status */}
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
            }`}>
              {isSpeaking ? 
                <Volume2 className="h-8 w-8 text-white" /> : 
                <VolumeX className="h-8 w-8 text-gray-600" />
              }
            </div>
            <span className="text-sm mt-2 font-medium">
              {isSpeaking ? 'AI Speaking...' : 'AI Silent'}
            </span>
          </div>
        </div>

        {/* Current Transcript */}
        {(currentTranscript || aiTranscript) && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Current speech:</p>
            <p className="text-gray-800">{currentTranscript || aiTranscript}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewStatus;
