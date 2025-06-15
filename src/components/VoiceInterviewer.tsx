
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Mic, MicOff, Volume2, VolumeX, Play, Square, Briefcase, Award, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioRecorder, encodeAudioForAPI, playAudioData } from '@/utils/RealtimeAudio';

interface Message {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
}

interface InterviewScore {
  overall_score: number;
  communication_score: number;
  technical_score: number;
  experience_score: number;
  strengths: string[];
  areas_for_improvement: string[];
  detailed_feedback: string;
  recommendation: string;
}

const VoiceInterviewer = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [aiTranscript, setAiTranscript] = useState('');
  const [interviewScore, setInterviewScore] = useState<InterviewScore | null>(null);
  const [showScore, setShowScore] = useState(false);
  
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const startInterview = async () => {
    if (!jobTitle.trim()) {
      toast({
        title: 'Job Title Required',
        description: 'Please enter the job title for your mock interview.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Connect to WebSocket - Fixed URL
      const wsUrl = window.location.hostname === 'localhost' 
        ? 'ws://localhost:54321/functions/v1/realtime-interview'
        : `wss://${window.location.hostname.replace('.lovableproject.com', '')}.supabase.co/functions/v1/realtime-interview`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to interview WebSocket');
        setIsConnected(true);
        
        // Start the interview
        wsRef.current?.send(JSON.stringify({
          type: 'start_interview',
          jobTitle: jobTitle
        }));

        toast({
          title: 'Interview Started!',
          description: 'The AI interviewer is ready. You can start speaking.',
        });
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data.type);

        switch (data.type) {
          case 'session.created':
            console.log('Session created successfully');
            break;

          case 'session.updated':
            console.log('Session updated successfully');
            break;

          case 'conversation.item.input_audio_transcription.completed':
            // User's speech transcription
            const userMessage: Message = {
              id: Date.now().toString(),
              role: 'candidate',
              content: data.transcript,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);
            setCurrentTranscript('');
            break;

          case 'response.audio_transcript.delta':
            // AI's speech transcription (real-time)
            setAiTranscript(prev => prev + data.delta);
            break;

          case 'response.audio_transcript.done':
            // AI finished speaking
            const aiMessage: Message = {
              id: Date.now().toString(),
              role: 'interviewer',
              content: aiTranscript,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setAiTranscript('');
            setIsSpeaking(false);
            break;

          case 'response.audio.delta':
            // Play AI audio
            if (data.delta && audioContextRef.current) {
              setIsSpeaking(true);
              const binaryString = atob(data.delta);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              await playAudioData(audioContextRef.current, bytes);
            }
            break;

          case 'response.function_call_arguments.done':
            // Interview scoring
            try {
              const scoreData = JSON.parse(data.arguments);
              setInterviewScore(scoreData);
              setShowScore(true);
            } catch (error) {
              console.error('Error parsing score data:', error);
            }
            break;

          case 'input_audio_buffer.speech_started':
            setIsRecording(true);
            break;

          case 'input_audio_buffer.speech_stopped':
            setIsRecording(false);
            break;

          case 'error':
            toast({
              title: 'Error',
              description: data.message || 'An error occurred during the interview.',
              variant: 'destructive',
            });
            break;
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to the interview system.',
          variant: 'destructive',
        });
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        setIsRecording(false);
        setIsSpeaking(false);
      };

      // Start audio recording
      recorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodeAudioForAPI(audioData)
          }));
        }
      });

      await recorderRef.current.start();

    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: 'Error',
        description: 'Failed to start the interview. Please check your microphone permissions.',
        variant: 'destructive',
      });
    }
  };

  const endInterview = () => {
    recorderRef.current?.stop();
    wsRef.current?.close();
    setIsConnected(false);
    setIsRecording(false);
    setIsSpeaking(false);
    setMessages([]);
    setCurrentTranscript('');
    setAiTranscript('');
    setJobTitle('');
  };

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
        /* Setup Card */
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
                onClick={startInterview} 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 text-lg"
              >
                Start Voice Interview
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Interview Status & Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Interview for: {jobTitle}</span>
                  <Button variant="outline" onClick={endInterview}>
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

            {/* Interview Messages */}
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Interview Conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg ${
                        message.role === 'interviewer' 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'bg-green-50 border-l-4 border-green-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`font-medium text-sm ${
                          message.role === 'interviewer' ? 'text-blue-700' : 'text-green-700'
                        }`}>
                          {message.role === 'interviewer' ? 'AI Interviewer' : 'You'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-800">{message.content}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VoiceInterviewer;
