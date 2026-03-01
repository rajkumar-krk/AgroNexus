import Listing from '../models/Listing.js';
import PriceLock from '../models/PriceLock.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

export const createListing = async (req, res) => {
    try {
        const listing = await Listing.create({ ...req.body, farmer: req.user._id, availableKg: req.body.quantityKg });
        return successResponse(res, listing, 'Listing created', 201);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getListings = async (req, res) => {
    try {
        const { cropType, state, district, minPrice, maxPrice, sort = 'newest', page = 1, limit = 20 } = req.query;
        const filter = { status: 'active' };
        if (cropType) filter.cropType = { $regex: cropType, $options: 'i' };
        if (state) filter['location.state'] = state;
        if (district) filter['location.district'] = district;
        if (minPrice) filter.askingPriceINR = { ...filter.askingPriceINR, $gte: Number(minPrice) };
        if (maxPrice) filter.askingPriceINR = { ...filter.askingPriceINR, $lte: Number(maxPrice) };

        const sortMap = { newest: { createdAt: -1 }, cheapest: { askingPriceINR: 1 } };
        const total = await Listing.countDocuments(filter);
        const listings = await Listing.find(filter).sort(sortMap[sort] || sortMap.newest).skip((page - 1) * limit).limit(Number(limit)).populate('farmer', 'fullName');
        return paginatedResponse(res, listings, page, limit, total);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getMyListings = async (req, res) => {
    try {
        const listings = await Listing.find({ farmer: req.user._id }).sort({ createdAt: -1 });
        return successResponse(res, listings);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getListing = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }, { new: true }).populate('farmer', 'fullName');
        if (!listing) return errorResponse(res, 'Listing not found', 404);
        return successResponse(res, listing);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return errorResponse(res, 'Listing not found', 404);
        if (listing.farmer.toString() !== req.user._id.toString()) return errorResponse(res, 'Not authorized', 403);
        if (listing.status === 'sold') return errorResponse(res, 'Cannot update sold listing', 400);
        Object.assign(listing, req.body);
        await listing.save();
        return successResponse(res, listing, 'Listing updated');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return errorResponse(res, 'Listing not found', 404);
        if (listing.farmer.toString() !== req.user._id.toString()) return errorResponse(res, 'Not authorized', 403);
        listing.status = 'cancelled';
        await listing.save();
        return successResponse(res, null, 'Listing cancelled');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const lockPrice = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return errorResponse(res, 'Listing not found', 404);
        if (listing.farmer.toString() !== req.user._id.toString()) return errorResponse(res, 'Not authorized', 403);
        const { buyerId, agreedPriceINR, expiresAt } = req.body;
        const priceLock = await PriceLock.create({ listing: listing._id, farmer: req.user._id, buyer: buyerId, agreedPriceINR, quantityKg: listing.quantityKg, expiresAt });
        listing.priceLocked = true;
        listing.priceLockedAt = new Date();
        await listing.save();
        await Notification.create({ recipient: buyerId, type: 'price_alert', title: 'Price Locked!', message: `Price locked for ${listing.title} at ₹${agreedPriceINR}/kg`, relatedId: priceLock._id, relatedModel: 'PriceLock' });
        return successResponse(res, priceLock, 'Price locked');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

export const getDemandsNearby = async (req, res) => {
    try {
        const listings = await Listing.find({ status: 'active' }).sort({ createdAt: -1 }).limit(20);
        return successResponse(res, listings);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
