import mongoose from 'mongoose';

const advisorySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: { type: String, enum: ['best_practice', 'pest_control', 'market', 'weather', 'scheme', 'general'], default: 'general' },
        cropTypes: [String],
        season: { type: String, enum: ['kharif', 'rabi', 'zaid', 'all'], default: 'all' },
        states: [String],
        language: { type: String, default: 'en' },
        source: String,
        publishedAt: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true },
        viewCount: { type: Number, default: 0 },
        tags: [String],
    },
    { timestamps: true }
);

advisorySchema.index({ title: 'text', content: 'text', tags: 'text' });

const Advisory = mongoose.model('Advisory', advisorySchema);
export default Advisory;
