import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema({
  risk: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  issue: {
    type: String,
    required: true
  },
  recommendation: {
    type: String,
    required: true
  },
  batchId: {
    type: String,
    default: null
  },
  basedOn: {
    temperature: Number,
    humidity: Number,
    gas: Number,
    moisture: Number,
    latitude: Number,
    longitude: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

aiInsightSchema.index({ createdAt: -1 });

const AIInsight = mongoose.model('AIInsight', aiInsightSchema);

export default AIInsight;
