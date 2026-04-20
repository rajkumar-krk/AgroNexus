import SensorTelemetry from '../models/SensorTelemetry.js';
import Batch from '../models/Batch.js';

// @desc    Get telemetry history for a batch
// @route   GET /api/v1/telemetry/:batchId
// @access  Public
export const getBatchTelemetry = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    // Find all telemetry mapping to this batch, up to 100 recent points
    const telemetry = await SensorTelemetry.find({ batch: batchId })
      .sort('-timestamp')
      .limit(100);

    res.status(200).json({
      success: true,
      count: telemetry.length,
      data: telemetry.reverse() // Return chronological order
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add a single telemetry point
// @route   POST /api/v1/telemetry
// @access  Public
export const addTelemetry = async (req, res) => {
  try {
    const { batchId, sensorId, temperature, humidity, gasLevel, status } = req.body;
    
    // Ensure batch exists
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    const telemetry = await SensorTelemetry.create({
      batch: batchId,
      sensorId,
      temperature,
      humidity,
      gasLevel,
      status
    });

    // We could update the Batch's current reading seamlessly here
    batch.temperature = temperature;
    batch.humidity = humidity;
    await batch.save();

    res.status(201).json({
      success: true,
      data: telemetry
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
