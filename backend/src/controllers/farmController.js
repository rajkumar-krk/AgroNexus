import Farm from '../models/Farm.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/** Create a farm */
export const createFarm = async (req, res) => {
    try {
        const farm = await Farm.create({ ...req.body, owner: req.user._id });
        return successResponse(res, farm, 'Farm created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Get my farms */
export const getMyFarms = async (req, res) => {
    try {
        const farms = await Farm.find({ owner: req.user._id, isActive: true });
        return successResponse(res, farms);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Get single farm */
export const getFarm = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.farmId);
        if (!farm) return errorResponse(res, 'Farm not found', 404);
        if (farm.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return errorResponse(res, 'Not authorized to access this farm', 403);
        }
        return successResponse(res, farm);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Update farm */
export const updateFarm = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.farmId);
        if (!farm) return errorResponse(res, 'Farm not found', 404);
        if (farm.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return errorResponse(res, 'Not authorized', 403);
        }
        Object.assign(farm, req.body);
        await farm.save();
        return successResponse(res, farm, 'Farm updated');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Soft delete farm */
export const deleteFarm = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.farmId);
        if (!farm) return errorResponse(res, 'Farm not found', 404);
        if (farm.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return errorResponse(res, 'Not authorized', 403);
        }
        farm.isActive = false;
        await farm.save();
        return successResponse(res, null, 'Farm deleted');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Get nearby farms using geo query */
export const getNearbyFarms = async (req, res) => {
    try {
        const { lat, lng, radius = 50 } = req.query;
        if (!lat || !lng) return errorResponse(res, 'lat and lng are required', 400);

        const farms = await Farm.find({
            owner: { $ne: req.user._id },
            isActive: true,
            'location.lat': { $gte: Number(lat) - radius / 111, $lte: Number(lat) + radius / 111 },
            'location.lng': { $gte: Number(lng) - radius / 111, $lte: Number(lng) + radius / 111 },
        }).limit(20);

        return successResponse(res, farms);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
