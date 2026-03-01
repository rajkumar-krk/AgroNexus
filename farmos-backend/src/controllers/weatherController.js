import Farm from '../models/Farm.js';
import WeatherLog from '../models/WeatherLog.js';
import * as weatherService from '../services/weatherService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

async function getFarmLocation(farmId, userId) {
    const farm = await Farm.findById(farmId);
    if (!farm) return null;
    return farm;
}

export const getCurrentWeather = async (req, res) => {
    try {
        const farm = await getFarmLocation(req.query.farmId, req.user._id);
        if (!farm) return errorResponse(res, 'Farm not found', 404);
        const weather = await weatherService.getCurrentWeather(farm.location.lat, farm.location.lng);
        return successResponse(res, weather);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getForecast = async (req, res) => {
    try {
        const farm = await getFarmLocation(req.query.farmId, req.user._id);
        if (!farm) return errorResponse(res, 'Farm not found', 404);
        const days = Math.min(Number(req.query.days) || 7, 14);
        const forecast = await weatherService.getForecast(farm.location.lat, farm.location.lng, days);
        return successResponse(res, forecast);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getAlerts = async (req, res) => {
    try {
        const farm = await getFarmLocation(req.query.farmId, req.user._id);
        if (!farm) return errorResponse(res, 'Farm not found', 404);
        const alerts = await weatherService.computeAlerts(farm.location.lat, farm.location.lng);
        // Log if new day
        const today = new Date().toISOString().split('T')[0];
        try {
            await WeatherLog.findOneAndUpdate(
                { farm: farm._id, date: today },
                { alerts, temperature: null, humidity: null },
                { upsert: true, new: true }
            );
        } catch { }
        return successResponse(res, alerts);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getSprayWindows = async (req, res) => {
    try {
        const farm = await getFarmLocation(req.query.farmId, req.user._id);
        if (!farm) return errorResponse(res, 'Farm not found', 404);
        const windows = await weatherService.getSprayWindows(farm.location.lat, farm.location.lng);
        return successResponse(res, windows);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getWeatherHistory = async (req, res) => {
    try {
        const logs = await WeatherLog.find({ farm: req.query.farmId }).sort({ date: -1 }).limit(30);
        return successResponse(res, logs);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
