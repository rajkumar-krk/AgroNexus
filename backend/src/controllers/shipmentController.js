import Shipment from '../models/Shipment.js';
import Batch from '../models/Batch.js';

// @desc    Get all active shipments
// @route   GET /api/v1/shipments
export const getActiveShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().populate('batch', 'batchId cropName riskLevel temperature');
    
    res.status(200).json({
      success: true,
      count: shipments.length,
      data: shipments
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get tracking info for a specific batch shipment
// @route   GET /api/v1/shipments/batch/:batchId
export const getBatchShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ batch: req.params.batchId })
      .populate('batch', 'batchId cropName riskLevel temperature humidity gasLevel');

    if (!shipment) {
      // For demo purposes, auto-generate a pseudo-shipment if none exists
      // so the UI always has something to show
      const batch = await Batch.findById(req.params.batchId);
      if (!batch) return res.status(404).json({ success: false, error: 'Batch not found' });
      
      const pseudoShipment = {
        shipmentId: `SHP-${batch.batchId}`,
        batch: batch,
        origin: batch.origin || 'Source Farm',
        destination: batch.destination || 'Distribution Center',
        status: batch.status === 'In Transit' ? 'In Transit' : 'Scheduled',
        currentLocation: { lat: 19.0760, lng: 72.8777 }, // Mumbai roughly
        estimatedArrival: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hrs from now
        driverName: 'Raj Kumar',
        vehicleId: 'MH-04-AB-1234',
        temperatureAlerts: batch.riskLevel === 'High' ? 2 : 0
      };

      return res.status(200).json({ success: true, data: pseudoShipment });
    }

    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update live coordinates of a shipment
// @route   PUT /api/v1/shipments/:id/location
export const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    let shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ success: false, error: 'Shipment not found' });
    }

    shipment.currentLocation = { lat, lng };
    shipment.routeHistory.push({ lat, lng, timestamp: new Date() });
    await shipment.save();

    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Server Error' });
  }
};
