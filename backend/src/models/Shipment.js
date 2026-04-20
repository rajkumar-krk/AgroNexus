import mongoose from 'mongoose';

const coordinateSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const shipmentSchema = new mongoose.Schema({
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  shipmentId: {
    type: String,
    required: true,
    unique: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Transit', 'Delayed', 'Delivered'],
    default: 'Scheduled'
  },
  driverName: String,
  vehicleId: String,
  departureTime: Date,
  estimatedArrival: Date,
  actualArrival: Date,
  currentLocation: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 } // Default to New Delhi for mock
  },
  routeHistory: [coordinateSchema],
  temperatureAlerts: { type: Number, default: 0 },
  delayReason: String
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);

export default Shipment;
