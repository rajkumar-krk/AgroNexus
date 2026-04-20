import GroupOrder from '../models/GroupOrder.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createGroupOrder = async (req, res) => {
    try {
        const group = await GroupOrder.create({ ...req.body, createdBy: req.user._id });
        return successResponse(res, group, 'Group order created', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getGroupOrders = async (req, res) => {
    try {
        const { status = 'open', page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        const groups = await GroupOrder.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('createdBy', 'fullName');
        return successResponse(res, groups);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getGroupOrder = async (req, res) => {
    try {
        const group = await GroupOrder.findById(req.params.id).populate('createdBy', 'fullName').populate('participants.user', 'fullName');
        if (!group) return errorResponse(res, 'Group order not found', 404);
        return successResponse(res, group);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const joinGroupOrder = async (req, res) => {
    try {
        const group = await GroupOrder.findById(req.params.id);
        if (!group) return errorResponse(res, 'Group order not found', 404);
        if (group.status !== 'open') return errorResponse(res, 'Group order is not open', 400);
        if (new Date(group.closingDate) < new Date()) return errorResponse(res, 'Closing date passed', 400);
        if (group.participants.some((p) => p.user.toString() === req.user._id.toString())) return errorResponse(res, 'Already a participant', 400);

        group.participants.push({ user: req.user._id, quantityUnits: req.body.quantityUnits, anonymousDisplay: req.body.anonymousDisplay ?? true });
        await group.save();

        await Notification.create({ recipient: group.createdBy, type: 'group_order', title: 'New participant!', message: `Someone joined your group order: ${group.title}`, relatedId: group._id, relatedModel: 'GroupOrder' });

        return successResponse(res, group, 'Joined group order');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const leaveGroupOrder = async (req, res) => {
    try {
        const group = await GroupOrder.findById(req.params.id);
        if (!group) return errorResponse(res, 'Group order not found', 404);
        group.participants = group.participants.filter((p) => p.user.toString() !== req.user._id.toString());
        await group.save();
        return successResponse(res, group, 'Left group order');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const closeGroupOrder = async (req, res) => {
    try {
        const group = await GroupOrder.findById(req.params.id);
        if (!group) return errorResponse(res, 'Group order not found', 404);
        if (group.createdBy.toString() !== req.user._id.toString()) return errorResponse(res, 'Not authorized', 403);
        group.status = 'closed';
        await group.save();

        const notifications = group.participants.map((p) => ({ recipient: p.user, type: 'group_order', title: 'Group order closed', message: `${group.title} has been closed by the organizer.`, relatedId: group._id, relatedModel: 'GroupOrder' }));
        if (notifications.length) await Notification.insertMany(notifications);

        return successResponse(res, group, 'Group order closed');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getMyGroupOrders = async (req, res) => {
    try {
        const groups = await GroupOrder.find({ $or: [{ createdBy: req.user._id }, { 'participants.user': req.user._id }] }).sort({ createdAt: -1 });
        return successResponse(res, groups);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
