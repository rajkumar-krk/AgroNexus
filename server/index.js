import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── Config ──
const PORT = 5000;
const MONGO_URI = 'mongodb+srv://rajkumarkokku87:anjith9490@cluster0.n6yiiwx.mongodb.net/?appName=Cluster0';
const DB_NAME = 'sonnet_agriculture';
const GEMINI_KEY = 'AIzaSyA-ttF69_T_PLg-TbVDZN5Km9v5xn8pqog';

const app = express();
app.use(cors());
app.use(express.json());

// ── MongoDB Connection ──
let db;
const client = new MongoClient(MONGO_URI);

async function connectDB() {
    try {
        await client.connect();
        db = client.db(DB_NAME);
        console.log('✅ Connected to MongoDB Atlas — database:', DB_NAME);
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    }
}

// ── Gemini AI Setup ──
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Retry helper for rate-limited Gemini calls
async function callGemini(prompt, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        } catch (err) {
            if (err.message?.includes('429') && i < retries - 1) {
                const delay = (i + 1) * 5000; // 5s, 10s, 15s
                console.log(`⏳ Rate limited, retrying in ${delay / 1000}s...`);
                await new Promise(r => setTimeout(r, delay));
            } else {
                throw err;
            }
        }
    }
}

// ══════════════════════════════════════
// CROPS ROUTES
// ══════════════════════════════════════
app.get('/api/crops', async (req, res) => {
    try {
        const crops = await db.collection('crops').find({}).toArray();
        res.json(crops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/crops', async (req, res) => {
    try {
        const result = await db.collection('crops').insertOne({ ...req.body, createdAt: new Date() });
        const doc = await db.collection('crops').findOne({ _id: result.insertedId });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/crops/seed', async (req, res) => {
    try {
        const count = await db.collection('crops').countDocuments();
        if (count > 0) return res.json({ message: 'Already seeded', count });
        const seedCrops = [
            { name: 'Wheat', type: 'Grain', healthScore: 92, moistureLevel: 65, status: 'Healthy', expectedYield: '45 q/acre', userId: 'demo-user', createdAt: new Date() },
            { name: 'Soybean', type: 'Oilseed', healthScore: 78, moistureLevel: 45, status: 'Alert: Pest', expectedYield: '12 q/acre', userId: 'demo-user', createdAt: new Date() },
            { name: 'Cotton', type: 'Fiber', healthScore: 95, moistureLevel: 70, status: 'Excellent', expectedYield: '8 q/acre', userId: 'demo-user', createdAt: new Date() },
        ];
        await db.collection('crops').insertMany(seedCrops);
        const all = await db.collection('crops').find({}).toArray();
        res.json(all);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ══════════════════════════════════════
// MARKET PRICES ROUTES
// ══════════════════════════════════════
app.get('/api/market-prices', async (req, res) => {
    try {
        const prices = await db.collection('market_prices').find({}).toArray();
        res.json(prices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/market-prices/seed', async (req, res) => {
    try {
        const count = await db.collection('market_prices').countDocuments();
        if (count > 0) return res.json({ message: 'Already seeded', count });
        const seedPrices = [
            { cropName: 'Wheat', currentPrice: 2450, priceChange: 50, createdAt: new Date() },
            { cropName: 'Soybean', currentPrice: 5200, priceChange: -120, createdAt: new Date() },
            { cropName: 'Cotton', currentPrice: 7800, priceChange: 200, createdAt: new Date() },
        ];
        await db.collection('market_prices').insertMany(seedPrices);
        const all = await db.collection('market_prices').find({}).toArray();
        res.json(all);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ══════════════════════════════════════
// MARKETPLACE LISTINGS ROUTES
// ══════════════════════════════════════
app.get('/api/listings', async (req, res) => {
    try {
        const listings = await db.collection('marketplace_listings').find({}).sort({ createdAt: -1 }).toArray();
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/listings', async (req, res) => {
    try {
        const result = await db.collection('marketplace_listings').insertOne({ ...req.body, createdAt: new Date() });
        const doc = await db.collection('marketplace_listings').findOne({ _id: result.insertedId });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/listings/seed', async (req, res) => {
    try {
        const count = await db.collection('marketplace_listings').countDocuments();
        if (count > 0) return res.json({ message: 'Already seeded', count });
        const seedListings = [
            { title: 'Premium Basmati Rice', category: 'Grains', price: 4200, unit: 'quintal', location: 'Karnal, Haryana', seller: 'Rajesh Kumar', quality: 'A-Grade', quantity: '50 quintals', organic: true, createdAt: new Date() },
            { title: 'Fresh Alphonso Mangoes', category: 'Fruits', price: 800, unit: 'dozen', location: 'Ratnagiri, Maharashtra', seller: 'Suresh Patil', quality: 'Export Grade', quantity: '200 dozens', organic: false, createdAt: new Date() },
            { title: 'Organic Turmeric Powder', category: 'Spices', price: 180, unit: 'kg', location: 'Erode, Tamil Nadu', seller: 'Lakshmi Devi', quality: 'Premium', quantity: '500 kg', organic: true, createdAt: new Date() },
            { title: 'Farm Fresh Tomatoes', category: 'Vegetables', price: 35, unit: 'kg', location: 'Nashik, Maharashtra', seller: 'Ganesh More', quality: 'Grade-A', quantity: '2000 kg', organic: false, createdAt: new Date() },
            { title: 'DAP Fertilizer 50kg', category: 'Equipment', price: 1350, unit: 'bag', location: 'Hyderabad, Telangana', seller: 'Agri Supplies Co.', quality: 'Standard', quantity: '100 bags', organic: false, createdAt: new Date() },
        ];
        await db.collection('marketplace_listings').insertMany(seedListings);
        const all = await db.collection('marketplace_listings').find({}).sort({ createdAt: -1 }).toArray();
        res.json(all);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ══════════════════════════════════════
// HARVEST PRICE LOCK ROUTES
// ══════════════════════════════════════
app.get('/api/price-locks', async (req, res) => {
    try {
        const locks = await db.collection('price_locks').find({}).sort({ createdAt: -1 }).toArray();
        res.json(locks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/price-locks', async (req, res) => {
    try {
        const lock = {
            ...req.body,
            status: 'pending', // pending, accepted, expired
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 day expiry
        };
        const result = await db.collection('price_locks').insertOne(lock);
        const doc = await db.collection('price_locks').findOne({ _id: result.insertedId });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/price-locks/:id/accept', async (req, res) => {
    try {
        await db.collection('price_locks').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status: 'accepted', acceptedAt: new Date(), buyerName: req.body.buyerName || 'Anonymous Buyer' } }
        );
        const doc = await db.collection('price_locks').findOne({ _id: new ObjectId(req.params.id) });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ══════════════════════════════════════
// PEST REPORTS / RADAR ROUTES
// ══════════════════════════════════════
app.get('/api/pest-reports', async (req, res) => {
    try {
        const reports = await db.collection('pest_reports').find({}).sort({ reportedAt: -1 }).limit(50).toArray();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/pest-reports', async (req, res) => {
    try {
        const report = {
            ...req.body,
            reportedAt: new Date(),
            verified: false,
        };
        const result = await db.collection('pest_reports').insertOne(report);
        const doc = await db.collection('pest_reports').findOne({ _id: result.insertedId });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/pest-reports/seed', async (req, res) => {
    try {
        const count = await db.collection('pest_reports').countDocuments();
        if (count > 0) return res.json({ message: 'Already seeded', count });
        const seedReports = [
            { pestName: 'Fall Armyworm', severity: 'high', cropAffected: 'Maize', location: 'Warangal, Telangana', lat: 17.98, lng: 79.59, distance: 12, reportedAt: new Date(Date.now() - 2 * 3600000), reporter: 'Farmer A', verified: true },
            { pestName: 'Whitefly', severity: 'medium', cropAffected: 'Cotton', location: 'Adilabad, Telangana', lat: 19.67, lng: 78.53, distance: 35, reportedAt: new Date(Date.now() - 8 * 3600000), reporter: 'Farmer B', verified: true },
            { pestName: 'Brown Plant Hopper', severity: 'high', cropAffected: 'Rice', location: 'Guntur, AP', lat: 16.30, lng: 80.44, distance: 48, reportedAt: new Date(Date.now() - 18 * 3600000), reporter: 'Farmer C', verified: false },
            { pestName: 'Aphids', severity: 'low', cropAffected: 'Wheat', location: 'Karimnagar, Telangana', lat: 18.44, lng: 79.13, distance: 22, reportedAt: new Date(Date.now() - 4 * 3600000), reporter: 'Farmer D', verified: true },
        ];
        await db.collection('pest_reports').insertMany(seedReports);
        const all = await db.collection('pest_reports').find({}).sort({ reportedAt: -1 }).toArray();
        res.json(all);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ══════════════════════════════════════
// FARMER TRUST SCORE ROUTES
// ══════════════════════════════════════
app.get('/api/trust-score/:userId', async (req, res) => {
    try {
        let score = await db.collection('trust_scores').findOne({ userId: req.params.userId });
        if (!score) {
            // Create default trust score
            score = {
                userId: req.params.userId,
                overallScore: 72,
                ordersCompleted: 15,
                disputeRate: 2,
                responseTime: 'Fast',
                consistency: 85,
                platformAge: '8 months',
                badges: ['Verified Seller', 'Quick Responder'],
                updatedAt: new Date(),
            };
            await db.collection('trust_scores').insertOne(score);
        }
        res.json(score);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ══════════════════════════════════════
// GEMINI AI — CROP ADVISOR
// ══════════════════════════════════════
app.post('/api/ai/crop-advisor', async (req, res) => {
    try {
        const { currentCrop, soilType, areaAcres, location, season } = req.body;
        const prompt = `You are an expert Indian agricultural advisor. A farmer has the following details:
- Current Crop: ${currentCrop || 'Not specified'}
- Soil Type: ${soilType || 'Alluvial'}
- Farm Area: ${areaAcres || 2} acres
- Location: ${location || 'Telangana, India'}
- Upcoming Season: ${season || 'Rabi'}

Provide seasonal planning advice in JSON format:
{
  "recommendedCrop": "crop name",
  "plantingDate": "optimal date",
  "expectedYield": "expected yield per acre",
  "marketDemand": 0-100 score,
  "profitEstimate": "estimated profit in INR",
  "viabilityScore": 0-100,
  "risks": ["risk1", "risk2"],
  "tips": ["tip1", "tip2", "tip3"],
  "rotationAdvice": "why this crop after the current one",
  "alternativeCrops": [{"name": "crop", "demandScore": 0-100}]
}
Return ONLY valid JSON, no markdown.`;

        const text = await callGemini(prompt);
        const advice = JSON.parse(text);

        // Save to MongoDB
        await db.collection('advisor_history').insertOne({
            input: req.body,
            advice,
            createdAt: new Date(),
        });

        res.json(advice);
    } catch (err) {
        console.error('Crop Advisor error:', err.message);
        res.status(500).json({ error: 'AI advisor failed: ' + err.message });
    }
});

// ══════════════════════════════════════
// GEMINI AI — BEST DAY TO SELL
// ══════════════════════════════════════
app.post('/api/ai/sell-signal', async (req, res) => {
    try {
        const { cropName, quantity, currentPrice, location } = req.body;
        const prompt = `You are an Indian agricultural market analyst. Analyze the selling opportunity:
- Crop: ${cropName}
- Quantity: ${quantity}
- Current Mandi Price: ₹${currentPrice}/quintal
- Location: ${location || 'Telangana'}

Based on typical seasonal price patterns for this crop in India, provide a sell/hold recommendation in JSON:
{
  "signal": "SELL_NOW" or "HOLD" or "WAIT",
  "confidence": 0-100,
  "reasoning": "1-2 sentence explanation",
  "optimalSellDate": "recommended date or timeframe",
  "expectedPrice": "predicted price if held",
  "priceDirection": "up" or "down" or "stable",
  "savingsIfHeld": "estimated additional earnings in INR"
}
Return ONLY valid JSON, no markdown.`;

        const text = await callGemini(prompt);
        const signal = JSON.parse(text);
        res.json(signal);
    } catch (err) {
        console.error('Sell Signal error:', err.message);
        res.status(500).json({ error: 'AI sell signal failed: ' + err.message });
    }
});

// ══════════════════════════════════════
// GEMINI AI — SPRAY WINDOW PREDICTOR
// ══════════════════════════════════════
app.post('/api/ai/spray-window', async (req, res) => {
    try {
        const { weatherData, cropName, pesticideType } = req.body;
        const prompt = `You are an agricultural spray timing expert. Given the following 7-day weather forecast and crop details, recommend optimal spray windows.

Weather Forecast: ${JSON.stringify(weatherData || [])}
Crop: ${cropName || 'General'}
Pesticide Type: ${pesticideType || 'General purpose'}

Provide spray window recommendations for the next 7 days in JSON:
{
  "windows": [
    {
      "day": "Day name",
      "date": "Date",
      "slots": [
        {"time": "6:00-8:00 AM", "rating": "excellent" or "good" or "poor", "reason": "brief reason"}
      ],
      "overallRating": "excellent" or "good" or "avoid",
      "windSpeed": "km/h",
      "humidity": "%",
      "rainChance": "%"
    }
  ],
  "bestWindow": "The single best time slot this week",
  "chemicalTip": "One tip about application"
}
Return ONLY valid JSON, no markdown.`;

        const text = await callGemini(prompt);
        const windows = JSON.parse(text);
        res.json(windows);
    } catch (err) {
        console.error('Spray Window error:', err.message);
        res.status(500).json({ error: 'Spray window failed: ' + err.message });
    }
});

// ══════════════════════════════════════
// GEMINI AI — SOIL REST CALENDAR
// ══════════════════════════════════════
app.post('/api/ai/soil-rest', async (req, res) => {
    try {
        const { cropHistory, soilType, location } = req.body;
        const prompt = `You are a soil health expert. Analyze this farm's crop history and recommend rotation:

Crop History: ${JSON.stringify(cropHistory || [{ crop: 'Rice', seasons: 3 }, { crop: 'Wheat', seasons: 2 }])}
Soil Type: ${soilType || 'Black Cotton'}
Location: ${location || 'Telangana, India'}

Provide soil rest and rotation recommendations in JSON:
{
  "soilHealthScore": 0-100,
  "overCroppingRisk": "low" or "medium" or "high",
  "currentNutrientStatus": {"nitrogen": "low/medium/high", "phosphorus": "low/medium/high", "potassium": "low/medium/high"},
  "restRecommendation": "brief advice",
  "rotationPlan": [
    {"season": "Kharif 2026", "recommendedCrop": "crop name", "reason": "brief reason"},
    {"season": "Rabi 2026-27", "recommendedCrop": "crop name", "reason": "brief reason"},
    {"season": "Kharif 2027", "recommendedCrop": "crop name", "reason": "brief reason"}
  ],
  "greenManureSuggestion": "what to grow between cycles",
  "fertilizerAdjustment": "brief advice"
}
Return ONLY valid JSON, no markdown.`;

        const text = await callGemini(prompt);
        const soilAdvice = JSON.parse(text);
        res.json(soilAdvice);
    } catch (err) {
        console.error('Soil Rest error:', err.message);
        res.status(500).json({ error: 'Soil rest advisor failed: ' + err.message });
    }
});

// ══════════════════════════════════════
// GEMINI AI — CHATBOT
// ══════════════════════════════════════
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;
        const systemContext = `You are FarmOS AI Assistant — a friendly, knowledgeable Indian agricultural expert.
You help farmers with crop advice, pest management, market prices, weather guidance, government schemes, and farming best practices.
Keep responses concise (2-4 sentences max unless asked for detail). Use simple language.
If asked in Hindi or Telugu, respond in the same language.
Include practical, actionable advice. Reference Indian crops, markets (mandis), and government schemes (PM-KISAN, Fasal Bima Yojana, etc.) when relevant.`;

        const history = (conversationHistory || []).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        let response;
        for (let i = 0; i < 3; i++) {
            try {
                const chat = model.startChat({
                    history: [
                        { role: 'user', parts: [{ text: 'You are FarmOS AI Assistant. Acknowledge.' }] },
                        { role: 'model', parts: [{ text: systemContext }] },
                        ...history,
                    ],
                });
                const result = await chat.sendMessage(message);
                response = result.response.text();
                break;
            } catch (retryErr) {
                if (retryErr.message?.includes('429') && i < 2) {
                    await new Promise(r => setTimeout(r, (i + 1) * 2000));
                } else {
                    throw retryErr;
                }
            }
        }

        // Save to MongoDB
        await db.collection('chat_history').insertOne({
            userMessage: message,
            aiResponse: response,
            timestamp: new Date(),
        });

        res.json({ response });
    } catch (err) {
        console.error('Chat error:', err.message);
        res.status(500).json({ error: 'Chat failed: ' + err.message });
    }
});

// ══════════════════════════════════════
// START SERVER
// ══════════════════════════════════════
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 FarmOS Backend running on http://localhost:${PORT}`);
        console.log(`📡 API endpoints ready at http://localhost:${PORT}/api/`);
    });
});
