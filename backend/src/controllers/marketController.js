import MarketPrice from '../models/MarketPrice.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

export const getMarketPrices = async (req, res) => {
    try {
        const { commodity, state, market, date, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (commodity) filter.commodity = { $regex: commodity, $options: 'i' };
        if (state) filter.state = state;
        if (market) filter.market = market;
        if (date) filter.priceDate = new Date(date);

        const total = await MarketPrice.countDocuments(filter);
        const prices = await MarketPrice.find(filter).sort({ priceDate: -1 }).skip((page - 1) * limit).limit(Number(limit));
        return paginatedResponse(res, prices, page, limit, total);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getLatestPrice = async (req, res) => {
    try {
        const { commodity, market } = req.query;
        if (!commodity) return errorResponse(res, 'commodity is required', 400);
        const filter = { commodity: { $regex: commodity, $options: 'i' } };
        if (market) filter.market = market;
        const price = await MarketPrice.findOne(filter).sort({ priceDate: -1 });
        return successResponse(res, price);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getPriceTrend = async (req, res) => {
    try {
        const { commodity, market } = req.query;
        if (!commodity) return errorResponse(res, 'commodity required', 400);
        const filter = { commodity: { $regex: commodity, $options: 'i' } };
        if (market) filter.market = market;
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        filter.priceDate = { $gte: thirtyDaysAgo };
        const prices = await MarketPrice.find(filter).sort({ priceDate: 1 });
        return successResponse(res, prices);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getBestSellDay = async (req, res) => {
    try {
        const { commodity, market } = req.query;
        if (!commodity) return errorResponse(res, 'commodity required', 400);
        const filter = { commodity: { $regex: commodity, $options: 'i' } };
        if (market) filter.market = market;
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        filter.priceDate = { $gte: sixtyDaysAgo };
        const prices = await MarketPrice.find(filter);

        if (!prices.length) return successResponse(res, { recommendation: 'sell_now', message: 'Not enough data' });

        const dayAvg = {};
        prices.forEach((p) => {
            const day = new Date(p.priceDate).getDay();
            if (!dayAvg[day]) dayAvg[day] = { total: 0, count: 0 };
            dayAvg[day].total += p.modalPriceINR;
            dayAvg[day].count++;
        });

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let bestDay = 0, bestAvg = 0;
        Object.entries(dayAvg).forEach(([d, v]) => {
            const avg = v.total / v.count;
            if (avg > bestAvg) { bestAvg = avg; bestDay = Number(d); }
        });

        const currentPrice = prices[prices.length - 1]?.modalPriceINR || 0;
        const recommendation = currentPrice >= bestAvg * 0.95 ? 'sell_now' : bestAvg > currentPrice * 1.05 ? 'hold_3_days' : 'hold_week';

        return successResponse(res, { bestDay: days[bestDay], avgPrice: Math.round(bestAvg), currentPrice, recommendation });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
