import mongoose from 'mongoose';

const inputLogSchema = new mongoose.Schema({
    inputType: { type: String, enum: ['fertilizer', 'pesticide', 'water', 'seed', 'other'] },
    name: String,
    quantityKg: Number,
    costINR: Number,
    appliedAt: { type: Date, default: Date.now },
    notes: String,
}, { _id: true });

const weatherStressSchema = new mongoose.Schema({
    type: String,
    date: Date,
    severity: String,
    impact: String,
}, { _id: true });

const cropSchema = new mongoose.Schema(
    {
        farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        cropType: { type: String, required: true, trim: true },
        variety: { type: String, trim: true },
        plantedAt: { type: Date, required: true },
        expectedHarvest: { type: Date, required: true },
        actualHarvest: Date,
        areaHectares: { type: Number, required: true, min: 0.01 },
        yieldEstimateKg: { type: Number, default: 0 },
        actualYieldKg: Number,
        status: { type: String, enum: ['growing', 'harvested', 'failed', 'sold'], default: 'growing', index: true },
        inputLog: [inputLogSchema],
        totalInputCostINR: { type: Number, default: 0 },
        revenueINR: { type: Number, default: 0 },
        weatherStressEvents: [weatherStressSchema],
        season: { type: String, enum: ['kharif', 'rabi', 'zaid'] },
        irrigationHours: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

cropSchema.virtual('profitINR').get(function () {
    return this.revenueINR - this.totalInputCostINR;
});

cropSchema.pre('save', function (next) {
    if (this.inputLog && this.inputLog.length > 0) {
        this.totalInputCostINR = this.inputLog.reduce((sum, item) => sum + (item.costINR || 0), 0);
    }
    next();
});

cropSchema.index({ farm: 1, status: 1 });

const Crop = mongoose.model('Crop', cropSchema);
export default Crop;
