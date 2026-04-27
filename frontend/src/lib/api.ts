// AgroNexus API Client — connects to Express backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

async function request(path: string, options?: RequestInit) {
    const token = localStorage.getItem('agronexus_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        headers: { ...headers, ...(options?.headers || {}) },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'API request failed');
    }
    return res.json();
}

export const api = {
    // ══════════════════════════════════════════
    // ── Real-Time Sensor Data (NEW) ──
    // ══════════════════════════════════════════
    storeSensorData: (data: {
        temperature: number; humidity: number; gas?: number; moisture?: number;
        latitude?: number; longitude?: number; batchId?: string; deviceId?: string;
    }) => request('/sensor/store', { method: 'POST', body: JSON.stringify(data) }),

    getSensorLive: (batchId?: string) =>
        request(`/sensor/live${batchId ? `?batchId=${batchId}` : ''}`),

    getSensorHistory: (limit = 50, batchId?: string) =>
        request(`/sensor/history?limit=${limit}${batchId ? `&batchId=${batchId}` : ''}`),

    getGPSHistory: (limit = 100, batchId?: string) =>
        request(`/sensor/gps-history?limit=${limit}${batchId ? `&batchId=${batchId}` : ''}`),

    // ══════════════════════════════════════════
    // ── Alerts (NEW) ──
    // ══════════════════════════════════════════
    getAlerts: (params?: { severity?: string; type?: string; batchId?: string; limit?: number }) => {
        const query = new URLSearchParams();
        if (params?.severity) query.set('severity', params.severity);
        if (params?.type) query.set('type', params.type);
        if (params?.batchId) query.set('batchId', params.batchId);
        if (params?.limit) query.set('limit', String(params.limit));
        return request(`/alerts?${query.toString()}`);
    },

    getAlertStats: () => request('/alerts/stats'),

    acknowledgeAlert: (id: string) =>
        request(`/alerts/${id}/acknowledge`, { method: 'PATCH' }),

    resolveAlert: (id: string) =>
        request(`/alerts/${id}/resolve`, { method: 'PATCH' }),

    // ══════════════════════════════════════════
    // ── AI Insights — Gemini (NEW) ──
    // ══════════════════════════════════════════
    triggerAIAnalysis: (batchId?: string) =>
        request('/ai/analyze', { method: 'POST', body: JSON.stringify({ batchId }) }),

    getAIInsights: (limit = 20, batchId?: string) =>
        request(`/ai/insights?limit=${limit}${batchId ? `&batchId=${batchId}` : ''}`),

    getLatestAIInsight: (batchId?: string) =>
        request(`/ai/insights/latest${batchId ? `?batchId=${batchId}` : ''}`),

    // ══════════════════════════════════════════
    // ── Crops ──
    // ══════════════════════════════════════════
    getCrops: () => request('/crops'),
    createCrop: (data: any) => request('/crops', { method: 'POST', body: JSON.stringify(data) }),
    seedCrops: () => request('/crops/seed', { method: 'POST' }),

    // ── Telemetry & Analytics (legacy batch-based) ──
    getBatchTelemetry: (batchId: string) => request(`/telemetry/${batchId}`),
    getSpoilageRisk: (batchId?: string) => request(`/spoilage/risk${batchId ? `/${batchId}` : ''}`),
    getBatchShipment: (batchId: string) => request(`/shipments/batch/${batchId}`),

    // ── Market Prices ──
    getMarketPrices: () => request('/market/prices'),
    seedMarketPrices: () => request('/market/seed', { method: 'POST' }),

    // ── Marketplace Listings ──
    getListings: () => request('/listings'),
    createListing: (data: any) => request('/listings', { method: 'POST', body: JSON.stringify(data) }),
    seedListings: () => request('/listings/seed', { method: 'POST' }),

    // ── Harvest Price Locks ──
    getPriceLocks: () => request('/price-locks'),
    createPriceLock: (data: any) => request('/price-locks', { method: 'POST', body: JSON.stringify(data) }),
    acceptPriceLock: (id: string, buyerName?: string) =>
        request(`/price-locks/${id}/accept`, { method: 'PATCH', body: JSON.stringify({ buyerName }) }),

    // ── Pest Reports / Radar ──
    getPestReports: () => request('/pests/nearby'),
    submitPestReport: (data: any) => request('/pests/report', { method: 'POST', body: JSON.stringify(data) }),
    seedPestReports: () => request('/pests/seed', { method: 'POST' }),

    // ── Trust Score ──
    getTrustScore: (userId: string) => request(`/pests/trust-score/${userId}`),

    // ── AI Features (Gemini — Chat) ──
    getCropAdvice: (data: { currentCrop: string; soilType: string; areaAcres: number; location: string; season: string }) =>
        request('/ai/crop-advisor', { method: 'POST', body: JSON.stringify(data) }),
        
    getSellSignal: (data: { cropName: string; quantity: string; currentPrice: number; location: string }) =>
        request('/ai/sell-signal', { method: 'POST', body: JSON.stringify(data) }),

    getSprayWindows: (data: { weatherData: any[]; cropName: string; pesticideType: string }) =>
        request('/ai/spray-window', { method: 'POST', body: JSON.stringify(data) }),

    getSoilRestAdvice: (data: { cropHistory: any[]; soilType: string; location: string }) =>
        request('/ai/soil-rest', { method: 'POST', body: JSON.stringify(data) }),

    chatWithAI: (message: string, conversationHistory?: { role: string; content: string }[]) =>
        request('/ai/chat', { method: 'POST', body: JSON.stringify({ message, conversationHistory }) }),
};
