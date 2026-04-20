import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  sensorId: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  gasLevel: {
    type: Number,
    default: 0 // parts per million (e.g. ethylene)
  },
  status: {
    type: String,
    enum: ['Normal', 'Warning', 'Critical'],
    default: 'Normal'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create index for fast time-series queries matching a batch
telemetrySchema.index({ batch: 1, timestamp: -1 });

const SensorTelemetry = mongoose.model('SensorTelemetry', telemetrySchema);

export default SensorTelemetry;
