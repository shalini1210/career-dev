
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  
  if (req.method === 'GET' && url.pathname === '/realtime-interview') {
    const upgrade = req.headers.get("upgrade") || "";
    if (upgrade.toLowerCase() !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received from client:", data.type);

        if (data.type === 'start_interview') {
          // Connect to OpenAI Realtime API
          const openaiWs = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01", [], {
            headers: {
              "Authorization": `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
              "OpenAI-Beta": "realtime=v1"
            }
          });

          openaiWs.onopen = () => {
            console.log("Connected to OpenAI Realtime API");
            
            // Send session configuration
            const sessionConfig = {
              type: "session.update",
              session: {
                modalities: ["text", "audio"],
                instructions: `You are an expert interviewer conducting a mock interview for a ${data.jobTitle} position. 
                
                Your role:
                - Ask challenging, role-specific interview questions
                - Listen to the candidate's responses
                - Provide constructive feedback
                - Score their answers from 1-10
                - Suggest improvements
                
                Interview flow:
                1. Start with a warm greeting and ask the first question
                2. Listen to their answer
                3. Ask follow-up questions based on their response
                4. After 3-4 questions, provide a comprehensive evaluation
                
                Keep questions specific to ${data.jobTitle} role and include behavioral, technical, and situational questions.`,
                voice: "alloy",
                input_audio_format: "pcm16",
                output_audio_format: "pcm16",
                input_audio_transcription: {
                  model: "whisper-1"
                },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 1000
                },
                tools: [
                  {
                    type: "function",
                    name: "provide_score_and_feedback",
                    description: "Provide final interview score and detailed feedback",
                    parameters: {
                      type: "object",
                      properties: {
                        overall_score: { type: "number", minimum: 1, maximum: 10 },
                        communication_score: { type: "number", minimum: 1, maximum: 10 },
                        technical_score: { type: "number", minimum: 1, maximum: 10 },
                        experience_score: { type: "number", minimum: 1, maximum: 10 },
                        strengths: { type: "array", items: { type: "string" } },
                        areas_for_improvement: { type: "array", items: { type: "string" } },
                        detailed_feedback: { type: "string" },
                        recommendation: { type: "string" }
                      },
                      required: ["overall_score", "communication_score", "technical_score", "experience_score", "strengths", "areas_for_improvement", "detailed_feedback", "recommendation"]
                    }
                  }
                ],
                tool_choice: "auto",
                temperature: 0.8,
                max_response_output_tokens: "inf"
              }
            };

            openaiWs.send(JSON.stringify(sessionConfig));
          };

          openaiWs.onmessage = (event) => {
            const openaiData = JSON.parse(event.data);
            console.log("Received from OpenAI:", openaiData.type);
            
            // Forward all OpenAI messages to client
            socket.send(JSON.stringify(openaiData));
          };

          openaiWs.onerror = (error) => {
            console.error("OpenAI WebSocket error:", error);
            socket.send(JSON.stringify({ 
              type: "error", 
              message: "Connection to AI interviewer failed" 
            }));
          };

          openaiWs.onclose = () => {
            console.log("OpenAI WebSocket closed");
          };

          // Store the OpenAI WebSocket reference
          socket.openaiWs = openaiWs;
        } else if (socket.openaiWs && socket.openaiWs.readyState === WebSocket.OPEN) {
          // Forward client messages to OpenAI
          socket.openaiWs.send(event.data);
        }
      } catch (error) {
        console.error("Error processing message:", error);
        socket.send(JSON.stringify({ 
          type: "error", 
          message: "Failed to process message" 
        }));
      }
    };

    socket.onclose = () => {
      console.log("Client WebSocket closed");
      if (socket.openaiWs) {
        socket.openaiWs.close();
      }
    };

    socket.onerror = (error) => {
      console.error("Client WebSocket error:", error);
    };

    return response;
  }

  return new Response("Not Found", { status: 404 });
});
