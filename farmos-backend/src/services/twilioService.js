import twilio from 'twilio';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

let client = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    console.log('✅ Twilio client initialized');
} else {
    console.warn('⚠️  Twilio not configured — SMS features disabled');
}

/**
 * Send phone verification OTP.
 */
export const sendOTPSMS = async (phone, otp) => {
    if (!client) return { success: false, reason: 'Twilio not configured' };
    try {
        const message = await client.messages.create({
            body: `Your FarmOS verification code is: ${otp}\n\nValid for 10 minutes. Do not share this code with anyone.\n- FarmOS Team`,
            from: TWILIO_PHONE_NUMBER,
            to: phone,
        });
        return { success: true, messageSid: message.sid };
    } catch (error) {
        console.error('Twilio sendOTPSMS error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Send weather or pest alert SMS.
 */
export const sendAlertSMS = async (phone, alertMessage) => {
    if (!client) return { success: false, reason: 'Twilio not configured' };
    try {
        const message = await client.messages.create({
            body: `🌾 FarmOS Alert:\n\n${alertMessage}\n\nOpen the FarmOS app for full details.`,
            from: TWILIO_PHONE_NUMBER,
            to: phone,
        });
        return { success: true, messageSid: message.sid };
    } catch (error) {
        console.error('Twilio sendAlertSMS error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Send order status update SMS.
 */
export const sendOrderUpdateSMS = async (phone, cropName, orderStatus, quantityKg) => {
    if (!client) return { success: false, reason: 'Twilio not configured' };
    const messages = {
        confirmed: `✅ FarmOS: Your order of ${quantityKg}kg ${cropName} has been CONFIRMED by the farmer. Expect delivery soon.`,
        packed: `📦 FarmOS: Your ${cropName} order (${quantityKg}kg) is packed and ready for pickup/dispatch.`,
        in_transit: `🚚 FarmOS: Your ${cropName} order (${quantityKg}kg) is on the way!`,
        delivered: `✅ FarmOS: Your ${cropName} order (${quantityKg}kg) has been delivered. Thank you for using FarmOS!`,
        cancelled: `❌ FarmOS: Your order of ${quantityKg}kg ${cropName} has been cancelled. Open the app for details.`,
    };
    const body = messages[orderStatus] || `FarmOS: Your order for ${cropName} has been updated to status: ${orderStatus}.`;
    try {
        const message = await client.messages.create({ body, from: TWILIO_PHONE_NUMBER, to: phone });
        return { success: true, messageSid: message.sid };
    } catch (error) {
        console.error('Twilio sendOrderUpdateSMS error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Send password reset OTP SMS.
 */
export const sendPasswordResetSMS = async (phone, otp) => {
    if (!client) return { success: false, reason: 'Twilio not configured' };
    try {
        const message = await client.messages.create({
            body: `Your FarmOS password reset code is: ${otp}\n\nValid for 10 minutes. If you did not request this, please ignore.\n- FarmOS Team`,
            from: TWILIO_PHONE_NUMBER,
            to: phone,
        });
        return { success: true, messageSid: message.sid };
    } catch (error) {
        console.error('Twilio sendPasswordResetSMS error:', error.message);
        return { success: false, error: error.message };
    }
};
