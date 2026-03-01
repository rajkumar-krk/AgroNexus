import mongoose from 'mongoose';

const weatherLogSchema = new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    date: { type: String, required: true },
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    windspeed: Number,
    alerts: [{ type: String, severity: String, message: String }],
    createdAt: { type: Date, default: Date.now },
});

weatherLogSchema.index({ farm: 1, date: 1 }, { unique: true });

const WeatherLog = mongoose.model('WeatherLog', weatherLogSchema);
export default WeatherLog;
