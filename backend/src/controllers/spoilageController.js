import Batch from '../models/Batch.js';
import SensorTelemetry from '../models/SensorTelemetry.js';

// @desc    Calculate Spoilage Risk Index for all batches or a specific batch
// @route   GET /api/v1/spoilage/risk/:batchId?
// @access  Public
export const getSpoilageRisk = async (req, res) => {
  try {
    const { batchId } = req.params;
    let batches = [];

    if (batchId) {
      const batch = await Batch.findById(batchId);
      if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
      batches = [batch];
    } else {
      batches = await Batch.find({ status: { $in: ['In Storage', 'In Transit'] } });
    }

    const riskData = await Promise.all(batches.map(async (batch) => {
      // Get last 24 hours of telemetry
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentTelemetry = await SensorTelemetry.find({
        batch: batch._id,
        timestamp: { $gte: oneDayAgo }
      });

      // Calculate Spoilage Risk Index (Algorithm Mock)
      // Factors: temperature deviations, high humidity leading to mold, elevated gas (ethylene)
      let tempVariations = 0;
      let ethyleneSpikes = 0;
      
      recentTelemetry.forEach(t => {
        if (t.temperature > 8 || t.temperature < 0) tempVariations++;
        if (t.gasLevel > 15) ethyleneSpikes++; // assuming >15 ppm is high
      });

      const totalReadings = recentTelemetry.length || 1;
      const variationRatio = tempVariations / totalReadings;
      
      // Calculate a score from 0-100 (100 being high risk of spoilage)
      let riskScore = 10; // base risk
      riskScore += (variationRatio * 50); // Up to 50 points from bad temp
      riskScore += (ethyleneSpikes > 0 ? 30 : 0); // 30 points if ethylene was detected
      
      // Normalize
      riskScore = Math.min(100, Math.round(riskScore));

      // AI recommendation
      let recommendation = "Conditions are optimal. Continuing monitoring.";
      if (riskScore > 75) recommendation = "CRITICAL: Immediate cooling required. Ethylene detected or severe temperature abuse.";
      else if (riskScore > 40) recommendation = "WARNING: Slight temperature deviations. Check chiller unit sealing.";

      return {
        batchId: batch._id,
        cropName: batch.cropName,
        internalId: batch.batchId,
        riskScore,
        tempVariations,
        ethyleneSpikes,
        recommendation,
        estimatedDaysLost: Math.round((riskScore / 100) * 5) // Loose up to 5 days of shelf life
      };
    }));

    res.status(200).json({
      success: true,
      data: batchId ? riskData[0] : riskData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
