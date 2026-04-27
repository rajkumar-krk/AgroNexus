import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  gas: {
    type: Number,
    default: 0
  },
  moisture: {
    type: Number,
    default: 0
  },
  latitude: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  batchId: {
    type: String,
    default: null
  },
  deviceId: {
    type: String,
    default: 'ESP32-001'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Fast queries: latest record, history by time
sensorDataSchema.index({ timestamp: -1 });
sensorDataSchema.index({ batchId: 1, timestamp: -1 });

const SensorData = mongoose.model('SensorData', sensorDataSchema);

export default SensorData;
