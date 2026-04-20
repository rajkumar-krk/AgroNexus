import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema(
    {
        commodity: { type: String, required: true },
        variety: String,
        market: { type: String, required: true },
        state: { type: String, required: true },
        district: String,
        minPriceINR: { type: Number, required: true },
        maxPriceINR: { type: Number, required: true },
        modalPriceINR: { type: Number, required: true },
        unit: { type: String, default: 'quintal' },
        priceDate: { type: Date, required: true },
        source: { type: String, default: 'Agmarknet' },
    },
    { timestamps: true }
);

marketPriceSchema.index({ commodity: 1, priceDate: -1, market: 1 });

const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);
export default MarketPrice;
