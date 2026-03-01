import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        name: { type: String, required: [true, 'Farm name is required'], trim: true },
        location: {
            lat: { type: Number, required: true, min: -90, max: 90 },
            lng: { type: Number, required: true, min: -180, max: 180 },
            village: String,
            district: String,
            state: String,
            pincode: String,
        },
        areaHectares: { type: Number, required: true, min: 0.01 },
        soilType: { type: String, enum: ['clay', 'loamy', 'sandy', 'silt', 'black', 'red', 'alluvial'], default: 'loamy' },
        soilMoisturePct: { type: Number, min: 0, max: 100, default: 0 },
        irrigationType: { type: String, enum: ['drip', 'sprinkler', 'flood', 'rainfed'], default: 'rainfed' },
        landRecordId: String,
        waterCreditScore: { type: Number, default: 0, min: 0, max: 100 },
        trustScore: { type: Number, default: 50, min: 0, max: 100 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

farmSchema.index({ owner: 1 });

const Farm = mongoose.model('Farm', farmSchema);
export default Farm;
