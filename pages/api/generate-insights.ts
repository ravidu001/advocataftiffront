import { NextApiRequest, NextApiResponse } from 'next';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { datasetUrl, prompt } = req.body;

  if (!datasetUrl) {
    return res.status(400).json({ message: 'Dataset URL is required' });
  }

  try {
    // Fetch the CSV content
    const csvResponse = await fetch(datasetUrl);
    if (!csvResponse.ok) {
      throw new Error('Failed to fetch CSV file');
    }
    const csvText = await csvResponse.text();

    // Construct the prompt
    const systemPrompt = `
      You are an expert data analyst. Analyze the following CSV dataset and provide insights in a specific JSON format.
      
      The output must be a valid JSON object with the following structure:
      {
        "keyInsights": [
          {
            "title": "Short title of the insight",
            "content": "Concise description of the insight (1-2 sentences)",
            "confidence": "High/Medium/Low (Percentage)"
          }
        ],
        "composition": {
          "introParagraphs": ["Paragraph 1", "Paragraph 2"],
          "growthSummary": "Summary of growth",
          "firstMetrics": ["Metric 1", "Metric 2"],
          "secondMetrics": ["Metric 1", "Metric 2"],
          "recommendations": ["Rec 1", "Rec 2"]
        },
        "trend": {
          "intro": "Intro text",
          "disruptionParagraph": "Text about disruptions",
          "longTermTrends": ["Trend 1", "Trend 2"],
          "emergingPattern": "Text about emerging patterns",
          "recommendations": ["Rec 1", "Rec 2"]
        },
        "ranking": {
          "intro": "Intro text",
          "stabilityRanking": ["Rank 1", "Rank 2"],
          "linkTexts": ["Link text 1", "Link text 2"],
          "recommendations": ["Rec 1", "Rec 2"]
        },
        "dataQuality": {
          "intro": "Intro text",
          "missingDataSummary": "Summary of missing data",
          "breakdown": ["Breakdown 1", "Breakdown 2"],
          "timeline": ["Timeline 1", "Timeline 2"],
          "outliers": ["Outlier 1", "Outlier 2"],
          "checks": ["Check 1", "Check 2"],
          "recommendations": ["Rec 1", "Rec 2"]
        },
        "forecast": {
          "intro": "Intro text",
          "forecastSummary": "Summary of forecast",
          "categoryProjections": ["Proj 1", "Proj 2"],
          "validationNotes": ["Note 1", "Note 2"],
          "riskFactors": ["Risk 1", "Risk 2"],
          "recommendations": ["Rec 1", "Rec 2"]
        },
        "dataset": {
          "intro": "Intro text",
          "enhancements": ["Enhancement 1", "Enhancement 2"],
          "fileFormats": ["Format 1", "Format 2"],
          "newColumns": ["Col 1", "Col 2"],
          "qaChecks": ["Check 1", "Check 2"],
          "recommendations": ["Rec 1", "Rec 2"]
        }
      }

      Ensure the insights are data-driven and accurate based on the provided CSV.
      If the dataset is small or lacks certain information, make reasonable inferences or state limitations, but always return the full JSON structure.
      
      CSV Data:
      ${csvText.substring(0, 30000)} // Limit to avoid token limits if necessary, though 1.5 flash has a large context window.
    `;

    // Initialize Gemini model
    // Try multiple models in sequence, prioritizing those found in the user's available list
    let result;
    const modelsToTry = [
      'gemini-2.0-flash',
      'gemini-2.0-flash-001',
      'gemini-flash-latest',
      'gemini-pro-latest',
      'gemini-2.0-flash-exp', // Fallback to experimental if stable ones fail
      'gemini-1.5-flash',     // Fallback to 1.5 family
      'gemini-pro'            // Last resort
    ];
    let lastError;

    console.log(`Using API Key: ${process.env.GEMINI_API_KEY ? 'Present (' + process.env.GEMINI_API_KEY.substring(0, 4) + '...)' : 'Missing'}`);

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting to use model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Modern models (1.5, 2.0, and 'latest' aliases) support JSON mode natively
        const isModern = modelName.includes('1.5') || modelName.includes('2.0') || modelName.includes('latest');
        const generationConfig = isModern ? { responseMimeType: "application/json" } : undefined;
        
        // For older models, we need to be very explicit in the prompt
        const promptSuffix = isModern ? "" : "\n\nIMPORTANT: Return ONLY valid JSON. Do not include markdown formatting like ```json ... ```.";

        result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: systemPrompt + promptSuffix }] }],
          generationConfig
        });
        
        console.log(`Successfully generated content with ${modelName}`);
        break; // Success, exit loop
      } catch (error: any) {
        console.warn(`Failed with model ${modelName}: ${error.message}`);
        lastError = error;
        
        // Continue on common recoverable errors:
        // 404: Model not found
        // 429: Quota exceeded (try next model which might have different quota or be less busy)
        // 503: Service unavailable
        if (
          error.message.includes('404') || 
          error.message.includes('not found') || 
          error.message.includes('429') || 
          error.message.includes('quota') ||
          error.message.includes('503')
        ) {
          continue;
        }
      }
    }

    if (!result) {
      // If all models failed, try to list available models to help debugging
      try {
        console.log("All models failed. Attempting to list available models...");
        const listModelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const listModelsData = await listModelsResponse.json();
        console.log("Available models:", JSON.stringify(listModelsData, null, 2));
      } catch (listError) {
        console.error("Failed to list models:", listError);
      }

      throw lastError || new Error("Failed to generate insights with any available model.");
    }
    
    const response = await result.response;
    let text = response.text();
    
    // Clean up markdown code blocks if present (common with gemini-pro)
    // Also find the first '{' and last '}' to extract just the JSON object
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }
    
    try {
        const jsonResponse = JSON.parse(text);
        res.status(200).json(jsonResponse);
    } catch (e) {
        console.error("Failed to parse JSON response", text);
        res.status(500).json({ message: 'Failed to parse AI response', raw: text });
    }

  } catch (error: any) {
    console.error('Error generating insights:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
