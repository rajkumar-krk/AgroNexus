import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
        quantityKg: { type: Number, required: true, min: 0.5 },
        pricePerKgINR: { type: Number, required: true },
        totalAmountINR: Number,
        status: { type: String, enum: ['pending', 'confirmed', 'packed', 'in_transit', 'delivered', 'cancelled', 'disputed'], default: 'pending' },
        statusHistory: [{
            status: String,
            changedAt: { type: Date, default: Date.now },
            changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            note: String,
        }],
        deliveryAddress: { line1: String, village: String, district: String, state: String, pincode: String },
        expectedDeliveryDate: Date,
        actualDeliveryDate: Date,
        paymentStatus: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
        paymentMethod: { type: String, enum: ['cash', 'upi', 'bank_transfer', 'credit'] },
        buyerNotes: String,
        sellerNotes: String,
        disputeReason: String,
    },
    { timestamps: true }
);

orderSchema.pre('save', function (next) {
    this.totalAmountINR = this.quantityKg * this.pricePerKgINR;
    next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
