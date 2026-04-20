import Crop from '../models/Crop.js';
import Farm from '../models/Farm.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

/** Create a crop */
export const createCrop = async (req, res) => {
    try {
        const farm = await Farm.findById(req.body.farm);
        if (!farm) return errorResponse(res, 'Farm not found', 404);
        if (farm.owner.toString() !== req.user._id.toString()) return errorResponse(res, 'Not authorized', 403);
        const crop = await Crop.create({ ...req.body, owner: req.user._id });
        return successResponse(res, crop, 'Crop created', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Get my crops */
export const getMyCrops = async (req, res) => {
    try {
        const filter = { owner: req.user._id };
        if (req.query.status) filter.status = req.query.status;
        if (req.query.farmId) filter.farm = req.query.farmId;
        const crops = await Crop.find(filter).populate('farm', 'name location');
        return successResponse(res, crops);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Get single crop */
export const getCrop = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.cropId).populate('farm', 'name location');
        if (!crop) return errorResponse(res, 'Crop not found', 404);
        if (crop.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') return errorResponse(res, 'Not authorized', 403);
        return successResponse(res, crop);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Update crop */
export const updateCrop = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.cropId);
        if (!crop) return errorResponse(res, 'Crop not found', 404);
        if (crop.owner.toString() !== req.user._id.toString()) return errorResponse(res, 'Not authorized', 403);
        Object.assign(crop, req.body);
        await crop.save();
        return successResponse(res, crop, 'Crop updated');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Soft delete crop */
export const deleteCrop = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.cropId);
        if (!crop) return errorResponse(res, 'Crop not found', 404);
        if (crop.owner.toString() !== req.user._id.toString()) return errorResponse(res, 'Not authorized', 403);
        crop.status = 'failed';
        await crop.save();
        return successResponse(res, null, 'Crop deleted');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Add input log entry */
export const addInputLog = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.cropId);
        if (!crop) return errorResponse(res, 'Crop not found', 404);
        if (crop.owner.toString() !== req.user._id.toString()) return errorResponse(res, 'Not authorized', 403);
        crop.inputLog.push(req.body);
        await crop.save();
        return successResponse(res, crop, 'Input log added');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Get analytics for a single crop */
export const getCropAnalytics = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.cropId);
        if (!crop) return errorResponse(res, 'Crop not found', 404);
        const daysToHarvest = crop.expectedHarvest ? Math.ceil((new Date(crop.expectedHarvest) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
        return successResponse(res, {
            cropType: crop.cropType,
            totalInputCostINR: crop.totalInputCostINR,
            estimatedProfit: crop.revenueINR - crop.totalInputCostINR,
            daysToHarvest: Math.max(0, daysToHarvest),
            yieldEstimateKg: crop.yieldEstimateKg,
            inputBreakdown: crop.inputLog.reduce((acc, item) => {
                acc[item.inputType] = (acc[item.inputType] || 0) + (item.costINR || 0);
                return acc;
            }, {}),
        });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Get analytics for a farm */
export const getFarmAnalytics = async (req, res) => {
    try {
        const farmId = new mongoose.Types.ObjectId(req.params.farmId);
        const [summary] = await Crop.aggregate([
            { $match: { farm: farmId } },
            {
                $group: {
                    _id: null,
                    totalCrops: { $sum: 1 },
                    totalAreaHa: { $sum: '$areaHectares' },
                    totalInputCost: { $sum: '$totalInputCostINR' },
                    totalRevenue: { $sum: '$revenueINR' },
                    avgYieldEstimate: { $avg: '$yieldEstimateKg' },
                },
            },
        ]);
        return successResponse(res, summary || { totalCrops: 0, totalAreaHa: 0, totalInputCost: 0, totalRevenue: 0, avgYieldEstimate: 0 });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
