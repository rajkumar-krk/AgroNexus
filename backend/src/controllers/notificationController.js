import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/** Get my notifications */
export const getMyNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
        const total = await Notification.countDocuments({ recipient: req.user._id });
        const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
        return successResponse(res, { notifications, unreadCount, total });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Mark one notification as read */
export const markRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        return successResponse(res, null, 'Marked as read');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Mark all notifications as read */
export const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
        return successResponse(res, null, 'All marked as read');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
