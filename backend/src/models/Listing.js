import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
    {
        farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
        crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
        title: { type: String, required: true, trim: true },
        description: String,
        cropType: { type: String, required: true },
        variety: String,
        quantityKg: { type: Number, required: true, min: 1 },
        availableKg: Number,
        askingPriceINR: { type: Number, required: true },
        negotiable: { type: Boolean, default: true },
        quality: { type: String, enum: ['A', 'B', 'C'], default: 'B' },
        availableFrom: { type: Date, required: true },
        availableTill: Date,
        location: { lat: Number, lng: Number, district: String, state: String },
        images: [String],
        status: { type: String, enum: ['active', 'sold', 'expired', 'cancelled'], default: 'active', index: true },
        viewCount: { type: Number, default: 0 },
        priceLocked: { type: Boolean, default: false },
        priceLockedAt: Date,
        buyerInterestCount: { type: Number, default: 0 },
        harvestExpectedAt: Date,
    },
    { timestamps: true }
);

listingSchema.index({ farmer: 1, status: 1, cropType: 1 });

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
