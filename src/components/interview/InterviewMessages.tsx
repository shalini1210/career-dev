
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Message } from '@/types/interview';

interface InterviewMessagesProps {
  messages: Message[];
}

const InterviewMessages = ({ messages }: InterviewMessagesProps) => {
  return (
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
  );
};

export default InterviewMessages;
