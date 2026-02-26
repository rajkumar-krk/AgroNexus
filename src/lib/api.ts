// FarmOS API Client — connects to Express backend at localhost:5000
const API_BASE = 'http://localhost:5000/api';

async function request(path: string, options?: RequestInit) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'API request failed');
    }
    return res.json();
}

export const api = {
    // ── Crops ──
    getCrops: () => request('/crops'),
    createCrop: (data: any) => request('/crops', { method: 'POST', body: JSON.stringify(data) }),
    seedCrops: () => request('/crops/seed', { method: 'POST' }),

    // ── Market Prices ──
    getMarketPrices: () => request('/market-prices'),
    seedMarketPrices: () => request('/market-prices/seed', { method: 'POST' }),

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
    getPestReports: () => request('/pest-reports'),
    submitPestReport: (data: any) => request('/pest-reports', { method: 'POST', body: JSON.stringify(data) }),
    seedPestReports: () => request('/pest-reports/seed', { method: 'POST' }),

    // ── Trust Score ──
    getTrustScore: (userId: string) => request(`/trust-score/${userId}`),

    // ── AI Features (Gemini) ──
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
