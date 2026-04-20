import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
  },
  batchId: {
    type: String,
    required: [true, 'Batch ID is required'],
    unique: true,
    trim: true,
  },
  origin: {
    type: String,
    required: true,
  },
  currentLocation: {
    type: String,
    default: 'Origin Farm',
  },
  storageUnit: {
    type: String,
  },
  temperature: {
    type: Number,
    default: 0,
  },
  humidity: {
    type: Number,
    default: 0,
  },
  gasLevel: {
    type: String,
    enum: ['Normal', 'Elevated', 'Danger'],
    default: 'Normal',
  },
  status: {
    type: String,
    enum: ['In Storage', 'In Transit', 'Delivered'],
    default: 'In Storage',
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity (kg) is required'],
  },
  harvestDate: {
    type: Date,
    required: true,
  },
  expectedShelfLife: {
    type: Number,
    default: 14, // days
  },
  currentShelfLife: {
    type: Number,
  },
  destination: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Pre-save hook to calculate currentShelfLife if not set
batchSchema.pre('save', function (next) {
  if (!this.currentShelfLife) {
    this.currentShelfLife = this.expectedShelfLife;
  }
  next();
});

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
