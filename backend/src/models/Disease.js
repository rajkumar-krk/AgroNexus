import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        localNames: [{ language: String, name: String }],
        cropTypes: { type: [String], index: true },
        symptoms: [String],
        description: String,
        causes: [String],
        treatments: {
            organic: [String],
            chemical: [String],
            preventive: [String],
        },
        severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
        spreadRisk: { type: String, enum: ['low', 'medium', 'high'] },
        season: { type: String, enum: ['kharif', 'rabi', 'zaid', 'all'], default: 'all' },
        climateConditions: {
            minTempC: Number,
            maxTempC: Number,
            humidityAbovePct: Number,
        },
        imageUrl: String,
    },
    { timestamps: true }
);

diseaseSchema.index({ name: 'text', symptoms: 'text', description: 'text' });

const Disease = mongoose.model('Disease', diseaseSchema);
export default Disease;
