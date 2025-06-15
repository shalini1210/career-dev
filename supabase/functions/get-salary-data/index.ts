
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
    const { position, country } = await req.json();

    const prompt = `Provide accurate 2024 salary data for a ${position} position in ${country}. 
    
    Requirements:
    - Return ONLY a JSON object with this exact structure
    - Use the correct currency for the country
    - Provide realistic salary ranges based on current market data
    - For India, express amounts in INR and include LPA (Lakhs Per Annum) format
    - Include 5-7 specific negotiation tips for this role and location
    
    JSON structure:
    {
      "min": number,
      "max": number, 
      "avg": number,
      "currency": "string",
      "symbol": "string",
      "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
    }
    
    Examples:
    - For India: currency should be "INR", symbol should be "₹"
    - For USA: currency should be "USD", symbol should be "$"
    - For UK: currency should be "GBP", symbol should be "£"
    - For Germany: currency should be "EUR", symbol should be "€"
    
    Do not include any text outside the JSON object.`;

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
            content: 'You are a salary research expert with access to current market data. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const salaryDataText = data.choices[0].message.content;
    
    // Parse the JSON response
    const salaryData = JSON.parse(salaryDataText);

    return new Response(JSON.stringify(salaryData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-salary-data function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch salary data',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
