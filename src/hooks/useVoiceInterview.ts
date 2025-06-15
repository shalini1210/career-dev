
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AudioRecorder, encodeAudioForAPI, playAudioData } from '@/utils/RealtimeAudio';
import { Message, InterviewScore } from '@/types/interview';

export const useVoiceInterview = () => {
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

  return {
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
  };
};
