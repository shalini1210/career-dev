
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('API Key available:', !!openAIApiKey);
    
    const { projectUrl, projectDescription } = await req.json();
    console.log('Request received:', { projectUrl, projectDescription });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!projectUrl) {
      throw new Error('Project URL is required');
    }

    // First, scrape the project content
    console.log('Scraping project content...');
    let scrapedContent = '';
    
    try {
      const scrapeResponse = await fetch(projectUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (scrapeResponse.ok) {
        const htmlContent = await scrapeResponse.text();
        // Extract text content and limit size
        scrapedContent = htmlContent
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/<style[^>]*>.*?<\/style>/gi, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 5000); // Limit to 5000 chars
      }
    } catch (scrapeError) {
      console.log('Could not scrape content, using URL only:', scrapeError);
      scrapedContent = 'Content could not be scraped automatically.';
    }

    const prompt = `As an expert project reviewer and technical interviewer, analyze this project and provide detailed feedback.

Project URL: ${projectUrl}
${projectDescription ? `Project Description: ${projectDescription}` : ''}

Scraped Content Preview: ${scrapedContent}

Please analyze this project and provide a comprehensive review in the following JSON format:

{
  "score": number (0-100, overall project score),
  "impression": "string (2-3 sentences about first impression an interviewer would have)",
  "strengths": ["array", "of", "specific", "strengths", "found"],
  "improvements": ["array", "of", "specific", "improvement", "suggestions"],
  "marketability": number (0-100, how marketable/impressive is this project),
  "technicalQuality": number (0-100, code quality, architecture, best practices),
  "userExperience": number (0-100, UI/UX, usability, design),
  "documentation": number (0-100, README, comments, clarity),
  "overall": "string (detailed 3-4 sentence overall assessment)"
}

Consider:
- Technical implementation and code quality
- User interface and experience design
- Project complexity and innovation
- Documentation and presentation
- Market potential and real-world applicability
- Professional presentation and portfolio value

Provide honest, constructive feedback that would help improve the project for job interviews and career advancement.`;

    console.log('Making OpenAI API call for project analysis...');
    
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
            content: 'You are a senior technical interviewer and project reviewer with expertise in evaluating software projects for hiring decisions. Provide detailed, actionable feedback.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    console.log('OpenAI response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    const analysisText = data.choices[0].message.content;
    console.log('Raw analysis text:', analysisText);
    
    // Clean up the response text to ensure it's valid JSON
    const cleanedText = analysisText.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
    
    // Parse the JSON response
    let analysisData;
    try {
      analysisData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Cleaned text:', cleanedText);
      throw new Error('Failed to parse analysis data as JSON');
    }

    console.log('Parsed analysis data:', analysisData);

    // Validate the response structure
    const requiredFields = ['score', 'impression', 'strengths', 'improvements', 'marketability', 'technicalQuality', 'userExperience', 'documentation', 'overall'];
    for (const field of requiredFields) {
      if (!(field in analysisData)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-project function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze project',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
