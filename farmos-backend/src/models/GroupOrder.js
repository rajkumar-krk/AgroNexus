import mongoose from 'mongoose';

const groupOrderSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        itemType: { type: String, enum: ['fertilizer', 'seed', 'pesticide', 'equipment', 'other'] },
        itemName: { type: String, required: true },
        itemUnit: { type: String, default: 'kg' },
        description: String,
        targetQuantity: { type: Number, required: true },
        currentQuantity: { type: Number, default: 0 },
        retailPriceINR: { type: Number, required: true },
        bulkPriceINR: { type: Number, required: true },
        supplier: String,
        location: { lat: Number, lng: Number, district: String, state: String },
        radius: { type: Number, default: 30000 },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        participants: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            quantityUnits: Number,
            anonymousDisplay: { type: Boolean, default: true },
            joinedAt: { type: Date, default: Date.now },
            status: { type: String, enum: ['committed', 'paid', 'delivered'], default: 'committed' },
        }],
        status: { type: String, enum: ['open', 'target_met', 'closed', 'delivered', 'cancelled'], default: 'open' },
        closingDate: { type: Date, required: true },
        deliveryDate: Date,
        deliveryAddress: String,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

groupOrderSchema.virtual('totalSavingsINR').get(function () {
    return (this.retailPriceINR - this.bulkPriceINR) * this.currentQuantity;
});

groupOrderSchema.pre('save', function (next) {
    this.currentQuantity = this.participants.reduce((sum, p) => sum + (p.quantityUnits || 0), 0);
    if (this.currentQuantity >= this.targetQuantity && this.status === 'open') {
        this.status = 'target_met';
    }
    next();
});

const GroupOrder = mongoose.model('GroupOrder', groupOrderSchema);
export default GroupOrder;
