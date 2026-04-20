import Advisory from '../models/Advisory.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

export const getAdvisories = async (req, res) => {
    try {
        const { category, cropType, season, state, lang, page = 1, limit = 20 } = req.query;
        const filter = { isActive: true };
        if (category) filter.category = category;
        if (cropType) filter.cropTypes = cropType;
        if (season) filter.season = season;
        if (state) filter.states = state;
        if (lang) filter.language = lang;

        const total = await Advisory.countDocuments(filter);
        const advisories = await Advisory.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
        return paginatedResponse(res, advisories, page, limit, total);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getAdvisory = async (req, res) => {
    try {
        const advisory = await Advisory.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }, { new: true });
        if (!advisory) return errorResponse(res, 'Advisory not found', 404);
        return successResponse(res, advisory);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const createAdvisory = async (req, res) => {
    try {
        const advisory = await Advisory.create(req.body);
        return successResponse(res, advisory, 'Advisory created', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const searchAdvisories = async (req, res) => {
    try {
        const { q, page = 1, limit = 20 } = req.query;
        if (!q) return errorResponse(res, 'Search query required', 400);
        const filter = { isActive: true, $or: [{ title: { $regex: q, $options: 'i' } }, { content: { $regex: q, $options: 'i' } }, { tags: { $regex: q, $options: 'i' } }] };
        const total = await Advisory.countDocuments(filter);
        const advisories = await Advisory.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
        return paginatedResponse(res, advisories, page, limit, total);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
