import { GoogleGenerativeAI } from '@google/generative-ai';
import AIInsight from '../models/AIInsight.js';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze sensor data using Google Gemini AI.
 * Builds a structured agricultural prompt, calls the API,
 * parses the JSON response, and stores the insight in MongoDB.
 *
 * @param {Object} sensorData - Latest sensor reading from DB
 * @returns {Object} - The created AIInsight document
 */
export async function analyzeSensorData(sensorData) {
  const { temperature, humidity, gas, moisture, batchId, latitude, longitude } = sensorData;

  const prompt = `You are an expert agricultural AI analyst for a farm-to-consumer direct delivery platform called AgroNexus. 
Your job is to monitor crop/food conditions during transit from farmer to consumer.

Analyze the following real-time sensor data from an agricultural shipment:

🌡️ Temperature: ${temperature}°C
💧 Humidity: ${humidity}%
🌱 Soil/Crop Moisture: ${moisture}%
💨 Gas Level (spoilage indicator): ${gas}
📍 GPS Location: ${latitude}, ${longitude}
📦 Batch ID: ${batchId || 'N/A'}

Based on this data, assess:
1. Is there any spoilage risk for the crops/food being transported?
2. Are the conditions safe for the produce?
3. What immediate action should the farmer or delivery person take?

IMPORTANT: Return ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "risk": "Low" or "Medium" or "High" or "Critical",
  "issue": "Brief description of the detected issue or 'No issues detected' if everything is normal",
  "recommendation": "Specific actionable recommendation for the farmer/delivery person"
}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Parse JSON from response (handle possible markdown wrapping)
    let parsed;
    try {
      // Try direct JSON parse first
      parsed = JSON.parse(responseText);
    } catch {
      // Try extracting JSON from markdown code block
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse Gemini response as JSON');
      }
    }

    // Validate required fields
    const risk = parsed.risk || 'Medium';
    const issue = parsed.issue || 'Analysis completed';
    const recommendation = parsed.recommendation || 'Continue monitoring';

    // Store in DB
    const insight = await AIInsight.create({
      risk,
      issue,
      recommendation,
      batchId: batchId || null,
      basedOn: {
        temperature,
        humidity,
        gas,
        moisture,
        latitude: latitude || 0,
        longitude: longitude || 0
      }
    });

    console.log(`🤖 AI Insight stored: [${risk}] ${issue.substring(0, 50)}...`);
    return insight;

  } catch (error) {
    console.error('❌ Gemini AI analysis failed:', error.message);

    // Store a fallback insight so the pipeline doesn't break
    const fallbackInsight = await AIInsight.create({
      risk: temperature > 40 || gas > 500 ? 'High' : temperature > 30 || gas > 300 ? 'Medium' : 'Low',
      issue: `Automated assessment: Temp=${temperature}°C, Gas=${gas}, Moisture=${moisture}%`,
      recommendation: 'AI analysis unavailable. Please check sensor readings manually and ensure proper storage conditions.',
      batchId: batchId || null,
      basedOn: {
        temperature,
        humidity,
        gas,
        moisture,
        latitude: latitude || 0,
        longitude: longitude || 0
      }
    });

    return fallbackInsight;
  }
}

export async function generateCropAdvice({ currentCrop, soilType, areaAcres, location, season }) {
  const prompt = `You are an expert AI Crop Advisor for AgroNexus.
A farmer has requested advice for the following farm profile:
- Target Crop: ${currentCrop}
- Soil Type: ${soilType}
- Area: ${areaAcres} Ac
- Location: ${location}
- Season: ${season}

Provide a detailed, step-by-step agricultural strategy. Include:
1. Soil preparation and fertilizer requirements.
2. Optimal planting layout / depth.
3. Watering and irrigation schedule.
4. Pest management strategy.
Use markdown formatting strictly. Do not hallucinate data.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Crop Advice error:', error);
    throw new Error('Failed to generate crop advice');
  }
}

export async function processChat(message) {
  const prompt = `You are AgroNexus Assistant, a friendly and highly knowledgeable agricultural AI embedded in a web dashboard for farmers.
Answer the following question about agriculture, crop prices, pest management, or general farm operations accurately but concisely:

User Question: "${message}"`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Chat error:', error);
    throw new Error('Chat failed');
  }
}
