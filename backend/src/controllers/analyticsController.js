import Crop from '../models/Crop.js';
import Order from '../models/Order.js';
import Listing from '../models/Listing.js';
import WeatherLog from '../models/WeatherLog.js';
import Farm from '../models/Farm.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

export const getDashboardSummary = async (req, res) => {
    try {
        const farmId = new mongoose.Types.ObjectId(req.query.farmId);
        const farm = await Farm.findById(farmId);
        if (!farm) return errorResponse(res, 'Farm not found', 404);
        const userId = farm.owner;

        const [cropSummary, revenueSummary, nextHarvests, listingSummary, recentAlerts] = await Promise.all([
            Crop.aggregate([{ $match: { farm: farmId, status: 'growing' } }, { $group: { _id: null, totalCrops: { $sum: 1 }, totalAreaHa: { $sum: '$areaHectares' }, totalInputCost: { $sum: '$totalInputCostINR' }, avgYieldEstimate: { $avg: '$yieldEstimateKg' } } }]),
            Order.aggregate([{ $match: { seller: userId, status: 'delivered' } }, { $group: { _id: null, totalRevenue: { $sum: '$totalAmountINR' }, orderCount: { $sum: 1 } } }]),
            Crop.find({ farm: farmId, status: 'growing' }).sort({ expectedHarvest: 1 }).limit(3).select('cropType expectedHarvest areaHectares'),
            Listing.aggregate([{ $match: { farmer: userId, status: 'active' } }, { $group: { _id: null, count: { $sum: 1 }, totalKg: { $sum: '$availableKg' } } }]),
            WeatherLog.find({ farm: farmId }).sort({ date: -1 }).limit(3).select('date alerts'),
        ]);

        const cs = cropSummary[0] || { totalCrops: 0, totalAreaHa: 0, totalInputCost: 0, avgYieldEstimate: 0 };
        const rs = revenueSummary[0] || { totalRevenue: 0, orderCount: 0 };
        const ls = listingSummary[0] || { count: 0, totalKg: 0 };

        return successResponse(res, {
            farm: { name: farm.name, location: farm.location },
            activeCrops: cs.totalCrops, totalAreaHa: cs.totalAreaHa, totalInputCostINR: cs.totalInputCost,
            totalRevenueINR: rs.totalRevenue, profitINR: rs.totalRevenue - cs.totalInputCost,
            nextHarvests, activeListings: ls.count, totalAvailableKg: ls.totalKg,
            waterCreditScore: farm.waterCreditScore, trustScore: farm.trustScore,
            recentAlerts: recentAlerts.flatMap((l) => l.alerts || []),
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getProfitabilityReport = async (req, res) => {
    try {
        const { farmId, season, year } = req.query;
        const filter = { farm: new mongoose.Types.ObjectId(farmId) };
        if (season) filter.season = season;
        if (year) {
            const start = new Date(`${year}-01-01`);
            const end = new Date(`${Number(year) + 1}-01-01`);
            filter.plantedAt = { $gte: start, $lt: end };
        }

        const costByType = await Crop.aggregate([
            { $match: filter }, { $unwind: '$inputLog' },
            { $group: { _id: '$inputLog.inputType', totalCost: { $sum: '$inputLog.costINR' } } },
        ]);
        const revByCrop = await Crop.aggregate([
            { $match: filter },
            { $group: { _id: '$cropType', revenue: { $sum: '$revenueINR' }, cost: { $sum: '$totalInputCostINR' }, area: { $sum: '$areaHectares' } } },
        ]);

        return successResponse(res, { costByInputType: costByType, revenueByCrop: revByCrop });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getCropCalendar = async (req, res) => {
    try {
        const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
        const crops = await Crop.find({
            farm: req.query.farmId,
            $or: [{ status: 'growing' }, { actualHarvest: { $gte: sixMonthsAgo } }],
        }).sort({ plantedAt: 1 }).select('cropType variety plantedAt expectedHarvest actualHarvest status areaHectares');
        return successResponse(res, crops);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getInputUsageReport = async (req, res) => {
    try {
        const crop = await Crop.findById(req.query.cropId);
        if (!crop) return errorResponse(res, 'Crop not found', 404);
        const byType = {};
        crop.inputLog.forEach((item) => {
            if (!byType[item.inputType]) byType[item.inputType] = { totalCost: 0, totalQty: 0 };
            byType[item.inputType].totalCost += item.costINR || 0;
            byType[item.inputType].totalQty += item.quantityKg || 0;
        });
        return successResponse(res, { inputBreakdown: byType, timeline: crop.inputLog.sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt)) });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getYieldDNAProfile = async (req, res) => {
    try {
        const farmId = new mongoose.Types.ObjectId(req.query.farmId);
        const profiles = await Crop.aggregate([
            { $match: { farm: farmId, status: 'harvested', actualYieldKg: { $gt: 0 } } },
            { $group: { _id: { cropType: '$cropType', season: '$season' }, avgYield: { $avg: '$actualYieldKg' }, avgArea: { $avg: '$areaHectares' }, count: { $sum: 1 } } },
        ]);

        const districtAvg = { Rice: 4500, Wheat: 3200, Cotton: 1800, Tomato: 25000, Onion: 18000 };
        const cropProfiles = profiles.map((p) => ({
            cropType: p._id.cropType, season: p._id.season,
            yourAvgYield: Math.round(p.avgYield), districtAvgYield: districtAvg[p._id.cropType] || 3000,
            performanceRatio: Math.round((p.avgYield / (districtAvg[p._id.cropType] || 3000)) * 100) / 100,
        }));

        const avgPerf = cropProfiles.length > 0 ? cropProfiles.reduce((s, p) => s + p.performanceRatio, 0) / cropProfiles.length : 1;
        const overallRating = avgPerf > 1.1 ? 'above_average' : avgPerf < 0.9 ? 'below_average' : 'average';

        return successResponse(res, { cropProfiles, overallRating });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
