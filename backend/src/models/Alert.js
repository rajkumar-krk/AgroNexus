import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['temperature', 'gas', 'moisture', 'humidity', 'spoilage', 'system']
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  batchId: {
    type: String,
    default: null
  },
  sensorSnapshot: {
    temperature: Number,
    humidity: Number,
    gas: Number,
    moisture: Number,
    latitude: Number,
    longitude: Number
  },
  acknowledged: {
    type: Boolean,
    default: false
  },
  resolved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

alertSchema.index({ createdAt: -1 });
alertSchema.index({ severity: 1, acknowledged: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
