import PestAlert from '../models/PestAlert.js';
import Farm from '../models/Farm.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/** Report a pest alert */
export const reportPestAlert = async (req, res) => {
    try {
        const farm = req.body.farm ? await Farm.findById(req.body.farm) : null;
        const alertData = {
            ...req.body,
            reportedBy: req.user._id,
        };
        if (farm) {
            alertData.location = { lat: farm.location.lat, lng: farm.location.lng };
        } else if (req.body.lat && req.body.lng) {
            alertData.location = { lat: Number(req.body.lat), lng: Number(req.body.lng) };
        }
        const alert = await PestAlert.create(alertData);

        // Notify nearby farmers
        if (alertData.location?.lat) {
            const nearbyFarms = await Farm.find({
                owner: { $ne: req.user._id },
                isActive: true,
                'location.lat': { $gte: alertData.location.lat - 0.45, $lte: alertData.location.lat + 0.45 },
                'location.lng': { $gte: alertData.location.lng - 0.45, $lte: alertData.location.lng + 0.45 },
            });
            const owners = [...new Set(nearbyFarms.map((f) => f.owner.toString()))];
            const notifications = owners.map((ownerId) => ({
                recipient: ownerId,
                type: 'pest_alert',
                title: `🐛 Pest Alert: ${alert.pestType}`,
                message: `${alert.pestType} (${alert.severity}) reported near your farm area. ${alert.cropAffected ? `Affected crop: ${alert.cropAffected}` : ''}`,
                relatedId: alert._id,
                relatedModel: 'PestAlert',
            }));
            if (notifications.length) await Notification.insertMany(notifications);
            alert.notifiedFarmerCount = owners.length;
            await alert.save();
        }

        return successResponse(res, alert, `Alert created. ${alert.notifiedFarmerCount} farmers notified.`, 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Get nearby alerts */
export const getNearbyAlerts = async (req, res) => {
    try {
        const { lat, lng, radius = 50 } = req.query;
        if (!lat || !lng) return errorResponse(res, 'lat and lng are required', 400);
        const alerts = await PestAlert.find({
            status: 'active',
            'location.lat': { $gte: Number(lat) - Number(radius) / 111, $lte: Number(lat) + Number(radius) / 111 },
            'location.lng': { $gte: Number(lng) - Number(radius) / 111, $lte: Number(lng) + Number(radius) / 111 },
        }).populate('reportedBy', 'fullName').limit(20);
        return successResponse(res, alerts);
    } catch (error) {
        const alerts = await PestAlert.find({ status: 'active' }).populate('reportedBy', 'fullName').sort({ createdAt: -1 }).limit(20);
        return successResponse(res, alerts);
    }
};

/** Get my alerts */
export const getMyAlerts = async (req, res) => {
    try {
        const alerts = await PestAlert.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
        return successResponse(res, alerts);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Update alert status */
export const updateAlertStatus = async (req, res) => {
    try {
        const alert = await PestAlert.findById(req.params.alertId);
        if (!alert) return errorResponse(res, 'Alert not found', 404);
        if (alert.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') return errorResponse(res, 'Not authorized', 403);
        alert.status = req.body.status;
        await alert.save();
        return successResponse(res, alert, 'Alert status updated');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
