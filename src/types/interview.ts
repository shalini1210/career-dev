
export interface Message {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
}

export interface InterviewScore {
  overall_score: number;
  communication_score: number;
  technical_score: number;
  experience_score: number;
  strengths: string[];
  areas_for_improvement: string[];
  detailed_feedback: string;
  recommendation: string;
}
