import mongoose from 'mongoose';

const priceLockSchema = new mongoose.Schema({
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    agreedPriceINR: { type: Number, required: true },
    quantityKg: Number,
    expiresAt: Date,
    status: { type: String, enum: ['pending', 'confirmed', 'expired', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

const PriceLock = mongoose.model('PriceLock', priceLockSchema);
export default PriceLock;
