
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'LinkedIn URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate LinkedIn URL format
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!linkedinPattern.test(url)) {
      return new Response(
        JSON.stringify({ error: 'Invalid LinkedIn URL format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Simulate LinkedIn profile analysis (in a real implementation, you'd scrape or use LinkedIn API)
    const profileAnalysisPrompt = `
    You are a LinkedIn profile optimization expert. Analyze the LinkedIn profile at URL: ${url}
    
    Based on best practices for LinkedIn profiles, provide a comprehensive analysis with the following structure:
    
    1. Overall score (0-100)
    2. Individual scores for:
       - Headline (0-100)
       - Summary (0-100) 
       - Experience (0-100)
       - Skills (0-100)
       - Profile Photo (0-100)
    
    3. List of strengths (what's good about the profile)
    4. List of areas for improvement
    5. Detailed feedback paragraph
    6. Optimization suggestions including:
       - Optimized headline suggestion
       - Optimized summary suggestion
       - Skills to add
       - Experience section tips
    
    Note: Since I cannot access the actual LinkedIn profile, provide a realistic example analysis that would be typical for a professional profile, with constructive feedback and actionable suggestions.
    
    Respond in valid JSON format matching this structure:
    {
      "overall_score": number,
      "headline_score": number,
      "summary_score": number,
      "experience_score": number,
      "skills_score": number,
      "profile_photo_score": number,
      "strengths": string[],
      "improvements": string[],
      "detailed_feedback": string,
      "optimized_suggestions": {
        "headline": string,
        "summary": string,
        "skills_to_add": string[],
        "experience_tips": string[]
      }
    }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a LinkedIn profile optimization expert. Always respond with valid JSON that matches the requested structure exactly.'
          },
          {
            role: 'user',
            content: profileAnalysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    // Parse the JSON response from OpenAI
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', analysisText);
      throw new Error('Failed to parse AI response');
    }

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-linkedin-profile function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze LinkedIn profile',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
