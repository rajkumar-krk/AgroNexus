import mongoose from 'mongoose';

const pestAlertSchema = new mongoose.Schema(
    {
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
        pestType: { type: String, required: true },
        cropAffected: String,
        severity: { type: String, enum: ['spotted', 'moderate', 'severe', 'devastating'] },
        description: String,
        location: {
            lat: Number,
            lng: Number,
        },
        affectedAreaHectares: Number,
        isVerified: { type: Boolean, default: false },
        broadcastRadius: { type: Number, default: 50000 },
        notifiedFarmerCount: { type: Number, default: 0 },
        status: { type: String, enum: ['active', 'contained', 'resolved'], default: 'active' },
    },
    { timestamps: true }
);

pestAlertSchema.index({ status: 1, createdAt: -1 });

const PestAlert = mongoose.model('PestAlert', pestAlertSchema);
export default PestAlert;
