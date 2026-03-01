import mongoose from 'mongoose';

const diseaseReportSchema = new mongoose.Schema(
    {
        crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
        farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
        farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        diseaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Disease' },
        cropType: String,
        symptoms: [String],
        results: [{ diseaseId: mongoose.Schema.Types.ObjectId, confidence: Number }],
        reportedAt: { type: Date, default: Date.now },
        location: { lat: Number, lng: Number },
    },
    { timestamps: true }
);

const DiseaseReport = mongoose.model('DiseaseReport', diseaseReportSchema);
export default DiseaseReport;
