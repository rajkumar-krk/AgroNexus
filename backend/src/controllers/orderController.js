import Order from '../models/Order.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';

export const createOrder = async (req, res) => {
    try {
        const listing = await Listing.findById(req.body.listing);
        if (!listing) return errorResponse(res, 'Listing not found', 404);
        if (listing.status !== 'active') return errorResponse(res, 'Listing is not active', 400);
        if (req.body.quantityKg > listing.availableKg) return errorResponse(res, 'Not enough stock available', 400);

        const order = await Order.create({
            buyer: req.user._id,
            seller: listing.farmer,
            listing: listing._id,
            quantityKg: req.body.quantityKg,
            pricePerKgINR: listing.askingPriceINR,
            deliveryAddress: req.body.deliveryAddress,
            paymentMethod: req.body.paymentMethod,
            buyerNotes: req.body.buyerNotes,
            statusHistory: [{ status: 'pending', changedBy: req.user._id }],
        });

        listing.availableKg -= req.body.quantityKg;
        if (listing.availableKg <= 0) listing.status = 'sold';
        await listing.save();

        await Notification.create({ recipient: listing.farmer, type: 'order_update', title: 'New Order!', message: `New order for ${listing.cropType} — ${req.body.quantityKg}kg`, relatedId: order._id, relatedModel: 'Order' });

        return successResponse(res, order, 'Order created', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const { role, status } = req.query;
        const filter = {};
        if (role === 'buyer') filter.buyer = req.user._id;
        else if (role === 'seller') filter.seller = req.user._id;
        else filter.$or = [{ buyer: req.user._id }, { seller: req.user._id }];
        if (status) filter.status = status;

        const orders = await Order.find(filter).populate('listing', 'title cropType').populate('buyer', 'fullName').populate('seller', 'fullName').sort({ createdAt: -1 });
        return successResponse(res, orders);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('listing').populate('buyer', 'fullName phone').populate('seller', 'fullName phone');
        if (!order) return errorResponse(res, 'Order not found', 404);
        if (order.buyer._id.toString() !== req.user._id.toString() && order.seller._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return errorResponse(res, 'Not authorized', 403);
        }
        return successResponse(res, order);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const sellerTransitions = { pending: 'confirmed', confirmed: 'packed', packed: 'in_transit', in_transit: 'delivered' };
const buyerAllowed = { pending: 'cancelled' };

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return errorResponse(res, 'Order not found', 404);

        const { status: newStatus, note } = req.body;
        const isSeller = order.seller.toString() === req.user._id.toString();
        const isBuyer = order.buyer.toString() === req.user._id.toString();

        if (isSeller && sellerTransitions[order.status] === newStatus) {
            // valid
        } else if (isBuyer && buyerAllowed[order.status] === newStatus) {
            // valid
        } else if (req.user.role === 'admin') {
            // admin can do anything
        } else {
            return errorResponse(res, `Cannot transition from ${order.status} to ${newStatus}`, 403);
        }

        order.status = newStatus;
        order.statusHistory.push({ status: newStatus, changedBy: req.user._id, note });
        if (newStatus === 'delivered') order.actualDeliveryDate = new Date();
        await order.save();

        // Trust score update
        if (newStatus === 'delivered') {
            await User.findByIdAndUpdate(order.seller, { $inc: { trustScore: 2 } });
        } else if (newStatus === 'cancelled' && isSeller && order.status === 'confirmed') {
            await User.findByIdAndUpdate(order.seller, { $inc: { trustScore: -5 } });
        }

        // Notify the other party
        const otherParty = isSeller ? order.buyer : order.seller;
        await Notification.create({ recipient: otherParty, type: 'order_update', title: `Order ${newStatus}`, message: `Order status updated to ${newStatus}`, relatedId: order._id, relatedModel: 'Order' });

        return successResponse(res, order, 'Order status updated');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getOrderStats = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const [stats] = await Order.aggregate([
            { $match: { seller: userId } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, '$totalAmountINR', 0] } },
                    completedOrders: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
                    avgOrderValue: { $avg: '$totalAmountINR' },
                },
            },
        ]);
        const result = stats || { totalOrders: 0, totalRevenue: 0, completedOrders: 0, avgOrderValue: 0 };
        result.completionRate = result.totalOrders > 0 ? Math.round((result.completedOrders / result.totalOrders) * 100) : 0;
        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
