import Batch from '../models/Batch.js';

// @desc    Get all batches (optionally filtered by user/owner, status, etc)
// @route   GET /api/v1/batches
// @access  Public (in this iteration)
export const getBatches = async (req, res) => {
  try {
    const { status, riskLevel, storageUnit } = req.query;
    
    // Build query
    let query = {};
    if (status) query.status = status;
    if (riskLevel) query.riskLevel = riskLevel;
    if (storageUnit) query.storageUnit = storageUnit;

    const batches = await Batch.find(query).sort('-createdAt').populate('owner', 'fullName email');

    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single batch
// @route   GET /api/v1/batches/:id
// @access  Public
export const getBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('owner', 'fullName email');
    
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    res.status(200).json({ success: true, data: batch });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new batch
// @route   POST /api/v1/batches
// @access  Public
export const addBatch = async (req, res) => {
  try {
    // Usually req.user.id from auth middleware. Hardcoding for now if not provided,
    // assuming a fallback user ID or we make it required from frontend payload.
    const batch = await Batch.create(req.body);

    res.status(201).json({
      success: true,
      data: batch
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update batch
// @route   PUT /api/v1/batches/:id
// @access  Public
export const updateBatch = async (req, res) => {
  try {
    let batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: batch });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete batch
// @route   DELETE /api/v1/batches/:id
// @access  Public
export const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    await batch.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get batch statistics
// @route   GET /api/v1/batches/stats/overview
// @access  Public
export const getBatchStats = async (req, res) => {
  try {
    const batches = await Batch.find({});
    
    const stats = {
      total: batches.length,
      inStorage: batches.filter(b => b.status === 'In Storage').length,
      inTransit: batches.filter(b => b.status === 'In Transit').length,
      highRisk: batches.filter(b => b.riskLevel === 'High').length,
      mediumRisk: batches.filter(b => b.riskLevel === 'Medium').length,
      lowRisk: batches.filter(b => b.riskLevel === 'Low').length,
      totalQuantity: batches.reduce((sum, b) => sum + (b.quantity || 0), 0),
      averageTemperature: batches.length ? batches.reduce((sum, b) => sum + b.temperature, 0) / batches.length : 0,
      averageHumidity: batches.length ? batches.reduce((sum, b) => sum + b.humidity, 0) / batches.length : 0
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
