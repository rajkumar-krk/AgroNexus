import axios from 'axios';
import logger from '../utils/logger.js';

/**
 * Send an email alert automatically via EmailJS.
 * Requires env vars: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY
 * @param {Object} data - { event, status, location, time, details }
 */
export const sendCloudAlertEmail = async (data) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    logger.warn('EmailJS credentials not configured — skipping email alert');
    return;
  }

  try {
    await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: data,
    });

    logger.info(`Email sent for event: ${data.event}`);
  } catch (error) {
    logger.error('Email failed:', error.response?.data || error.message);
  }
};
