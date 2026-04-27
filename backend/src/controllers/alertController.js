import Alert from '../models/Alert.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all alerts (sorted by most recent, with optional filters)
 * @route   GET /api/v1/alerts
 * @access  Public
 */
export const getAlerts = async (req, res) => {
  try {
    const {
      severity,
      type,
      acknowledged,
      batchId,
      limit = 50,
      page = 1
    } = req.query;

    const query = {};
    if (severity) query.severity = severity;
    if (type) query.type = type;
    if (acknowledged !== undefined) query.acknowledged = acknowledged === 'true';
    if (batchId) query.batchId = batchId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [alerts, total] = await Promise.all([
      Alert.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Alert.countDocuments(query)
    ]);

    return successResponse(res, {
      alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, `${alerts.length} alerts found`);

  } catch (error) {
    console.error('getAlerts error:', error);
    return errorResponse(res, 'Failed to fetch alerts', 500);
  }
};

/**
 * @desc    Get alert statistics summary
 * @route   GET /api/v1/alerts/stats
 * @access  Public
 */
export const getAlertStats = async (req, res) => {
  try {
    const [total, active, critical, high, medium, low] = await Promise.all([
      Alert.countDocuments(),
      Alert.countDocuments({ acknowledged: false }),
      Alert.countDocuments({ severity: 'critical', acknowledged: false }),
      Alert.countDocuments({ severity: 'high', acknowledged: false }),
      Alert.countDocuments({ severity: 'medium', acknowledged: false }),
      Alert.countDocuments({ severity: 'low', acknowledged: false })
    ]);

    return successResponse(res, {
      total,
      active,
      resolved: total - active,
      bySeverity: { critical, high, medium, low }
    }, 'Alert statistics');

  } catch (error) {
    console.error('getAlertStats error:', error);
    return errorResponse(res, 'Failed to fetch alert stats', 500);
  }
};

/**
 * @desc    Acknowledge an alert
 * @route   PATCH /api/v1/alerts/:id/acknowledge
 * @access  Public
 */
export const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { acknowledged: true },
      { new: true }
    );

    if (!alert) {
      return errorResponse(res, 'Alert not found', 404);
    }

    return successResponse(res, alert, 'Alert acknowledged');
  } catch (error) {
    console.error('acknowledgeAlert error:', error);
    return errorResponse(res, 'Failed to acknowledge alert', 500);
  }
};

/**
 * @desc    Resolve an alert
 * @route   PATCH /api/v1/alerts/:id/resolve
 * @access  Public
 */
export const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { acknowledged: true, resolved: true },
      { new: true }
    );

    if (!alert) {
      return errorResponse(res, 'Alert not found', 404);
    }

    return successResponse(res, alert, 'Alert resolved');
  } catch (error) {
    console.error('resolveAlert error:', error);
    return errorResponse(res, 'Failed to resolve alert', 500);
  }
};
